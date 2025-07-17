interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
  isLoanedBook?: boolean;
}

interface AuthCredentials {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}

interface UserParams {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: 'USER' | 'ADMIN' | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
  lastActivityDate: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
