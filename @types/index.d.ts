interface AuthUser {
  createdAt: number;
  firstName?: string;
  id: number;
  lastName?: string;
  photoUrl?: string;
  username?: string;
}

interface AuthMetadata {
  isAdmin: boolean;
}
