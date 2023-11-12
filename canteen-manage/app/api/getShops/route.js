import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  console.log("hello")
  const res = await fetch(`http://canteen-server:5000/Shop/${email}`)
  const shops = await res.json()

  if (!res.ok || shops.Error) {
    // Handle error response
    const errorMessage = shops.Error || 'An error occurred'
    return NextResponse.json({ error: errorMessage }, { status: res.status })
  } else {
    // Handle success response
    return NextResponse.json({ shops }, { status: 200 })
  }
}