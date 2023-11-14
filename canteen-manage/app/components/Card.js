"use client"
import { useEffect } from 'react';


const Card = ({ shop ,onEdit,onDelete}) => {
  // Add this function inside your Card component
const handleDelete = async (event) => {
  event.stopPropagation(); // Prevent triggering onEdit when delete is clicked
  const response = await fetch('/api/deleteRest', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Shop_ID: shop.shop_id }),
  });
  const data = await response.json();
  if (data.error) {
    alert(data.error);
  } else {
    // Call onDelete prop to remove the shop from the state in the Dashboard component
    onDelete(shop.shop_id);
  }
};
return (
  <div className="relative flex flex-col bg-white rounded-lg shadow-md m-4 max-w-sm" onClick={()=>onEdit(shop)}>
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2 text-blue-600">Name: {shop.name}</div>
      <p className="text-gray-700 text-base">
        <span className="font-semibold">Location:</span> {shop.location}
      </p>
      <p className="text-gray-700 text-base">
        <span className="font-semibold">Status:</span> {shop.status}
      </p>
      <p className="text-gray-700 text-base">
        <span className="font-semibold">Shop ID:</span> {shop.shop_id}
      </p>
    </div>
    <div className="px-6 pt-4 pb-2">
      <span className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2 mb-2">#shop</span>
      <span className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2 mb-2">#location</span>
    </div>
    <button onClick={handleDelete} className="absolute top-0 right-0 mt-2 mr-2">X</button>
  </div>
)
}

export default Card