export interface Comment {
  id: string | null;
  authorId: string | null;
  authorName: string | null;
  content: string | undefined;
  comments: Comment[];
}
