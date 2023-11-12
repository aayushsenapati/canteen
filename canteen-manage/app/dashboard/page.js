"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Dashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Do nothing while loading
    if (!session) router.push('/login') // If not authenticated, force log in
  }, [session, status, router])

  // If session exists, display content
  return (
    <div>
      {session && <p>Welcome, {session.user.email}</p>}
    </div>
  )
}

export default Dashboard