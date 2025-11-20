export interface CronExpression {
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

export interface CronPattern {
  name: string
  expression: string
  description: string
}

export const CRON_PATTERNS: CronPattern[] = [
  { name: 'Every minute', expression: '* * * * *', description: 'Runs every minute' },
  { name: 'Every 5 minutes', expression: '*/5 * * * *', description: 'Runs every 5 minutes' },
  { name: 'Every 15 minutes', expression: '*/15 * * * *', description: 'Runs every 15 minutes' },
  { name: 'Every 30 minutes', expression: '*/30 * * * *', description: 'Runs every 30 minutes' },
  { name: 'Every hour', expression: '0 * * * *', description: 'Runs at minute 0 of every hour' },
  { name: 'Every 6 hours', expression: '0 */6 * * *', description: 'Runs at minute 0 every 6 hours' },
  { name: 'Every day at midnight', expression: '0 0 * * *', description: 'Runs at 00:00 every day' },
  { name: 'Every day at noon', expression: '0 12 * * *', description: 'Runs at 12:00 every day' },
  { name: 'Every Sunday at midnight', expression: '0 0 * * 0', description: 'Runs at 00:00 every Sunday' },
  { name: 'Every Monday at 9 AM', expression: '0 9 * * 1', description: 'Runs at 09:00 every Monday' },
  { name: 'First day of month', expression: '0 0 1 * *', description: 'Runs at 00:00 on day 1 of every month' },
  { name: 'Every weekday at 8 AM', expression: '0 8 * * 1-5', description: 'Runs at 08:00 Monday-Friday' }
]

const FIELD_RANGES = {
  minute: { min: 0, max: 59, name: 'Minute' },
  hour: { min: 0, max: 23, name: 'Hour' },
  dayOfMonth: { min: 1, max: 31, name: 'Day of Month' },
  month: { min: 1, max: 12, name: 'Month' },
  dayOfWeek: { min: 0, max: 7, name: 'Day of Week' } // 0 and 7 both represent Sunday
}

// Reserved for future use: month/day name support
// const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
// const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export function parseCronExpression(expression: string): CronExpression {
  const parts = expression.trim().split(/\s+/)

  if (parts.length !== 5) {
    throw new Error('Invalid cron expression: must have exactly 5 fields')
  }

  return {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4]
  }
}

export function buildCronExpression(cron: CronExpression): string {
  return `${cron.minute} ${cron.hour} ${cron.dayOfMonth} ${cron.month} ${cron.dayOfWeek}`
}

export function validateCronField(value: string, fieldType: keyof typeof FIELD_RANGES): { valid: boolean; error?: string } {
  if (!value || value.trim() === '') {
    return { valid: false, error: 'Field cannot be empty' }
  }

  const field = FIELD_RANGES[fieldType]

  // Wildcard
  if (value === '*') {
    return { valid: true }
  }

  // Step values (*/n)
  if (value.includes('/')) {
    const parts = value.split('/')
    if (parts.length !== 2) {
      return { valid: false, error: 'Invalid step format. Use */n or start-end/step' }
    }

    const [range, stepStr] = parts
    const step = parseInt(stepStr, 10)

    if (isNaN(step) || step <= 0) {
      return { valid: false, error: 'Step value must be a positive number' }
    }

    if (range === '*') {
      return { valid: true }
    }

    // Range with step (n-m/step)
    if (range.includes('-')) {
      const rangeResult = validateRange(range, field)
      if (!rangeResult.valid) return rangeResult
    } else {
      const start = parseInt(range, 10)
      if (isNaN(start) || start < field.min || start > field.max) {
        return { valid: false, error: `Start value must be between ${field.min} and ${field.max}` }
      }
    }

    return { valid: true }
  }

  // Range (n-m)
  if (value.includes('-')) {
    return validateRange(value, field)
  }

  // List (n,m,o)
  if (value.includes(',')) {
    const values = value.split(',')
    for (const val of values) {
      const num = parseInt(val.trim(), 10)
      if (isNaN(num) || num < field.min || num > field.max) {
        return { valid: false, error: `All values must be between ${field.min} and ${field.max}` }
      }
    }
    return { valid: true }
  }

  // Single value
  const num = parseInt(value, 10)
  if (isNaN(num)) {
    return { valid: false, error: 'Must be a number, *, range (n-m), list (n,m), or step (*/n)' }
  }

  if (num < field.min || num > field.max) {
    return { valid: false, error: `Value must be between ${field.min} and ${field.max}` }
  }

  // Special case: day of week 7 = Sunday (same as 0)
  if (fieldType === 'dayOfWeek' && num === 7) {
    return { valid: true }
  }

  return { valid: true }
}

function validateRange(range: string, field: { min: number; max: number; name: string }): { valid: boolean; error?: string } {
  const parts = range.split('-')
  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid range format. Use n-m' }
  }

  const [startStr, endStr] = parts
  const start = parseInt(startStr.trim(), 10)
  const end = parseInt(endStr.trim(), 10)

  if (isNaN(start) || isNaN(end)) {
    return { valid: false, error: 'Range values must be numbers' }
  }

  if (start < field.min || start > field.max) {
    return { valid: false, error: `Start value must be between ${field.min} and ${field.max}` }
  }

  if (end < field.min || end > field.max) {
    return { valid: false, error: `End value must be between ${field.min} and ${field.max}` }
  }

  if (start >= end) {
    return { valid: false, error: 'Start value must be less than end value' }
  }

  return { valid: true }
}

