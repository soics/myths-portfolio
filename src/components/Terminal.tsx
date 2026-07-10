import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTerminal, type SideEffects } from '../hooks/useTerminal'

/* ------------------------------------------------------------------ */
/*  Terminal Component                                                 */
/* ------------------------------------------------------------------ */

interface TerminalProps {
  open: boolean
  onClose: () => void
  sideEffects: SideEffects
}

export function Terminal({ open, onClose, sideEffects }: TerminalProps) {
  const { state, processCommand } = useTerminal(sideEffects)
  const [input, setInput] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const historyIdxRef = useRef(-1)

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(id)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [state.output])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    processCommand(input)
    setInput('')
    historyIdxRef.current = -1
  }, [input, processCommand])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = historyIdxRef.current === -1
        ? state.history.length - 1
        : Math.max(0, historyIdxRef.current - 1)
      historyIdxRef.current = next
      setInput(state.history[next] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdxRef.current === -1) return
      const next = historyIdxRef.current + 1
      if (next >= state.history.length) {
        historyIdxRef.current = -1
        setInput('')
      } else {
        historyIdxRef.current = next
        setInput(state.history[next] || '')
      }
    } else if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      processCommand('clear')
    }
  }, [state.history, onClose, processCommand])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20, scaleY: 0.95 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -20, scaleY: 0.95 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-0 z-50 mx-auto mt-2 w-[calc(100%-2rem)] max-w-3xl origin-top"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Terminal window */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0c] shadow-[0_32px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
              <button onClick={onClose} className="h-3 w-3 rounded-full bg-red-400/60 transition-colors hover:bg-red-400/90" aria-label="Close terminal" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/40" />
              <span className="h-3 w-3 rounded-full bg-green-400/40" />
              <span className="ml-3 text-[11px] font-mono text-white/35">myths@portfolio — backtick to toggle</span>
            </div>

            {/* Output */}
            <div
              ref={outputRef}
              className="max-h-[50vh] overflow-y-auto px-4 py-3 font-mono text-[13px] leading-[1.7] scrollbar-thin scrollbar-thumb-white/[0.06]"
            >
              {state.output.map((line, i) => (
                <div key={i} className={`whitespace-pre-wrap ${
                  line.type === 'input' ? 'text-white/70' :
                  line.type === 'error' ? 'text-red-200/60' :
                  line.type === 'system' ? 'text-emerald-200/50' :
                  'text-white/65'
                }`}>
                  {line.text}
                </div>
              ))}
            </div>

            {/* Input line */}
            <form onSubmit={handleSubmit} className="flex items-center border-t border-white/[0.06] px-4 py-2.5 font-mono text-[13px]">
              <span className="mr-2 shrink-0 text-emerald-400/60">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-w-0 flex-1 bg-transparent text-white/80 outline-none placeholder:text-white/25"
                placeholder="Type a command..."
                spellCheck={false}
                autoComplete="off"
              />
              <span className={`h-4 w-[2px] bg-white/60 transition-opacity ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
