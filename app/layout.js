import { useSession } from 'next-auth/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Layout = ({ children }) => {
  const [session, loading] = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login')
    }
  }, [session, loading])

  if (loading) return null

  return (
    <div>
      {children}
    </div>
  )
}

export default Layout