export interface NewsItem {
  id: number;
  title: string;
  body: string;
  userId: number;
  views: number;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
}