import bcrypt from 'bcryptjs';

export async function POST(req, res) {
  const body=await req.json()
  console.log(body)


  // Hash the password
  const hashedPassword = await bcrypt.hash(body.password, 10);

  // Send a request to your server
  const response = await fetch('http://server:5000/Vendor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      FirstName: body.firstName,
      LastName: body.lastName,
      EmailID: body.email,
      PhoneNumber: body.phoneNumber,
      Password: hashedPassword
    })
  });

  const data = await response.json();

  if (!response.ok || data.Error) {
    // Handle error response
    const errorMessage = data.Error || 'An error occurred';
    res.status(response.status).json({ error: errorMessage });
  } else {
    // Handle success response
    res.status(200).json(data);
  }
}
