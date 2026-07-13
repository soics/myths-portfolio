import { describe, it, expect } from 'vitest'

describe('API contact sanitize', () => {
  // Replicate the sanitize function inline for unit testing
  function sanitize(str: string): string {
    // eslint-disable-next-line no-control-regex
    return str.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim()
  }

  it('strips HTML tags', () => {
    expect(sanitize('<script>alert("xss")</script>hello')).toBe('alert("xss")hello')
  })

  it('strips angle brackets', () => {
    expect(sanitize('foo <> bar')).toBe('foo  bar')
  })

  it('preserves Unicode (names with accents)', () => {
    expect(sanitize('José Müller')).toBe('José Müller')
  })

  it('preserves emoji', () => {
    expect(sanitize('Hello 👋 world')).toBe('Hello 👋 world')
  })

  it('strips control characters', () => {
    expect(sanitize('hello\x00world')).toBe('helloworld')
  })

  it('trims whitespace', () => {
    expect(sanitize('  hello  ')).toBe('hello')
  })
})
