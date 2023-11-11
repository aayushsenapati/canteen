import bcrypt from 'bcryptjs';

export async function POST(req, res) {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Send a request to your server
  const response = await fetch('http://server:5000/Vendor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      FirstName: firstName,
      LastName: lastName,
      EmailID: email,
      PhoneNumber: phoneNumber,
      Password: hashedPassword
    })
  });

  if (!response.ok) {
    // Handle error response
    const errorData = await response.json();
    res.status(response.status).json(errorData);
  } else {
    // Handle success response
    const data = await response.json();
    res.status(200).json(data);
  }
}
