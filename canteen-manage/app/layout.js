import Providers from './components/Providers'
import "./globals.css"

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

export default Layout