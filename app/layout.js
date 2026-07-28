import './globals.css'

export const metadata = {
  title: 'Chat Video Generator',
  description: 'Convert chat scripts into realistic video recordings',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
