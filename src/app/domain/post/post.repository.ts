import { Observable } from 'rxjs';
import { Post, Comment } from './models/post.model';

export interface PostRepository {
  getFeed(): Observable<Post[]>;
  createPost(content: string, imageUrl?: string, videoUrl?: string, location?: string, ingredients?: string[]): Observable<Post>;
  toggleLike(postId: string): Observable<boolean>;
  getComments(postId: string): Observable<Comment[]>;
  addComment(postId: string, content: string): Observable<Comment>;
}
