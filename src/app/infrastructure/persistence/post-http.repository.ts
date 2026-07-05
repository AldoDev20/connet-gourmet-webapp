import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PostRepository } from '../../domain/post/post.repository';
import { Post, Comment } from '../../domain/post/models/post.model';
import { API_CONFIG } from '../../core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class PostHttpRepository implements PostRepository {
  private apiUrl = `${API_CONFIG.baseUrl}/api/posts`;

  constructor(private http: HttpClient) {}

  private mapPostFromApi(apiPost: any): Post {
    const media = apiPost.content?.media || [];
    const imageMedia = media.find((m: any) => m.type === 'image');
    const videoMedia = media.find((m: any) => m.type === 'video');

    const storedUser = localStorage.getItem('gc_user');
    const currentUserId = storedUser ? JSON.parse(storedUser).id : 'chef-gaston';

    let creatorName = apiPost.creatorName || 'Chef Gourmet';
    let creatorAvatar = apiPost.creatorAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYUXB9Os_jDGO3-j-8Om-Pl-Dp41NYKcnHVMnxQR4A_bYZvEj4YpU3m1fMLkp6tpn7OWHW5lQluX61Szjk1-OEsdwJXzkfX4_MA7lzxnOZDA5bo-WWY_gQLx_RlaBQFAq7GDzah-Hgl75nSghnbXZtagXABkvdeurzfhRC9MgpQmz8_yfECS4BO9hH_RxCECcw0ozVDsd7buSN7F1uAWW4Bfn8d45ITi--PhZjUZ2nNfTnLor1jzAjgw';

    if (apiPost.creatorId === 'chef-gaston' || apiPost.creatorId === currentUserId) {
      creatorName = storedUser ? JSON.parse(storedUser).name : (apiPost.creatorName || 'Chef Gastón');
      creatorAvatar = storedUser ? JSON.parse(storedUser).avatarUrl : (apiPost.creatorAvatar || creatorAvatar);
    } else if (apiPost.creatorId === 'lucia-mendoza' || apiPost.creatorId === 'sofia_sabe_rico') {
      creatorName = apiPost.creatorName || 'Sofía Mendoza';
      creatorAvatar = apiPost.creatorAvatar || 'https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=687&auto=format&fit=crop';
    } else if (apiPost.creatorId === 'don-ricardo' || apiPost.creatorId === 'cafe_chanchamayo_oficial') {
      creatorName = apiPost.creatorName || 'Finca La Esperanza';
      creatorAvatar = apiPost.creatorAvatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQICwc4phTMLNULoRz3k_s8OMS4JXu6AVs8w&s';
    }

    const likedKey = `liked_${currentUserId}_${apiPost.id}`;
    const isLiked = localStorage.getItem(likedKey) === 'true';

    let contentText = '';
    if (apiPost.content) {
      if (typeof apiPost.content === 'string') {
        contentText = apiPost.content;
      } else if (apiPost.content.text) {
        contentText = apiPost.content.text;
      }
    }

    return {
      id: apiPost.id,
      creatorId: apiPost.creatorId,
      creatorName: creatorName,
      creatorAvatar: creatorAvatar,
      creatorLocation: apiPost.creatorLocation || apiPost.locationLabel || 'Lima, Peru',
      content: contentText,
      imageUrl: apiPost.imageUrl || imageMedia?.url || '',
      videoUrl: apiPost.videoUrl || videoMedia?.url || '',
      likesCount: apiPost.likesCount !== undefined ? apiPost.likesCount : (apiPost.engagement?.likesCount || 0),
      commentsCount: apiPost.commentsCount !== undefined ? apiPost.commentsCount : (apiPost.engagement?.commentsCount || 0),
      isLiked: isLiked,
      locationLabel: apiPost.locationLabel,
      hasRecipe: apiPost.hasRecipe || false,
      recipeTitle: apiPost.recipeTitle,
      comments: (apiPost.comments || []).map((c: any) => ({
        id: c.id || `comment-${Date.now()}-${Math.random()}`,
        postId: apiPost.id,
        userName: c.userName || 'Usuario',
        userAvatar: c.userAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYUXB9Os_jDGO3-j-8Om-Pl-Dp41NYKcnHVMnxQR4A_bYZvEj4YpU3m1fMLkp6tpn7OWHW5lQluX61Szjk1-OEsdwJXzkfX4_MA7lzxnOZDA5bo-WWY_gQLx_RlaBQFAq7GDzah-Hgl75nSghnbXZtagXABkvdeurzfhRC9MgpQmz8_yfECS4BO9hH_RxCECcw0ozVDsd7buSN7F1uAWW4Bfn8d45ITi--PhZjUZ2nNfTnLor1jzAjgw',
        content: c.content || c.text || '',
        timestamp: c.timestamp || (c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now')
      })),
      ingredients: apiPost.ingredients || apiPost.content?.tags || []
    };
  }

  getFeed(): Observable<Post[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(posts => {
        if (!posts) return [];
        return posts.map(p => this.mapPostFromApi(p));
      })
    );
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(p => this.mapPostFromApi(p))
    );
  }

  createPost(content: string, imageUrl?: string, videoUrl?: string, location?: string, ingredients?: string[]): Observable<Post> {
    const storedUser = localStorage.getItem('gc_user');
    const currentUserId = storedUser ? JSON.parse(storedUser).id : 'chef-gaston';

    const postPayload = {
      creatorId: currentUserId,
      type: 'recipe',
      content: {
        text: content,
        media: [
          ...(imageUrl ? [{ type: 'image', url: imageUrl }] : []),
          ...(videoUrl ? [{ type: 'video', url: videoUrl }] : [])
        ],
        tags: ingredients || []
      },
      location: {
        type: 'Point',
        coordinates: [-76.9562, -12.0483]
      },
      hasRecipe: ingredients && ingredients.length > 0 ? true : false,
      locationLabel: location || 'Lima, Peru'
    };

    return this.http.post<any>(this.apiUrl, postPayload).pipe(
      map(res => this.mapPostFromApi(res))
    );
  }

  toggleLike(postId: string): Observable<boolean> {
    const storedUser = localStorage.getItem('gc_user');
    const currentUserId = storedUser ? JSON.parse(storedUser).id : 'chef-gaston';
    const likedKey = `liked_${currentUserId}_${postId}`;
    const wasLiked = localStorage.getItem(likedKey) === 'true';
    const isLikedNow = !wasLiked;

    // Based on API docs, there is no /like endpoint, so we update the post using PUT
    return this.http.get<any>(`${this.apiUrl}/${postId}`).pipe(
      switchMap(post => {
        if (!post.engagement) post.engagement = { likesCount: 0, commentsCount: 0, sharesCount: 0 };
        if (isLikedNow) {
          post.engagement.likesCount++;
        } else {
          post.engagement.likesCount = Math.max(0, post.engagement.likesCount - 1);
        }
        return this.http.put<any>(`${this.apiUrl}/${postId}`, post);
      }),
      map(res => {
        localStorage.setItem(likedKey, isLikedNow ? 'true' : 'false');
        return isLikedNow;
      })
    );
  }

  getComments(postId: string): Observable<Comment[]> {
    return this.getPostById(postId).pipe(
      map(post => post.comments || [])
    );
  }

  addComment(postId: string, content: string): Observable<Comment> {
    const storedUser = localStorage.getItem('gc_user');
    const currentUserName = storedUser ? JSON.parse(storedUser).name : 'Chef Gastón';
    const currentUserAvatar = storedUser ? JSON.parse(storedUser).avatarUrl : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYUXB9Os_jDGO3-j-8Om-Pl-Dp41NYKcnHVMnxQR4A_bYZvEj4YpU3m1fMLkp6tpn7OWHW5lQluX61Szjk1-OEsdwJXzkfX4_MA7lzxnOZDA5bo-WWY_gQLx_RlaBQFAq7GDzah-Hgl75nSghnbXZtagXABkvdeurzfhRC9MgpQmz8_yfECS4BO9hH_RxCECcw0ozVDsd7buSN7F1uAWW4Bfn8d45ITi--PhZjUZ2nNfTnLor1jzAjgw';
    const currentUserId = storedUser ? JSON.parse(storedUser).id : 'chef-gaston';

    const newComment = {
      id: `comment-${Date.now()}`,
      postId: postId,
      userId: currentUserId,
      userName: currentUserName,
      userAvatar: currentUserAvatar,
      content: content,
      timestamp: new Date().toISOString()
    };

    return this.http.get<any>(`${this.apiUrl}/${postId}`).pipe(
      switchMap(post => {
        if (!post.comments) post.comments = [];
        post.comments.push(newComment);
        if (!post.engagement) post.engagement = { likesCount: 0, commentsCount: 0, sharesCount: 0 };
        post.engagement.commentsCount = post.comments.length;
        
        return this.http.put<any>(`${this.apiUrl}/${postId}`, post);
      }),
      map(() => newComment)
    );
  }

  getPostsByUser(creatorId: string): Observable<Post[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${creatorId}`).pipe(
      map(posts => {
        if (!posts) return [];
        return posts.map(p => this.mapPostFromApi(p));
      })
    );
  }

  updatePost(id: string, data: Partial<Post>): Observable<Post> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(
      map(res => this.mapPostFromApi(res))
    );
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
