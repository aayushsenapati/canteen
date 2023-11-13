"use client"
import { useEffect } from 'react';

const Card = ({ shop ,onEdit}) => {
  useEffect(() => {
    console.log('Shop prop changed:', shop);
  }, [shop]);
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md m-4 max-w-sm" onClick={()=>onEdit(shop)}>
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
    </div>
  )
}

export default Card