"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Card from '../components/Card'
import Modal from 'react-modal'
Modal.setAppElement('body');

const Dashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [shops, setShops] = useState([])
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newShop, setNewShop] = useState({ Name: '', Location: '', Status: '' })
  const [currentShop, setCurrentShop] = useState({ Name: '', Location: '', Status: '',Shop_ID:'' })
  
  const handleInputChange = (event) => {
    setNewShop({ ...newShop, [event.target.name]: event.target.value })
  }

  const handleUpdateChange = (event) => {
    setCurrentShop({ ...currentShop, [event.target.name]: event.target.value })
  }

  const onDelete = (shop_id) => {
    setShops(prevShops => prevShops.filter(shop => shop.shop_id !== shop_id));
  };

  const handleSubmitNew = async (event) => {
    event.preventDefault()
    const response = await fetch('/api/rest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newShop, EmailID: session.user.email }),
    })
    const data = await response.json()
    if (data.error) {
      alert(data.error)
    } else {
      setShops([...shops, data])
      setNewShop({ Name: '', Location: '', Status: '' })
      setIsModalOpen(false)
    }
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/rest', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...currentShop, EmailID: session.user.email }),
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      //setShops(prevShops => prevShops.map(shop => shop.Shop_ID === currentShop.Shop_ID ? data : shop));
      const newArr=shops.map(shop => shop.shop_id === currentShop.Shop_ID ? data  : shop)
      setShops(newArr);
      console.log("this is shops:",shops)
      console.log("this is data:",data)
      setCurrentShop({ Name: '', Location: '', Status: '',Shop_ID:'' });
      setIsEditModalOpen(false);
    }
  };
  useEffect(() => {
    if (status === 'loading') return // Do nothing while loading
    if (!session) router.replace('/login') // If not authenticated, force log in

    // Fetch shops if session exists
    if (session) {
      fetch(`/api/rest?email=${session.user.email}`)
        .then(response => {
          console.log(response)
          return response.json()
        })
        .then(data => {
          if (data.error) {
            setError(data.error)
          } else {
            setShops(data.shops)
          }
        })
    }
  }, [session, status])

  // If session exists, display content
  return (
    session && (
      <div className="flex flex-col items-center justify-center mt-10">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-10"
        >
          Add New Shop
        </button>
        <Modal 
          isOpen={isModalOpen} 
          onRequestClose={() => setIsModalOpen(false)} 
          className="flex items-center justify-center mt-10 outline-none"
        >
          <div className="bg-white rounded-lg w-1/2 p-10 shadow-lg">
            <form onSubmit={handleSubmitNew} className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Name:</span>
                <input 
                  type="text" 
                  name="Name" 
                  value={newShop.Name} 
                  onChange={handleInputChange} 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Location:</span>
                <input 
                  type="text" 
                  name="Location" 
                  value={newShop.Location} 
                  onChange={handleInputChange} 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Status:</span>
                <input 
                  type="text" 
                  name="Status" 
                  value={newShop.Status} 
                  onChange={handleInputChange} 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </Modal>

        <Modal 
          isOpen={isEditModalOpen} 
          onRequestClose={() => setIsEditModalOpen(false)} 
          className="flex items-center justify-center mt-10 outline-none"
        >
          <div className="bg-white rounded-lg w-1/2 p-10 shadow-lg">
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Name:</span>
                <input 
                  type="text" 
                  name="Name" 
                  value={currentShop.Name} 
                  onChange={handleUpdateChange} 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Location:</span>
                <input 
                  type="text" 
                  name="Location" 
                  value={currentShop.Location} 
                  onChange={handleUpdateChange} 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Status:</span>
                <input 
                  type="text" 
                  name="Status" 
                  value={currentShop.Status} 
                  onChange={handleUpdateChange} 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </Modal>

        <div className="flex flex-wrap justify-center">
          {shops.map(shop => <Card key={shop.shop_id} shop={shop} onEdit={(shop)=>{
            setCurrentShop({
              Name: shop.name,
              Location: shop.location,
              Status: shop.status,
              Shop_ID: shop.shop_id
            })
            setIsEditModalOpen(true)
          }} onDelete={onDelete}/>)}
        </div>
      </div>
    )
  )
}

export default Dashboard