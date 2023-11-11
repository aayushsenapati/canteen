import { signIn } from 'next-auth/client'
import { useState } from 'react'
import { useRouter } from 'next/router'
import bcrypt from 'bcryptjs'

const LoginForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = await signIn('credentials', { email, password: hashedPassword, redirect: false })

    if (!result.error) {
      router.push('/dashboard');
    } else {
      setError(result.error);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <input onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" type="email" placeholder="Email" />
        <input onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" type="password" placeholder="Password" />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Login</button>
        {error && (
          <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
            {error}
          </div>
        )}
        <p className="text-center mt-4">
          Don't have an account? 
          <Link href="/register">
            <span className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Register</span>
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginForm