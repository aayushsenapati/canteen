import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const shopId = searchParams.get('Shop_ID')

  const res = await fetch(`http://localhost:5000/Menu/${shopId}`)
  const menu = await res.json()

  if (!res.ok || menu.Error) {
    // Handle error response
    const errorMessage = menu.Error || 'An error occurred'
    return NextResponse.json({ error: errorMessage }, { status: res.status })
  } else {
    // Handle success response
    return NextResponse.json({ menu }, { status: 200 })
  }
}



export async function POST(request) {
  const body = await request.json()
  const { Name, Description, Price, Shop_ID } = body

  const res = await fetch(`http://localhost:5000/Menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Name, Description, Price, Shop_ID }),
  })
  const data = await res.json()

  if (!res.ok || data.Error) {
    // Handle error response
    const errorMessage = data.Error || 'An error occurred'
    return NextResponse.json({ error: errorMessage }, { status: res.status })
  } else {
    // Handle success response
    return NextResponse.json(data, { status: 200 })
  }
}

export async function DELETE(req) {
    const body = await req.json()
    const { Food_ID } = body

    const response = await fetch(`http://localhost:5000/Menu/${Food_ID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()

    if (!response.ok || data.Error) {
        const errorMessage = data.Error || 'An error occurred'
        return NextResponse.json({ error: errorMessage }, { status: response.status })
    } else {
        return NextResponse.json(data, { status: 200 })
    }
}