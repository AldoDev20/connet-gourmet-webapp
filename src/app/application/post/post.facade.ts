import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostHttpRepository } from '../../infrastructure/persistence/post-http.repository';
import { Post, Comment } from '../../domain/post/models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostFacade {
  private postsSubject = new BehaviorSubject<Post[]>([]);
  posts$: Observable<Post[]> = this.postsSubject.asObservable();

  constructor(private postRepository: PostHttpRepository) {}

  loadFeed(): void {
    this.postRepository.getFeed().subscribe(posts => {
      this.postsSubject.next(posts);
    });
  }

  createPost(content: string, imageUrl?: string, videoUrl?: string, location?: string, ingredients?: string[]): void {
    this.postRepository.createPost(content, imageUrl, videoUrl, location, ingredients).subscribe(newPost => {
      const currentPosts = this.postsSubject.value;
      this.postsSubject.next([newPost, ...currentPosts]);
    });
  }

  toggleLike(postId: string): void {
    this.postRepository.toggleLike(postId).subscribe(isLiked => {
      const currentPosts = this.postsSubject.value.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: isLiked,
            likesCount: post.likesCount + (isLiked ? 1 : -1)
          };
        }
        return post;
      });
      this.postsSubject.next(currentPosts);
    });
  }

  addComment(postId: string, content: string): void {
    this.postRepository.addComment(postId, content).subscribe(newComment => {
      const currentPosts = this.postsSubject.value.map(post => {
        if (post.id === postId) {
          const updatedComments = post.comments ? [...post.comments, newComment] : [newComment];
          return {
            ...post,
            comments: updatedComments,
            commentsCount: post.commentsCount + 1
          };
        }
        return post;
      });
      this.postsSubject.next(currentPosts);
    });
  }
}
