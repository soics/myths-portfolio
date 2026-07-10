import { create } from 'zustand'

interface AppStore {
  scrollY: number
  activeSection: string
  terminalOpen: boolean
  bagboyPose: 'idle' | 'wave' | 'point' | 'celebrate'
  setScrollY: (y: number) => void
  setActiveSection: (id: string) => void
  setTerminalOpen: (open: boolean) => void
  setBagboyPose: (pose: 'idle' | 'wave' | 'point' | 'celebrate') => void
}

export const useStore = create<AppStore>((set) => ({
  scrollY: 0,
  activeSection: 'top',
  terminalOpen: false,
  bagboyPose: 'idle',
  setScrollY: (y) => set({ scrollY: y }),
  setActiveSection: (id) => set({ activeSection: id }),
  setTerminalOpen: (open) => set({ terminalOpen: open }),
  setBagboyPose: (pose) => set({ bagboyPose: pose }),
}))
