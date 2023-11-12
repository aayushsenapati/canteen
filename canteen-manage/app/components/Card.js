"use client"

const Card = ({ shop }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{shop.Name}</div>
        <p className="text-gray-700 text-base">
          {shop.Location}
        </p>
        <p className="text-gray-700 text-base">
          {shop.Status}
        </p>
        <p className="text-gray-700 text-base">
          {shop.EmailID}
        </p>
      </div>
    </div>
  )
}

export default Card