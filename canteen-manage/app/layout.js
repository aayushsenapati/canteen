import Providers from './components/Providers'

const Layout = ({ children }) => {
  return (
    <body>
      <Providers>
        {children}
      </Providers>
    </body>
  )
}

export default Layout