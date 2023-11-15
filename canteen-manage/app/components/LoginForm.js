"use client"
import { signIn } from "next-auth/react";
import { useRef ,useState,useEffect} from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'



const LoginForm = () => {
  const { data: session, status } = useSession()
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const router = useRouter()

  useEffect(() => {
    // If the session exists, redirect to the dashboard
    if (session) {
      router.replace('/');
    }
  }, [session]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      setError("Both fields are necessary.");
      return;
    }

    const result = await signIn('credentials', { email, password , callbackUrl:'/shops'})
    //clear password reference
    passwordRef.current.value = "";

    if (!result.error) {
      console.log('yay')
    } else {
      setError(result.error);
    }
  }

  return (
    !session&&(<div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <input ref={emailRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" type="email" placeholder="Email" />
        <input ref={passwordRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" type="password" placeholder="Password" />
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
    </div>)
  )
}

export default LoginForm