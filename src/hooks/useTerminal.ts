import { useState, useCallback, useRef, useEffect } from 'react'
import { site, learningSkills, strengths } from '../data/site'

export interface TerminalState {
  output: { text: string; type: 'input' | 'output' | 'error' | 'system' }[]
  history: string[]
  historyIdx: number
}

export interface Command {
  name: string
  description: string
  handler: (args: string[], sideEffects: SideEffects) => string | Promise<string>
}

export interface SideEffects {
  glitch: () => void
  scrollTo: (id: string) => void
  matrix: () => void
  setTheme: (theme: string) => void
  playGame: () => void
}

const asciiBanner = `
  __  __       _   _        ____
 |  \\/  |_   _| |_| |_ ___ / ___|___  _ __ ___
 | |\\/| | | | | __| __/ _ \\ |   / _ \\| '__/ __|
 | |  | | |_| | |_| ||  __/ |__| (_) | |  \\__ \\
 |_|  |_|\\__, |\\__|\\__\\___|\\____\\___/|_|  |___/
         |___/
`

const welcome = `Type 'help' for available commands.`

const easterEggsFound: string[] = []
const eggDescriptions: Record<string, string> = {
  konami: 'Konami Code (↑↑↓↓←→←→BA)',
  mclicks: 'Click the "m" in myths 5 times',
  sackboy: 'Click Sackboy 3 times',
  myths: 'Type "myths" anywhere',
  mythsClick: 'Click "myths" in the hero 5 times',
  play: 'Type "play" in the terminal',
}

export function createCommands(sfx: SideEffects): Command[] {
  const commands: Command[] = [
    {
      name: 'help',
      description: 'Show available commands',
      handler: () => {
        const lines = commands.map(c => `  ${c.name.padEnd(14)} ${c.description}`)
        return ['Available commands:', ...lines, '', `Easter eggs found: ${easterEggsFound.length}/${Object.keys(eggDescriptions).length}`].join('\n')
      },
    },
    {
      name: 'whoami',
      description: 'Display current user',
      handler: () => `${site.realName} (also known as ${site.name})`,
    },
    {
      name: 'ls',
      description: 'List sections',
      handler: () => ['about/', 'skills/', 'projects/', 'journey/', 'contact/'].join('  '),
    },
    {
      name: 'cd',
      description: 'Navigate to a section (cd <section>)',
      handler: (args) => {
        const sections: Record<string, string> = { about: 'about', skills: 'skills', projects: 'projects', journey: 'journey', contact: 'contact' }
        const target = sections[args[0]?.toLowerCase()]
        if (!target) return `cd: no such section: ${args[0] || ''}`
        sfx.scrollTo(target)
        return `→ navigating to ${target}/`
      },
    },
    {
      name: 'pwd',
      description: 'Print working directory',
      handler: () => '/home/myths/portfolio',
    },
    {
      name: 'date',
      description: 'Show current date and time',
      handler: () => new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    },
    {
      name: 'clear',
      description: 'Clear terminal',
      handler: () => '',
    },
    {
      name: 'neofetch',
      description: 'Display system information',
      handler: () => {
        return [
          `         .---.  ${site.name}@portfolio`,
          `        /     \\ OS: ${navigator.platform || 'web'}`,
          `        \\\\.@.@// Host: ${window.location.host}`,
          `        )__-__(  Shell: zsh`,
          `       /    |   Uptime: ${Math.floor(performance.now() / 60000)}m`,
          `      /  ___|   Sections: 5`,
          `     /  /       Repos: github.com/soics`,
          `    /  /        Email: ${site.email}`,
          `   /  /         EOF`,
          `  /  /`,
          `  \\_\\`,
        ].join('\n')
      },
    },
    {
      name: 'secret',
      description: 'Trigger a secret effect',
      handler: () => {
        sfx.glitch()
        return 'SOMETHING GLITCHED...'
      },
    },
    {
      name: 'matrix',
      description: 'Toggle matrix rain effect',
      handler: () => {
        sfx.matrix()
        return 'Matrix code rain activated.'
      },
    },
    {
      name: 'project',
      description: 'Show current project status',
      handler: () => 'Building: myths-portfolio (React + TypeScript + Tailwind v4 + Motion)\nStatus: Live on Vercel, still iterating',
    },
    {
      name: 'skills',
      description: 'List technical skills',
      handler: () => `Learning:\n  ${learningSkills.join(', ')}\n\nStrengths:\n  ${strengths.join(', ')}`,
    },
    {
      name: 'contact',
      description: 'Show contact information',
      handler: () => `Email: ${site.email}\nGitHub: ${site.github}\nInstagram: ${site.instagram}`,
    },
    {
      name: 'github',
      description: 'Open GitHub profile',
      handler: () => {
        window.open(site.github, '_blank', 'noopener')
        return '→ Opening GitHub...'
      },
    },
    {
      name: 'theme',
      description: 'Switch theme (dark | amber | matrix | mono)',
      handler: (args) => {
        const valid = ['dark', 'amber', 'matrix', 'mono']
        const t = args[0]?.toLowerCase()
        if (!t || !valid.includes(t)) return `Usage: theme [${valid.join(' | ')}]`
        sfx.setTheme(t)
        return `→ Theme set to "${t}"`
      },
    },
    {
      name: 'echo',
      description: 'Echo input text',
      handler: (args) => args.join(' ') || '',
    },
    {
      name: 'banner',
      description: 'Show ASCII banner',
      handler: () => asciiBanner,
    },
    {
      name: 'easter',
      description: 'List found easter eggs',
      handler: () => {
        const all = Object.entries(eggDescriptions)
        if (easterEggsFound.length === 0) return 'No easter eggs found yet. Keep exploring!'
        return all.map(([key, desc]) => `  ${easterEggsFound.includes(key) ? '✓' : '○'} ${desc}`).join('\n') + `\n\n${easterEggsFound.length}/${all.length} found`
      },
    },
    {
      name: 'history',
      description: 'Show command history',
      handler: () => {
        return 'Use ↑/↓ to navigate history.'
      },
    },
    {
      name: 'status',
      description: 'Show build progress',
      handler: () => {
        return [
          '── Build Status ──',
          '  Foundation:  ■■■■■■■■■■ 100%',
          '  Frontend:    ■■■■■■░░░░  65%',
          '  Backend:     ■■■░░░░░░░  35%',
          '  Full-Stack:  ■■■■■■░░░░  62%',
          '',
          `  Last build: ${new Date().toLocaleDateString()}`,
          `  Sections: 5 deployed`,
        ].join('\n')
      },
    },
    {
      name: 'blueprint',
      description: 'Show ASCII construction plan',
      handler: () => {
        return [
          '  ┌──────────────────────────────────────────┐',
          '  │           CONSTRUCTION PLAN              │',
          '  │  Phase 01 │ Foundation    │ 100% [DONE]  │',
          '  │  Phase 02 │ Framing       │  65% [NOW]   │',
          '  │  Phase 03 │ Finishing     │  25% [NEXT]  │',
          '  └──────────────────────────────────────────┘',
        ].join('\n')
      },
    },
    {
      name: 'materials',
      description: 'List skills as construction materials',
      handler: () => {
        const mapped = ['Steel', 'Copper', 'Titanium', 'Plywood', 'Tempered Glass', 'Rebar', 'Concrete', 'Cast Iron', 'Brass']
        return strengths.map((s, i) => `  ${mapped[i % mapped.length].padEnd(16)} ${s}`).join('\n')
      },
    },
    {
      name: 'play',
      description: 'Launch SIGNAL SURVIVOR minigame',
      handler: () => {
        sfx.playGame()
        return '→ Initializing SIGNAL SURVIVOR...\n→ Use mouse to dodge incoming signals.\n→ Survive as long as you can.'
      },
    },
  ]
  return commands
}