export function validateCronExpression(expression: string): { valid: boolean; errors: string[] } {
  try {
    const cron = parseCronExpression(expression)
    const errors: string[] = []

    const minuteResult = validateCronField(cron.minute, 'minute')
    if (!minuteResult.valid) errors.push(`Minute: ${minuteResult.error}`)

    const hourResult = validateCronField(cron.hour, 'hour')
    if (!hourResult.valid) errors.push(`Hour: ${hourResult.error}`)

    const dayResult = validateCronField(cron.dayOfMonth, 'dayOfMonth')
    if (!dayResult.valid) errors.push(`Day of Month: ${dayResult.error}`)

    const monthResult = validateCronField(cron.month, 'month')
    if (!monthResult.valid) errors.push(`Month: ${monthResult.error}`)

    const weekdayResult = validateCronField(cron.dayOfWeek, 'dayOfWeek')
    if (!weekdayResult.valid) errors.push(`Day of Week: ${weekdayResult.error}`)

    return { valid: errors.length === 0, errors }
  } catch (error) {
    return { valid: false, errors: [error instanceof Error ? error.message : 'Invalid expression'] }
  }
}

export function cronToHumanReadable(expression: string): string {
  try {
    const cron = parseCronExpression(expression)

    // Check for common patterns first
    const pattern = CRON_PATTERNS.find(p => p.expression === expression)
    if (pattern) {
      return pattern.description
    }

    // Build human-readable description
    let description = 'At '

    // Minute
    if (cron.minute === '*') {
      description = 'Every minute'
      return description
    } else if (cron.minute.startsWith('*/')) {
      const step = cron.minute.split('/')[1]
      description = `Every ${step} minute${parseInt(step) > 1 ? 's' : ''}`

      if (cron.hour !== '*' || cron.dayOfMonth !== '*' || cron.month !== '*' || cron.dayOfWeek !== '*') {
        description += ', '
      } else {
        return description
      }
    } else {
      description += `minute ${cron.minute}`
    }

    // Hour
    if (cron.hour === '*') {
      description += ' of every hour'
    } else if (cron.hour.startsWith('*/')) {
      const step = cron.hour.split('/')[1]
      description += ` every ${step} hour${parseInt(step) > 1 ? 's' : ''}`
    } else {
      description += ` past hour ${cron.hour}`
    }

    // Day of month
    if (cron.dayOfMonth !== '*') {
      if (cron.dayOfMonth.includes(',')) {
        description += ` on days ${cron.dayOfMonth}`
      } else if (cron.dayOfMonth.includes('-')) {
        description += ` on days ${cron.dayOfMonth}`
      } else {
        description += ` on day ${cron.dayOfMonth}`
      }
    }

    // Month
    if (cron.month !== '*') {
      description += ` in month ${cron.month}`
    }

    // Day of week
    if (cron.dayOfWeek !== '*') {
      if (cron.dayOfWeek === '1-5') {
        description += ' on weekdays'
      } else if (cron.dayOfWeek === '0,6' || cron.dayOfWeek === '6,0') {
        description += ' on weekends'
      } else {
        description += ` on day-of-week ${cron.dayOfWeek}`
      }
    }

    return description
  } catch {
    return 'Invalid cron expression'
  }
}

export function getNextExecutions(expression: string, count: number = 5): Date[] {
  try {
    const cron = parseCronExpression(expression)
    const validation = validateCronExpression(expression)

    if (!validation.valid) {
      return []
    }

    const executions: Date[] = []
    const now = new Date()
    let currentDate = new Date(now)
    currentDate.setSeconds(0, 0) // Reset seconds and milliseconds

    // Simple algorithm: check every minute for next matches
    const maxIterations = 60 * 24 * 365 // Max 1 year of minutes
    let iterations = 0

    while (executions.length < count && iterations < maxIterations) {
      currentDate = new Date(currentDate.getTime() + 60000) // Add 1 minute
      iterations++

      if (matchesCronExpression(currentDate, cron)) {
        executions.push(new Date(currentDate))
      }
    }

    return executions
  } catch {
    return []
  }
}

function matchesCronExpression(date: Date, cron: CronExpression): boolean {
  const minute = date.getMinutes()
  const hour = date.getHours()
  const dayOfMonth = date.getDate()
  const month = date.getMonth() + 1 // JavaScript months are 0-indexed
  const dayOfWeek = date.getDay() // 0 = Sunday

  return (
    matchesField(minute, cron.minute) &&
    matchesField(hour, cron.hour) &&
    matchesField(dayOfMonth, cron.dayOfMonth) &&
    matchesField(month, cron.month) &&
    (matchesField(dayOfWeek, cron.dayOfWeek) || (dayOfWeek === 0 && cron.dayOfWeek === '7'))
  )
}

function matchesField(value: number, pattern: string): boolean {
  // Wildcard
  if (pattern === '*') return true

  // Step values (*/n or n-m/step)
  if (pattern.includes('/')) {
    const [range, stepStr] = pattern.split('/')
    const step = parseInt(stepStr, 10)

    if (range === '*') {
      return value % step === 0
    }

    if (range.includes('-')) {
      const [startStr, endStr] = range.split('-')
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)

      if (value < start || value > end) return false
      return (value - start) % step === 0
    }

    const start = parseInt(range, 10)
    if (value < start) return false
    return (value - start) % step === 0
  }

  // Range (n-m)
  if (pattern.includes('-')) {
    const [startStr, endStr] = pattern.split('-')
    const start = parseInt(startStr, 10)
    const end = parseInt(endStr, 10)
    return value >= start && value <= end
  }

  // List (n,m,o)
  if (pattern.includes(',')) {
    const values = pattern.split(',').map(v => parseInt(v.trim(), 10))
    return values.includes(value)
  }

  // Single value
  return value === parseInt(pattern, 10)
}
