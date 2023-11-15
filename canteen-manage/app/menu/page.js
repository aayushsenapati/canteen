"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
Modal.setAppElement('body') // This line is specific to Next.js


const Menu = () => {
    const [shops, setShops] = useState([])
    const [selectedShop, setSelectedShop] = useState("")
    const { data: session, status } = useSession()
    const router = useRouter()
    const [menu, setMenu] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newItem, setNewItem] = useState({ Name: '', Description: '', Price: '' })

    useEffect(() => {
        if (status === 'loading') return // Do nothing while loading
        if (!session) router.replace('/login') // If not authenticated, force log in

        // Fetch shops if session exists
        if (session) {
            fetch(`/api/rest?email=${session.user.email}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        setError(data.error)
                    } else {
                        setShops(data.shops)
                    }
                })
        }
    }, [session, status])

    const handleSelect = (e) => {
        setSelectedShop(e.target.value)
        fetch(`/api/menu?Shop_ID=${e.target.value}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error)
                } else {
                    setMenu(data.menu) // Store the menu data in state
                }
            })
    }
    const handleInputChange = (event) => {
        setNewItem({ ...newItem, [event.target.name]: event.target.value })
    }

    const handleSubmitNew = async (event) => {
        event.preventDefault()
        const response = await fetch('/api/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newItem, Shop_ID: selectedShop }),
        })
        const data = await response.json()
        if (data.error) {
            alert(data.error)
        } else {
            setMenu([...menu, data])
            setNewItem({ Name: '', Description: '', Price: '' })
            setIsModalOpen(false)
        }
    }

    const handleDelete = async (foodId) => {
        const response = await fetch(`/api/menu`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Food_ID: foodId }),
        })
        const data = await response.json()
        if (data.error) {
            alert(data.error)
        } else {
            setMenu(menu.filter(item => item.food_id !== foodId))
        }
    }

    return (
        <div className="p-4 w-full max-w-md ml-0">
            <label htmlFor="shop" className="block text-sm font-medium text-gray-700">Select a shop</label>
            <select id="shop" value={selectedShop} name="shop" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" onChange={handleSelect}>
                <option value="" disabled>Select a shop</option>
                {shops.map(shop => (
                    <option key={shop.shop_id} value={shop.shop_id}>{shop.name}</option>
                ))}
            </select>
            <button
                onClick={() => {
                    if (selectedShop) {
                        setIsModalOpen(true)
                    } else {
                        alert('Please select a shop')
                    }
                }}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Add Item
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
                                value={newItem.Name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Description:</span>
                            <input
                                type="text"
                                name="Description"
                                value={newItem.Description}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Price:</span>
                            <input
                                type="number"
                                name="Price"
                                value={newItem.Price}
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

            {menu.length>0?(<table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {menu.map(item => (
                        <tr key={item.food_id}>
                            <td className="border px-4 py-2">{item.name}</td>
                            <td className="border px-4 py-2">{item.description}</td>
                            <td className="border px-4 py-2">{item.price}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleDelete(item.food_id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                >
                                    X
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>):(
                <></>
            )}
        </div>
    )
}

export default Menu