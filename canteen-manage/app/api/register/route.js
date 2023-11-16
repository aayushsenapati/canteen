import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server'

export async function POST(req) {
  const body = await req.json()
  console.log(body)

  // Hash the password
  const hashedPassword = await bcrypt.hash(body.Password, 10);

  // Send a request to your server
  const response = await fetch('http://localhost:5000/Vendor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      FirstName: body.FirstName,
      LastName: body.LastName,
      EmailID: body.EmailID,
      PhoneNumber: body.PhoneNumber,
      Password: hashedPassword
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
