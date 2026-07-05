import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreatorHttpRepository } from '../../infrastructure/persistence/creator-http.repository';
import { Creator, Producer } from '../../domain/creator/models/creator.model';

@Injectable({
  providedIn: 'root'
})
export class CreatorFacade {
  private creatorSubject = new BehaviorSubject<Creator | null>(null);
  private producersSubject = new BehaviorSubject<Producer[]>([]);
  private allUsersSubject = new BehaviorSubject<Creator[]>([]);
  private nearbyUsersSubject = new BehaviorSubject<Creator[]>([]);

  creator$: Observable<Creator | null> = this.creatorSubject.asObservable();
  producers$: Observable<Producer[]> = this.producersSubject.asObservable();
  allUsers$: Observable<Creator[]> = this.allUsersSubject.asObservable();
  nearbyUsers$: Observable<Creator[]> = this.nearbyUsersSubject.asObservable();

  constructor(private creatorRepository: CreatorHttpRepository) {}

  loadCreator(id: string): void {
    this.creatorRepository.getCreatorById(id).subscribe(creator => {
      this.creatorSubject.next(creator);
    });
    this.creatorRepository.getProducers(id).subscribe(producers => {
      this.producersSubject.next(producers);
    });
  }

  loadAllUsers(): void {
    this.creatorRepository.getUsers().subscribe(users => {
      this.allUsersSubject.next(users);
    });
  }

  loadNearbyUsers(lat: number, lng: number, radius: number): void {
    this.creatorRepository.getNearbyUsers(lat, lng, radius).subscribe(users => {
      this.nearbyUsersSubject.next(users);
    });
  }

  toggleFollow(): void {
    const currentCreator = this.creatorSubject.value;
    if (!currentCreator) return;

    this.creatorRepository.toggleFollow(currentCreator.id).subscribe(isFollowing => {
      const updated = {
        ...currentCreator,
        isFollowing,
        followersCount: currentCreator.followersCount + (isFollowing ? 1 : -1)
      };
      this.creatorSubject.next(updated);
    });
  }
}
