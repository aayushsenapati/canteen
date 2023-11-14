import { NextResponse } from 'next/server'

export async function DELETE(req) {
    const body = await req.json();
    console.log(body);
  
    // Send a DELETE request to your server
    const response = await fetch(`http://canteen-server:5000/Shop/${body.Shop_ID}`, {
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