
export enum Category {
  ADVENTURE = 'Adventure',
  FOOD = 'Food',
  ART = 'Art',
  MUSIC = 'Music',
  WORKSHOP = 'Workshop',
  WELLNESS = 'Wellness'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  interests: Category[];
  favorites?: string[]; // IDs of liked experiences
  following?: string[]; // Names/IDs of followed hosts
}

export interface Slot {
  id: string;
  time: string; // ISO String
  seatsAvailable: number;
  totalSeats: number;
  price: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  hostName: string;
  hostAvatar: string;
  image: string;
  location: string;
  coordinates: { lat: number; lng: number };
  categories: Category[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  slots: Slot[];
  isPopular?: boolean;
  isTrending?: boolean; 
}

export interface Booking {
  id: string;
  experienceId: string;
  slotId: string;
  userId: string;
  status: 'tentative' | 'confirmed' | 'cancelled';
  paymentId?: string;
  participants: number;
  totalAmount: number;
  timestamp: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}