import { create } from 'zustand';

interface AppState {
  sidebarOpen: boolean;
  searchQuery: string;
  activePage: string;
  modals: Record<string, boolean>;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  setActivePage: (page: string) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  searchQuery: '',
  activePage: 'dashboard',
  modals: {},
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActivePage: (page) => set({ activePage: page }),
  openModal: (modalId) => set((state) => ({ modals: { ...state.modals, [modalId]: true } })),
  closeModal: (modalId) => set((state) => ({ modals: { ...state.modals, [modalId]: false } })),
}));
