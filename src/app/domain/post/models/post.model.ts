export interface Comment {
  id: string;
  postId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorLocation: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  hasRecipe?: boolean;
  recipeTitle?: string;
  locationLabel?: string;
  comments?: Comment[];
  ingredients?: string[];
}
