import { create } from 'zustand'

interface AppStore {
  scrollY: number
  activeSection: string
  bagboyPose: 'idle' | 'wave' | 'point' | 'celebrate'
  echoPrismActive: boolean
  signalRoomActive: boolean
  setScrollY: (y: number) => void
  setActiveSection: (id: string) => void
  setBagboyPose: (pose: 'idle' | 'wave' | 'point' | 'celebrate') => void
  setEchoPrismActive: (v: boolean) => void
  setSignalRoomActive: (v: boolean) => void
}

export const useStore = create<AppStore>((set) => ({
  scrollY: 0,
  activeSection: 'top',
  bagboyPose: 'idle',
  echoPrismActive: false,
  signalRoomActive: false,
  setScrollY: (y) => set({ scrollY: y }),
  setActiveSection: (id) => set({ activeSection: id }),
  setBagboyPose: (pose) => set({ bagboyPose: pose }),
  setEchoPrismActive: (v) => set({ echoPrismActive: v }),
  setSignalRoomActive: (v) => set({ signalRoomActive: v }),
}))
