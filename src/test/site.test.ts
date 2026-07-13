import { describe, it, expect } from 'vitest'
import { site } from '../data/site'

describe('site data', () => {
  it('has required fields', () => {
    expect(site.name).toBe('myths')
    expect(site.realName).toBe('Richard Germain')
    expect(site.email).toContain('@')
    expect(site.phrases.length).toBeGreaterThanOrEqual(3)
  })
})
