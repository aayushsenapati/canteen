import Providers from './components/Providers'
import Navbar from './components/Navbar'
import "./globals.css"

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}

export default Layout