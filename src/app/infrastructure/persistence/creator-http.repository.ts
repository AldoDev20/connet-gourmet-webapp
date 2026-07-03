import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CreatorRepository } from '../../domain/creator/creator.repository';
import { Creator, Producer } from '../../domain/creator/models/creator.model';

@Injectable({
  providedIn: 'root'
})
export class CreatorHttpRepository implements CreatorRepository {
  private apiUrl = '/api/creators'; // URL base para la API

  // Datos mock correspondientes a la maqueta 'perfil-creador.html'
  private mockCreator: Creator = {
    id: 'chef-gaston',
    name: 'Chef Gastón',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU_mE0xX3d2mpLYASUf8apMK71w_Ay8jayOQXQM-OTP6jas8CP_PBrKpPai4NTx1ZURrDt3Z5rvzRRVyS5B_rrwkL02zS7oPMTq78yAFfsDgkkuU_g2YWnYgO4RxduyJNHnFGYmP36bZYPt-q6EbZUg30Q6ni6vk4gdJ79tmKN3iJTRH7tyngMXIk7KCYaZSmQ3AiJKhwP1Fs2hDM3uvrPR7EeU_HhHOLKgjEICj_z2QNSRaEjxUS73g',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSC0Xt4PiAJSWcEkaqCd3qABeSj-U2TyIrxB3YuRThVx1wLLUXO8C9887wSeotLg6g1PFJ3fNgojMzi3IvMSpHk4oqDe39fxcjx2zqB2ChRznwAWWQezqn_dIubuzYV_JjYcmwiW5ZDJAW6Pu5FinFkfeIxTtCeau_Sgeu1kGMsydMTCN2v0K4MGnUDUO1bnBT9V2zy4C7e8y7OvQlGLpYY0-WpjrIlBmmtbatZAkOuL5HENpJDaD-yA',
    location: 'Lima, Peru',
    bio: 'Lover of traditional flavors and sustainable ingredients',
    followersCount: 15400,
    recipesCount: 230,
    producersCount: 45,
    isFollowing: false
  };

  private mockProducers: Producer[] = [
    { id: '1', name: 'Ají Amarillo', type: 'Signature Pepper', avatarUrl: '', percentageUsed: 92 },
    { id: '2', name: 'Cilantro Serrano', type: 'Wild Mountain Herb', avatarUrl: '', percentageUsed: 85 },
    { id: '3', name: 'Red Quinoa', type: 'Ancient Grain', avatarUrl: '', percentageUsed: 78 },
    { id: '4', name: 'Lime Juice', type: 'Northern Coast', avatarUrl: '', percentageUsed: 74 }
  ];

  constructor(private http: HttpClient) {}

  getCreatorById(id: string): Observable<Creator> {
    return this.http.get<Creator>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        // En caso de error (API no disponible), retornar el mock correspondientes
        return of(this.mockCreator);
      })
    );
  }

  getProducers(creatorId: string): Observable<Producer[]> {
    return this.http.get<Producer[]>(`${this.apiUrl}/${creatorId}/producers`).pipe(
      catchError(() => {
        return of(this.mockProducers);
      })
    );
  }

  toggleFollow(creatorId: string): Observable<boolean> {
    return this.http.post<{ following: boolean }>(`${this.apiUrl}/${creatorId}/follow`, {}).pipe(
      map(res => res.following),
      catchError(() => {
        this.mockCreator.isFollowing = !this.mockCreator.isFollowing;
        if (this.mockCreator.isFollowing) {
          this.mockCreator.followersCount++;
        } else {
          this.mockCreator.followersCount--;
        }
        return of(this.mockCreator.isFollowing);
      })
    );
  }
}