export function useTerminal(sideEffects: SideEffects) {
  const cmdsRef = useRef(createCommands(sideEffects))
  const [state, setState] = useState<TerminalState>({
    output: [
      { text: asciiBanner + '\n' + welcome, type: 'system' },
    ],
    history: [],
    historyIdx: -1,
  })

  const historyRef = useRef<string[]>([])
  const outputRef = useRef(state.output)

  useEffect(() => {
    outputRef.current = state.output
  }, [state.output])

  const processCommand = useCallback((input: string) => {
    const trimmed = input.trim()
    if (!trimmed) return

    const newOutput = [...outputRef.current, { text: `$ ${trimmed}`, type: 'input' as const }]
    const parts = trimmed.split(/\s+/)
    const cmdName = parts[0].toLowerCase()
    const args = parts.slice(1)

    const cmd = cmdsRef.current.find(c => c.name === cmdName)
    if (!cmd) {
      newOutput.push({ text: `zsh: command not found: ${cmdName}`, type: 'error' })
      setState({ output: newOutput, history: [...historyRef.current, trimmed], historyIdx: -1 })
      historyRef.current = [...historyRef.current, trimmed]
      return
    }

    if (cmdName === 'clear') {
      setState({ output: [{ text: asciiBanner + '\n' + welcome, type: 'system' }], history: [...historyRef.current, trimmed], historyIdx: -1 })
      historyRef.current = [...historyRef.current, trimmed]
      return
    }

    if (cmdName === 'history') {
      const histOutput = historyRef.current.length
        ? historyRef.current.map((c, i) => `  ${i + 1}  ${c}`).join('\n')
        : 'No history.'
      newOutput.push({ text: histOutput, type: 'output' })
      setState({ output: newOutput, history: [...historyRef.current, trimmed], historyIdx: -1 })
      historyRef.current = [...historyRef.current, trimmed]
      return
    }

    const result = cmd.handler(args, sideEffects)
    if (result instanceof Promise) {
      result.then(r => {
        const final = [...newOutput, { text: r, type: 'output' as const }]
        setState({ output: final, history: [...historyRef.current, trimmed], historyIdx: -1 })
      })
    } else {
      newOutput.push({ text: result, type: 'output' })
      setState({ output: newOutput, history: [...historyRef.current, trimmed], historyIdx: -1 })
    }
    historyRef.current = [...historyRef.current, trimmed]
  }, [sideEffects])

  const navigateHistory = useCallback((direction: 'up' | 'down') => {
    setState(prev => {
      let idx = prev.historyIdx
      if (direction === 'up') {
        idx = idx === -1 ? prev.history.length - 1 : Math.max(0, idx - 1)
      } else {
        idx = idx === -1 ? -1 : idx >= prev.history.length - 1 ? -1 : idx + 1
      }
      return { ...prev, historyIdx: idx }
    })
  }, [])

  const addEasterEgg = useCallback((key: string) => {
    if (!easterEggsFound.includes(key)) {
      easterEggsFound.push(key)
      setState(prev => ({
        ...prev,
        output: [...prev.output, { text: `🎉 Easter egg found: ${eggDescriptions[key]} (${easterEggsFound.length}/${Object.keys(eggDescriptions).length})`, type: 'system' }],
      }))
    }
  }, [])

  return { state, processCommand, navigateHistory, addEasterEgg, easterEggsFound }
}
