import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {}

// Simple wrapper for tools - they don't need routing or other providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions,
) => render(ui, { wrapper: TestWrapper, ...options })

export * from '@testing-library/react'
export { customRender as render }
