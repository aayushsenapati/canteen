import { NextResponse } from 'next/server'

export async function PUT(req) {
    const body = await req.json()
    console.log(body)
  
    // Send a request to your server
    const response = await fetch('http://canteen-server:5000/Shop', {
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