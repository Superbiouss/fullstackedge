export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  isPaid: boolean;
  price?: number;
  createdAt: any;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'text' | 'video';
  content: string; // URL for video, markdown text for text
  createdAt: any;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  createdAt: any;
}
