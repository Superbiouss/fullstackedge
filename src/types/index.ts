export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  isPaid: boolean;
  price?: number;
  stripePriceId?: string;
  createdAt: any;
  lessonCount?: number;
  enrollmentCount?: number;
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
  lessonId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  createdAt: any;
}

export interface UserProgress {
  completedLessons: string[];
  certificateUrl?: string;
  completionDate?: any;
}

export interface UserProfile {
  id: string;
  email: string | null;
  purchasedCourses?: string[];
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  createdAt: any;
  replyCount?: number;
  lastReplyAt?: any;
}

export interface Reply {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  createdAt: any;
}
