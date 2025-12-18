import './globals.css'

export const metadata = {
  title: 'Blog Platform',
  description: 'A modern blog platform built with FastAPI and Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}