import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ToastProvider } from '@/components/ToastProvider'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {}

// Wrapper with ToastProvider for all tools
// next-intl is mocked in jest.setup.js
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions,
) => render(ui, { wrapper: TestWrapper, ...options })

export * from '@testing-library/react'
export { customRender as render }
