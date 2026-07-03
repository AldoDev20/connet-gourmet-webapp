export interface Creator {
  id: string;
  name: string;
  avatarUrl: string;
  coverUrl: string;
  location: string;
  bio: string;
  followersCount: number;
  recipesCount: number;
  producersCount: number;
  isFollowing?: boolean;
}

export interface Producer {
  id: string;
  name: string;
  type: string;
  avatarUrl: string;
  percentageUsed: number;
}
