import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PostRepository } from '../../domain/post/post.repository';
import { Post, Comment } from '../../domain/post/models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostHttpRepository implements PostRepository {
  private apiUrl = '/api/posts';

  // Datos mock correspondientes a 'feed-social.html' y 'perfil-creador.html'
  private mockPosts: Post[] = [
    {
      id: 'post-1',
      creatorId: 'lucia-mendoza',
      creatorName: 'Lucia Mendoza',
      creatorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACrGH3GG11AyLNzF7GxyLJNRDAEX2dV3gcf8EztS5rEwr1LKBNlLvIKcIr3DSjg1w7X0BbWOwbO6pt3-zYZMwzXyBW_ImLVgxexqWKOGE1T7-YYauezJFGSdwWgh09nue-C7URwRXWgj1DQJt3fz3O8Amb43ln68jgJv4PN1KY9B-dAh0Osf_Fe-6eB3qj57_iIxaVIAlko3QipCj-D20L757DL2kV-L1kgg0bTeoQXuvPPMaBmgnKZw',
      creatorLocation: 'Cevichería El Sol, Lima',
      content: 'The Leche de Tigre here is absolutely transformative! 🍋🐟 You can really taste the freshness of the morning catch. A must-visit if you\'re exploring Callao.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4ySWXDFmyX7iUfJOuy7M_Xv8RN0U22SND7F2gCluwz1AAExmMwS3UG_iRPCLooDnhqxv_mEfKn0VB7fJz98iXda2Pvg2BALfJWV6qPQAnFmVs8ljV8ZsW7szwsxPqRXG43ezjubO79s2rWPjfKfaCiRaigSPQLZPjROAF6iZ3W0epFdumVHqtHRwexYb6eTaxhJA6jcG737z75GFx1WvaJCcJaImU_CvYuwA0aEsJbxNCD7KYObAWSA',
      likesCount: 1200,
      commentsCount: 84,
      isLiked: false,
      locationLabel: 'LIMA',
      comments: [
        {
          id: 'c1',
          postId: 'post-1',
          userName: 'Chef Gastón',
          userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU_mE0xX3d2mpLYASUf8apMK71w_Ay8jayOQXQM-OTP6jas8CP_PBrKpPai4NTx1ZURrDt3Z5rvzRRVyS5B_rrwkL02zS7oPMTq78yAFfsDgkkuU_g2YWnYgO4RxduyJNHnFGYmP36bZYPt-q6EbZUg30Q6ni6vk4gdJ79tmKN3iJTRH7tyngMXIk7KCYaZSmQ3AiJKhwP1Fs2hDM3uvrPR7EeU_HhHOLKgjEICj_z2QNSRaEjxUS73g',
          content: 'Totalmente de acuerdo Lucía. El limón norteño que usan ahí tiene el nivel exacto de acidez.',
          timestamp: '1 hour ago'
        }
      ]
    },
    {
      id: 'post-2',
      creatorId: 'don-ricardo',
      creatorName: 'Don Ricardo',
      creatorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvKEQ9ISqqPAMGO7s8OvokM6ROT4TYSQdR_jFCTHKxO9QJIDlGJVknmR8Y3CObb9-2swE2DOJ7Tz0uDS-L95e1_V6DBDtjPmjTqXef4wOeEPVvv9mtX6DXTzA6gKC2QDXLlgmQxvMoQ30qB4cq4xhEiaCE1mmNbykphg24eH1eaV6xWaVF4uF18_Z88W_QiaoRxtyM95pgw5crgn1QNrsKAWwuIa8lX2kpmMZ2OQWuwLUWh5Izt8VmGg',
      creatorLocation: 'Valle Sagrado, Cusco',
      content: 'Watching the lomo hit the hot wok is a melody of its own. Using my family\'s heirloom potatoes makes all the difference. 🔥🥔',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSUsJdH8G0T7qEMr1FNSu14jWSiI5MHWeguWcMBQM1l4J2YUereEU0n2NhH9D2aCOW66zaNYa4lKE4nnYgm2NodiQywDYuiPSeF2lgVne-El0_OQ9Z1MUbNvUlcnwS7KH0-SLaFjP9trBvcYouucP_YVyTo-b2l0w5OPO3Jgh-c9zgw7Qi3vqytEchHYxPM8Ef5YrHKR8s_JIy5yMNCFra0Yq-Rgs0VZ-fxNgHFOArphoudscv9Im0Kg',
      likesCount: 3500,
      commentsCount: 156,
      isLiked: false,
      locationLabel: 'CUSCO',
      comments: []
    },
    // Posts de Chef Gastón (para la vista de Perfil)
    {
      id: 'post-gaston-1',
      creatorId: 'chef-gaston',
      creatorName: 'Chef Gastón',
      creatorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU_mE0xX3d2mpLYASUf8apMK71w_Ay8jayOQXQM-OTP6jas8CP_PBrKpPai4NTx1ZURrDt3Z5rvzRRVyS5B_rrwkL02zS7oPMTq78yAFfsDgkkuU_g2YWnYgO4RxduyJNHnFGYmP36bZYPt-q6EbZUg30Q6ni6vk4gdJ79tmKN3iJTRH7tyngMXIk7KCYaZSmQ3AiJKhwP1Fs2hDM3uvrPR7EeU_HhHOLKgjEICj_z2QNSRaEjxUS73g',
      creatorLocation: 'Cusco',
      content: 'Sourcing the freshest corn for today\'s special Chicha de Jora. Sustainability starts at the root.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuNwmkiZADQqKMuxxKhWNVwtDf_xgpcNDTBZW6hlE1wAwNhq9WoT-mKqxSMSUC8m-BIWp1atSnfWInCbTz_9PMaiwijQnzhuSzW_MAxBmEn1yG6BFjTwAStI3pfMtsudT8rlrAEvPuQSujbQmWTMqFjEUlRcef4CCPKyFIIKKQgHwcojV6aW0CcvNmF4vbSUyvDWfkwf_PYvsqfeNQBvQsGIAnFOU792F-Jv8XPBxE7kVeyXFQW5FNHA',
      likesCount: 1200,
      commentsCount: 84,
      isLiked: false,
      locationLabel: 'CUSCO',
      hasRecipe: true,
      recipeTitle: 'Chicha de Jora Especial',
      comments: []
    },
    {
      id: 'post-gaston-2',
      creatorId: 'chef-gaston',
      creatorName: 'Chef Gastón',
      creatorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU_mE0xX3d2mpLYASUf8apMK71w_Ay8jayOQXQM-OTP6jas8CP_PBrKpPai4NTx1ZURrDt3Z5rvzRRVyS5B_rrwkL02zS7oPMTq78yAFfsDgkkuU_g2YWnYgO4RxduyJNHnFGYmP36bZYPt-q6EbZUg30Q6ni6vk4gdJ79tmKN3iJTRH7tyngMXIk7KCYaZSmQ3AiJKhwP1Fs2hDM3uvrPR7EeU_HhHOLKgjEICj_z2QNSRaEjxUS73g',
      creatorLocation: 'Lima, Peru',
      content: 'Master the high-heat wok toss for the perfect smoky finish.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1XtEkkwyYPDDganzlpxgC1yvWYXck3ft8IYlpYBHSleee-nrPrhL_EJ3S46Qa2FzRJ5CQ44qCn8qSDAJe_2-qGGnRObdOK-YEEK_i7aOTM14bwtoY_KHdbgU39pMHTa4Xg4dD_sn31eD2jDXRBo7KaWIUkCZIBngFp4-dg0alJUdtqjHfPX0_Wros9p5IJcNDFJCYjmJuqNLToAGEvy-dULlpChnKSp4bje8fKRB-AAokcJEYs7mDHw',
      likesCount: 5400,
      commentsCount: 224,
      isLiked: false,
      videoUrl: 'https://sample-video.mp4',
      comments: []
    },
    {
      id: 'post-gaston-3',
      creatorId: 'chef-gaston',
      creatorName: 'Chef Gastón',
      creatorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU_mE0xX3d2mpLYASUf8apMK71w_Ay8jayOQXQM-OTP6jas8CP_PBrKpPai4NTx1ZURrDt3Z5rvzRRVyS5B_rrwkL02zS7oPMTq78yAFfsDgkkuU_g2YWnYgO4RxduyJNHnFGYmP36bZYPt-q6EbZUg30Q6ni6vk4gdJ79tmKN3iJTRH7tyngMXIk7KCYaZSmQ3AiJKhwP1Fs2hDM3uvrPR7EeU_HhHOLKgjEICj_z2QNSRaEjxUS73g',
      creatorLocation: 'Sacred Valley',
      content: 'Today I visited the high altitude farms of Sacred Valley to learn about biodiversity from the source. These potatoes aren\'t just food; they are history.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOYPvk3JxWDgE6M38bzdSaXRi24sitmJAkVL_JdD4A5YrIt3hStHLgtcYfbTvUnZQByqKzEslN8UTRsvWJk4NiOmj34-jTCwZYtYUU0Hw7rgiB0DSw0jBRj0amdgGc4aXshmIz4sW-vivKArXMFsGOQfEmEcv0Gp9vB0d-ggTTOyJB0elXPREWulwqeBJy7GD1neemfypXHWCAw8vrpY4M1B9jB7MDSH7YkX8mlF3ZtCeT4REXJ3wvrQ',
      likesCount: 890,
      commentsCount: 42,
      isLiked: false,
      comments: []
    }
  ];

  constructor(private http: HttpClient) {}

  getFeed(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      catchError(() => {
        return of(this.mockPosts);
      })
    );
  }

  createPost(content: string, imageUrl?: string, videoUrl?: string, location?: string, ingredients?: string[]): Observable<Post> {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      creatorId: 'chef-gaston',
      creatorName: 'Chef Gastón',
      creatorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU_mE0xX3d2mpLYASUf8apMK71w_Ay8jayOQXQM-OTP6jas8CP_PBrKpPai4NTx1ZURrDt3Z5rvzRRVyS5B_rrwkL02zS7oPMTq78yAFfsDgkkuU_g2YWnYgO4RxduyJNHnFGYmP36bZYPt-q6EbZUg30Q6ni6vk4gdJ79tmKN3iJTRH7tyngMXIk7KCYaZSmQ3AiJKhwP1Fs2hDM3uvrPR7EeU_HhHOLKgjEICj_z2QNSRaEjxUS73g',
      creatorLocation: location || 'Lima, Peru',
      content: content,
      imageUrl: imageUrl || '',
      videoUrl: videoUrl || '',
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      comments: [],
      ingredients: ingredients || []
    };

    return this.http.post<Post>(this.apiUrl, newPost).pipe(
      catchError(() => {
        // Añadir a nuestra lista local
        this.mockPosts.unshift(newPost);
        return of(newPost);
      })
    );
  }

  toggleLike(postId: string): Observable<boolean> {
    return this.http.post<{ liked: boolean }>(`${this.apiUrl}/${postId}/like`, {}).pipe(
      map(res => res.liked),
      catchError(() => {
        const post = this.mockPosts.find(p => p.id === postId);
        if (post) {
          post.isLiked = !post.isLiked;
          post.likesCount += post.isLiked ? 1 : -1;
          return of(post.isLiked);
        }
        return of(false);
      })
    );
  }

  getComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${postId}/comments`).pipe(
      catchError(() => {
        const post = this.mockPosts.find(p => p.id === postId);
        return of(post?.comments || []);
      })
    );
  }

  addComment(postId: string, content: string): Observable<Comment> {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId: postId,
      userName: 'Chef Gastón',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU_mE0xX3d2mpLYASUf8apMK71w_Ay8jayOQXQM-OTP6jas8CP_PBrKpPai4NTx1ZURrDt3Z5rvzRRVyS5B_rrwkL02zS7oPMTq78yAFfsDgkkuU_g2YWnYgO4RxduyJNHnFGYmP36bZYPt-q6EbZUg30Q6ni6vk4gdJ79tmKN3iJTRH7tyngMXIk7KCYaZSmQ3AiJKhwP1Fs2hDM3uvrPR7EeU_HhHOLKgjEICj_z2QNSRaEjxUS73g',
      content: content,
      timestamp: 'Just now'
    };

    return this.http.post<Comment>(`${this.apiUrl}/${postId}/comments`, newComment).pipe(
      catchError(() => {
        const post = this.mockPosts.find(p => p.id === postId);
        if (post) {
          if (!post.comments) post.comments = [];
          post.comments.push(newComment);
          post.commentsCount++;
        }
        return of(newComment);
      })
    );
  }
}
