
import { Experience, Booking, User, Slot } from '../types';
import { MOCK_EXPERIENCES } from '../constants';

// Simulated latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const STORAGE_KEY_USER = 'escape_mock_user';

class MockBackend {
  private currentUser: User;
  private bookings: Booking[] = [];
  
  constructor() {
    // Try to load from local storage to persist identity across reloads
    const stored = localStorage.getItem(STORAGE_KEY_USER);
    if (stored) {
      this.currentUser = JSON.parse(stored);
      // Ensure new fields exist for legacy stored users
      if (!this.currentUser.favorites) this.currentUser.favorites = [];
      if (!this.currentUser.following) this.currentUser.following = [];
    } else {
      this.currentUser = {
        id: 'u1',
        name: 'Guest User',
        email: 'guest@escape.app',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        interests: [],
        favorites: [],
        following: []
      };
    }
  }

  async getCurrentUser(): Promise<User> {
    await delay(100); 
    return this.currentUser;
  }

  async signup(name: string, email: string): Promise<User> {
    await delay(500);
    this.currentUser = {
      ...this.currentUser,
      name,
      email,
      id: `u_${Date.now()}`,
      favorites: [],
      following: []
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  async login(email: string): Promise<User> {
      await delay(500);
      if (this.currentUser.name === 'Guest User' && email !== 'guest@escape.app') {
          const name = email.split('@')[0];
          this.currentUser = {
              ...this.currentUser,
              name: name.charAt(0).toUpperCase() + name.slice(1), 
              email: email,
              id: `u_${Date.now()}`
          };
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
      }
      return this.currentUser;
  }

  async updateUserInterests(userId: string, interests: any[]): Promise<User> {
    await delay(300);
    if (this.currentUser.id === userId) {
        this.currentUser.interests = interests;
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
    }
    return this.currentUser;
  }

  // --- SOCIAL FEATURES ---

  async toggleFavorite(experienceId: string): Promise<boolean> {
      await delay(200);
      const isFav = this.currentUser.favorites.includes(experienceId);
      if (isFav) {
          this.currentUser.favorites = this.currentUser.favorites.filter(id => id !== experienceId);
      } else {
          this.currentUser.favorites.push(experienceId);
      }
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
      return !isFav;
  }

  async toggleFollow(hostName: string): Promise<boolean> {
      await delay(200);
      const isFollowing = this.currentUser.following.includes(hostName);
      if (isFollowing) {
          this.currentUser.following = this.currentUser.following.filter(name => name !== hostName);
      } else {
          this.currentUser.following.push(hostName);
      }
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
      return !isFollowing;
  }

  async getFavorites(): Promise<Experience[]> {
      await delay(400);
      const all = await this.getExperiences();
      return all.filter(exp => this.currentUser.favorites.includes(exp.id));
  }

  // --- DATA ---

  async getExperiences(): Promise<Experience[]> {
    // ALWAYS return fresh data from constants to allow hot-reloading of images/text during dev
    // In a real app, this would be a DB fetch
    await delay(600);
    return MOCK_EXPERIENCES;
  }

  async getExperienceById(id: string): Promise<Experience | undefined> {
    await delay(200); 
    return MOCK_EXPERIENCES.find(e => e.id === id);
  }

  async getExperienceBySlotId(slotId: string): Promise<Experience | undefined> {
      return MOCK_EXPERIENCES.find(exp => exp.slots.some(s => s.id === slotId));
  }

  async reserveSlot(userId: string, experienceId: string, slotId: string, participants: number): Promise<Booking> {
    await delay(500);
    
    const booking: Booking = {
      id: `bk_${Date.now()}`,
      experienceId,
      slotId,
      userId,
      status: 'tentative',
      participants,
      totalAmount: 0, 
      timestamp: Date.now(),
    };
    
    this.bookings.push(booking);
    return booking;
  }

  async createPaymentOrder(bookingId: string, amount: number): Promise<string> {
    await delay(800);
    return `order_rcptid_${Date.now()}`;
  }

  async confirmBooking(bookingId: string, paymentId: string): Promise<Booking> {
    await delay(800);
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) {
        throw new Error("Booking not found");
    }
    
    booking.status = 'confirmed';
    booking.paymentId = paymentId;
    return booking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    await delay(300);
    return this.bookings.filter(b => b.userId === userId && b.status === 'confirmed').sort((a, b) => b.timestamp - a.timestamp);
  }

  // --- CHAT HELPERS ---
  async getChatMembers(experienceId: string) {
      await delay(300);
      // Mock random members
      return [
          { id: 'h1', name: 'Host', role: 'host', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
          { id: 'u2', name: 'Sarah K.', role: 'guest', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
          { id: 'u3', name: 'Mike R.', role: 'guest', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' },
          { id: 'u4', name: 'Priya P.', role: 'guest', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80' }
      ];
  }
}

export const backend = new MockBackend();
