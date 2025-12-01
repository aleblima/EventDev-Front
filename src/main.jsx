import { StyledEngineProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App.jsx'
import { initSuperTokens } from '@/config/supertokens'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'

import '@/shared/styles/global.css'

initSuperTokens()

const queryClient = new QueryClient()

const SHOW_DEV_TOOLS = false

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
        {SHOW_DEV_TOOLS && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </StyledEngineProvider>
  </StrictMode>
)
