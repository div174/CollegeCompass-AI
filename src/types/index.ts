export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  name: string;
  stream: string;
  duration: number;
  fees: number;
  seats: number;
  collegeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  user: {
    name: string | null;
    image: string | null;
  };
  collegeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Placement {
  id: string;
  year: number;
  highestPackage: number; // in LPA
  averagePackage: number; // in LPA
  placementRate: number;  // percentage
  companies: string;      // Comma-separated list
  collegeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface College {
  id: string;
  name: string;
  description: string;
  location: string;
  state: string;
  established: number;
  type: string; // "Public" | "Private"
  rating: number;
  averageFees: number;
  highestPlacement: number;
  averagePlacement: number;
  logoUrl: string | null;
  coverUrl: string | null;
  facilities: string; // Comma-separated or JSON
  stream: string;
  createdAt: string;
  updatedAt: string;
  courses?: Course[];
  reviews?: Review[];
  placements?: Placement[];
}

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  college: College;
  createdAt: string;
}

export interface Comparison {
  id: string;
  userId: string;
  collegeIds: string; // stringified JSON array
  name: string | null;
  createdAt: string;
}

export interface SearchFilters {
  search: string;
  location: string;
  fees: string; // "all" | "under-1l" | "1l-3l" | "3l-5l" | "above-5l"
  rating: string; // "all" | "4.5" | "4.0" | "3.5"
  stream: string; // "all" | "Engineering" | "Management" | "Medical" | "Arts" | "Science"
}

export interface SortOptions {
  field: "fees" | "rating" | "placements" | "name";
  direction: "asc" | "desc";
}
