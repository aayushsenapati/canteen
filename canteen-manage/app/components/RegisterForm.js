"use client"
import Link from 'next/link'
import { useRef, useState,useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const RegisterForm = () => {
    const firstNameRef = useRef();
    const { data: session, status } = useSession()
    const lastNameRef = useRef();
    const emailRef = useRef();
    const phoneNumberRef = useRef();
    const passwordRef = useRef();
    const [error,setError] = useState("");
    const router = useRouter();



    useEffect(() => {
      // If the session exists, redirect to the dashboard
      if (session) {
        router.replace('/');
      }
    }, [session]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const firstName = firstNameRef.current.value;
        const lastName = lastNameRef.current.value;
        const email = emailRef.current.value;
        const phoneNumber = phoneNumberRef.current.value;
        const password = passwordRef.current.value;

        if (!firstName || !lastName || !phoneNumber || !email || !password) {
          setError("All fields are necessary.");
          return;
        }

        const user = {
          FirstName: firstName,
          LastName: lastName,
          EmailID: email,
          PhoneNumber: phoneNumber,
          Password: password
        };

        try {
          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
          });
    
          if (!response.ok) {
            const data = await response.json();
            setError(data.error);
          } else {
            const data = await response.json();
            router.replace("/login")
            console.log(data)
          }
        } catch (err) {
          setError(err.message);
        }
    }

    return (
        !session&&(<div className="flex flex-col items-center justify-center min-h-screen py-2">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <input ref={firstNameRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" type="text" placeholder="First Name" />
            <input ref={lastNameRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" type="text" placeholder="Last Name" />
            <input ref={emailRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" type="email" placeholder="Email" />
            <input ref={phoneNumberRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" type="tel" placeholder="Phone Number" />
            <input ref={passwordRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" type="password" placeholder="Password" />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Register</button>
            {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
            <p className="text-center mt-4">
              Have an account? 
              <Link href="/signIn">
                <span className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Login</span>
              </Link>
            </p>
          </form>
        </div>)
      )
}

export default RegisterForm