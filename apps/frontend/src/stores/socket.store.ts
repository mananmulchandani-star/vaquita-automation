import { create } from 'zustand';

interface SocketState {
  connected: boolean;
  lastEvent: any;
  setConnected: (status: boolean) => void;
  handleEvent: (event: any) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  connected: false,
  lastEvent: null,
  setConnected: (status) => set({ connected: status }),
  handleEvent: (event) => set({ lastEvent: event }),
}));
