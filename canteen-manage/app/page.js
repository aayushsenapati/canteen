"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'


export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) router.replace('/login') // If not authenticated, force log in
  }, [session])
  return (
    session&&(<div>hello vendors</div>)
  ) 
}

