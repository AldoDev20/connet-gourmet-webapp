import { Observable } from 'rxjs';
import { Creator, Producer } from './models/creator.model';

export interface CreatorRepository {
  getCreatorById(id: string): Observable<Creator>;
  getProducers(creatorId: string): Observable<Producer[]>;
  toggleFollow(creatorId: string): Observable<boolean>;
}
