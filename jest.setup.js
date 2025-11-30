// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock next-intl
jest.mock('next-intl', () => {
  const messages = require('./messages/en.json')

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  return {
    useTranslations: (namespace) => {
      const translations = namespace ? getNestedValue(messages, namespace) : messages
      return (key, params) => {
        const value = translations?.[key]
        if (typeof value === 'string' && params) {
          return value.replace(/{(\w+)}/g, (_, k) => params[k] || `{${k}}`)
        }
        return value || key
      }
    },
    useLocale: () => 'en',
    useMessages: () => messages,
    NextIntlClientProvider: ({ children }) => children,
  }
})
