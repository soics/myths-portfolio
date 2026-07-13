import { create } from 'zustand'

interface AppStore {
  scrollY: number
  activeSection: string
  echoPrismActive: boolean
  signalRoomActive: boolean
  setScrollY: (y: number) => void
  setActiveSection: (id: string) => void
  setEchoPrismActive: (v: boolean) => void
  setSignalRoomActive: (v: boolean) => void
}

export const useStore = create<AppStore>((set) => ({
  scrollY: 0,
  activeSection: 'top',
  echoPrismActive: false,
  signalRoomActive: false,
  setScrollY: (y) => set({ scrollY: y }),
  setActiveSection: (id) => set({ activeSection: id }),
  setEchoPrismActive: (v) => set({ echoPrismActive: v }),
  setSignalRoomActive: (v) => set({ signalRoomActive: v }),
}))
