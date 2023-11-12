"use client"
import { useSession, signOut } from 'next-auth/react'
import { useRouter,usePathname } from 'next/navigation'

const Navbar = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (status === 'loading' || !session) return null
  console.log(pathname)
  return (
    <nav className="bg-blue-500 p-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.push('/shops')} 
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${pathname === '/shops' ? 'bg-blue-700' : ''}`}
        >
          Shops
        </button>
        <div className="flex items-center space-x-4">
          <div className="text-white text-lg">
            {session.user.email}
          </div>
          <button 
            onClick={() => signOut()} 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar