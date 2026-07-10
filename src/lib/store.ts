import { create } from 'zustand'

interface AppStore {
  scrollY: number
  activeSection: string
  terminalOpen: boolean
  bagboyPose: 'idle' | 'wave' | 'point' | 'celebrate'
  mythsClickCount: number
  mythsEggActive: boolean
  mythsEggPhase: 'idle' | 'collapse' | 'rebuild' | 'reward'
  soundEnabled: boolean
  setScrollY: (y: number) => void
  setActiveSection: (id: string) => void
  setTerminalOpen: (open: boolean) => void
  setBagboyPose: (pose: 'idle' | 'wave' | 'point' | 'celebrate') => void
  incrementMythsClick: () => void
  setMythsEggActive: (active: boolean) => void
  setMythsEggPhase: (phase: 'idle' | 'collapse' | 'rebuild' | 'reward') => void
  toggleSound: () => void
}

export const useStore = create<AppStore>((set) => ({
  scrollY: 0,
  activeSection: 'top',
  terminalOpen: false,
  bagboyPose: 'idle',
  mythsClickCount: 0,
  mythsEggActive: false,
  mythsEggPhase: 'idle',
  soundEnabled: false,
  setScrollY: (y) => set({ scrollY: y }),
  setActiveSection: (id) => set({ activeSection: id }),
  setTerminalOpen: (open) => set({ terminalOpen: open }),
  setBagboyPose: (pose) => set({ bagboyPose: pose }),
  incrementMythsClick: () => set((s) => ({ mythsClickCount: s.mythsClickCount + 1 })),
  setMythsEggActive: (active) => set({ mythsEggActive: active }),
  setMythsEggPhase: (phase) => set({ mythsEggPhase: phase }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
}))
