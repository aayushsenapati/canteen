"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Card from '../components/Card'

const Dashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [shops, setShops] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status === 'loading') return // Do nothing while loading
    if (!session) router.replace('/login') // If not authenticated, force log in

    // Fetch shops if session exists
    if (session) {
      fetch(`/api/getShops?email=${session.user.email}`)
        .then(response => {
          console.log(response)
          return response.json()
        })
        .then(data => {
          if (data.error) {
            setError(data.error)
          } else {
            setShops(data.shops)
          }
        })
    }
  }, [session, status])

  // If session exists, display content
  return (
    <div className="flex flex-wrap justify-center">
      {session && <p>Welcome, {session.user.email}</p>}
      {error && <p>{error}</p>}
      {shops.map(shop => <Card key={shop.Shop_ID} shop={shop} />)}
    </div>
  )
}

export default Dashboard