import React from 'react'
import Header from './components/Header'

export default function App() {
  return (
    <div>
      <Header />
      <main style={{ padding: 16 }}>
        <p>This template mocks Telegram.WebApp in the browser so you can use React DevTools.</p>
        <p>Open the console and try: <code>window.Telegram && window.Telegram.dispatch('ready')</code></p>
      </main>
    </div>
  )
}
