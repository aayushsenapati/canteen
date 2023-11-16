import { NextResponse } from 'next/server'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    console.log("hello")
    const res = await fetch(`http://localhost:5000/Shop/${email}`)
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


export async function DELETE(req) {
const body = await req.json();
console.log(body);

// Send a DELETE request to your server
const response = await fetch(`http://localhost:5000/Shop/${body.Shop_ID}`, {
    method: 'DELETE',
    headers: {
    'Content-Type': 'application/json'
    }
});

const data = await response.json();

if (!response.ok || data.Error) {
    // Handle error response
    const errorMessage = data.Error || 'An error occurred';
    return NextResponse.json({ error: errorMessage }, { status: response.status });
} else {
    // Handle success response
    return NextResponse.json(data, { status: 200 });
}
}


export async function POST(req) {
const body = await req.json()
console.log(body)

// Send a request to your server
const response = await fetch('http://localhost:5000/Shop', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    Name: body.Name,
    Location: body.Location,
    Status: body.Status,
    EmailID: body.EmailID
    })
});

const data = await response.json();

if (!response.ok || data.Error) {
    // Handle error response
    const errorMessage = data.Error || 'An error occurred';
    return NextResponse.json({ error: errorMessage }, { status: response.status});
} else {
    // Handle success response
    return NextResponse.json(data, { status: 200 });
}
}

export async function PUT(req) {
const body = await req.json()
console.log(body)

// Send a request to your server
const response = await fetch('http://localhost:5000/Shop', {
    method: 'PUT',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    Name: body.Name,
    Location: body.Location,
    Status: body.Status,
    EmailID: body.EmailID,
    Shop_ID: body.Shop_ID
    })
});

const data = await response.json();

if (!response.ok || data.Error) {
    // Handle error response
    const errorMessage = data.Error || 'An error occurred';
    return NextResponse.json({ error: errorMessage }, { status: response.status});
} else {
    // Handle success response
    return NextResponse.json(data, { status: 200 });
}
}