// Jest globals - describe, it, expect
import {
  parseCronExpression,
  buildCronExpression,
  validateCronExpression,
  validateCronField,
  cronToHumanReadable,
  getNextExecutions,
  CRON_PATTERNS
} from '@/lib/tools/cron-utils'

describe('Cron Utils', () => {
  describe('parseCronExpression', () => {
    it('parses valid cron expression', () => {
      const result = parseCronExpression('* * * * *')
      expect(result).toEqual({
        minute: '*',
        hour: '*',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '*'
      })
    })

    it('parses complex cron expression', () => {
      const result = parseCronExpression('*/5 0-6 1,15 */2 1-5')
      expect(result).toEqual({
        minute: '*/5',
        hour: '0-6',
        dayOfMonth: '1,15',
        month: '*/2',
        dayOfWeek: '1-5'
      })
    })

    it('throws error for invalid expression with wrong number of fields', () => {
      expect(() => parseCronExpression('* * *')).toThrow('must have exactly 5 fields')
      expect(() => parseCronExpression('* * * * * *')).toThrow('must have exactly 5 fields')
    })
  })

  describe('buildCronExpression', () => {
    it('builds cron expression from fields', () => {
      const result = buildCronExpression({
        minute: '0',
        hour: '12',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '*'
      })
      expect(result).toBe('0 12 * * *')
    })
  })

  describe('validateCronField', () => {
    describe('minute field', () => {
      it('validates wildcard', () => {
        const result = validateCronField('*', 'minute')
        expect(result.valid).toBe(true)
      })

      it('validates single value in range', () => {
        expect(validateCronField('0', 'minute').valid).toBe(true)
        expect(validateCronField('30', 'minute').valid).toBe(true)
        expect(validateCronField('59', 'minute').valid).toBe(true)
      })

      it('rejects value out of range', () => {
        expect(validateCronField('60', 'minute').valid).toBe(false)
        expect(validateCronField('-1', 'minute').valid).toBe(false)
      })

      it('validates step values', () => {
        expect(validateCronField('*/5', 'minute').valid).toBe(true)
        expect(validateCronField('*/15', 'minute').valid).toBe(true)
      })

      it('validates range', () => {
        expect(validateCronField('0-30', 'minute').valid).toBe(true)
        expect(validateCronField('30-0', 'minute').valid).toBe(false) // start must be < end
      })

      it('validates list', () => {
        expect(validateCronField('0,15,30,45', 'minute').valid).toBe(true)
        expect(validateCronField('0,15,60', 'minute').valid).toBe(false) // 60 out of range
      })

      it('rejects empty value', () => {
        expect(validateCronField('', 'minute').valid).toBe(false)
      })
    })

    describe('hour field', () => {
      it('validates values 0-23', () => {
        expect(validateCronField('0', 'hour').valid).toBe(true)
        expect(validateCronField('23', 'hour').valid).toBe(true)
        expect(validateCronField('24', 'hour').valid).toBe(false)
      })
    })

    describe('dayOfMonth field', () => {
      it('validates values 1-31', () => {
        expect(validateCronField('1', 'dayOfMonth').valid).toBe(true)
        expect(validateCronField('31', 'dayOfMonth').valid).toBe(true)
        expect(validateCronField('0', 'dayOfMonth').valid).toBe(false)
        expect(validateCronField('32', 'dayOfMonth').valid).toBe(false)
      })
    })

    describe('month field', () => {
      it('validates values 1-12', () => {
        expect(validateCronField('1', 'month').valid).toBe(true)
        expect(validateCronField('12', 'month').valid).toBe(true)
        expect(validateCronField('0', 'month').valid).toBe(false)
        expect(validateCronField('13', 'month').valid).toBe(false)
      })
    })

    describe('dayOfWeek field', () => {
      it('validates values 0-7 (0 and 7 are Sunday)', () => {
        expect(validateCronField('0', 'dayOfWeek').valid).toBe(true)
        expect(validateCronField('6', 'dayOfWeek').valid).toBe(true)
        expect(validateCronField('7', 'dayOfWeek').valid).toBe(true) // Sunday
        expect(validateCronField('8', 'dayOfWeek').valid).toBe(false)
      })
    })
  })

  describe('validateCronExpression', () => {
    it('validates correct cron expression', () => {
      const result = validateCronExpression('* * * * *')
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('validates everyday at midnight', () => {
      const result = validateCronExpression('0 0 * * *')
      expect(result.valid).toBe(true)
    })

    it('detects invalid minute', () => {
      const result = validateCronExpression('60 * * * *')
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors[0]).toContain('Minute')
    })

    it('detects multiple validation errors', () => {
      const result = validateCronExpression('60 25 * * *')
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThanOrEqual(2)
    })

    it('validates complex expression', () => {
      const result = validateCronExpression('*/5 0-6 1,15 */2 1-5')
      expect(result.valid).toBe(true)
    })
  })

  describe('cronToHumanReadable', () => {
    it('converts every minute', () => {
      const result = cronToHumanReadable('* * * * *')
      expect(result).toContain('minute')
    })

    it('converts everyday at midnight', () => {
      const result = cronToHumanReadable('0 0 * * *')
      expect(result).toContain('00:00')
    })

    it('converts every 5 minutes', () => {
      const result = cronToHumanReadable('*/5 * * * *')
      expect(result).toContain('5 minute')
    })

    it('uses pattern library descriptions', () => {
      const pattern = CRON_PATTERNS[0] // First pattern
      const result = cronToHumanReadable(pattern.expression)
      expect(result).toBe(pattern.description)
    })

    it('returns invalid for bad expression', () => {
      const result = cronToHumanReadable('invalid')
      expect(result).toBe('Invalid cron expression')
    })
  })

  describe('getNextExecutions', () => {
    it('returns 5 next executions for every minute', () => {
      const result = getNextExecutions('* * * * *', 5)
      expect(result).toHaveLength(5)

      // Check that each date is 1 minute apart
      for (let i = 1; i < result.length; i++) {
        const diff = result[i].getTime() - result[i - 1].getTime()
        expect(diff).toBe(60000) // 1 minute in milliseconds
      }
    })

    it('returns empty array for invalid expression', () => {
      const result = getNextExecutions('invalid', 5)
      expect(result).toEqual([])
    })

    it('calculates next executions for specific time', () => {
      const result = getNextExecutions('0 12 * * *', 3) // Every day at noon
      expect(result).toHaveLength(3)

      // All should be at hour 12, minute 0
      result.forEach(date => {
        expect(date.getHours()).toBe(12)
        expect(date.getMinutes()).toBe(0)
      })
    })

    it('handles weekday-only schedules', () => {
      const result = getNextExecutions('0 9 * * 1-5', 3) // Weekdays at 9 AM
      expect(result).toHaveLength(3)

      // All should be weekdays (1-5)
      result.forEach(date => {
        const day = date.getDay()
        expect(day).toBeGreaterThanOrEqual(1)
        expect(day).toBeLessThanOrEqual(5)
      })
    })
  })

  describe('CRON_PATTERNS', () => {
    it('has at least 10 patterns', () => {
      expect(CRON_PATTERNS.length).toBeGreaterThanOrEqual(10)
    })

    it('all patterns have required fields', () => {
      CRON_PATTERNS.forEach(pattern => {
        expect(pattern).toHaveProperty('name')
        expect(pattern).toHaveProperty('expression')
        expect(pattern).toHaveProperty('description')
        expect(typeof pattern.name).toBe('string')
        expect(typeof pattern.expression).toBe('string')
        expect(typeof pattern.description).toBe('string')
      })
    })

    it('all patterns are valid cron expressions', () => {
      CRON_PATTERNS.forEach(pattern => {
        const result = validateCronExpression(pattern.expression)
        expect(result.valid).toBe(true)
      })
    })
  })
})
