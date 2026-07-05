import { Observable } from 'rxjs';
import { Post, Comment } from './models/post.model';

export interface PostRepository {
  // Endpoints as per API_DOCUMENTATION.md
  createPost(content: string, imageUrl?: string, videoUrl?: string, location?: string, ingredients?: string[]): Observable<Post>;
  getFeed(): Observable<Post[]>;
  getPostById(id: string): Observable<Post>;
  getPostsByUser(creatorId: string): Observable<Post[]>;
  updatePost(id: string, post: Partial<Post>): Observable<Post>;
  deletePost(id: string): Observable<void>;
  
  // High-level operations (must be implemented using the documented endpoints)
  toggleLike(postId: string): Observable<boolean>;
  getComments(postId: string): Observable<Comment[]>;
  addComment(postId: string, content: string): Observable<Comment>;
}
