import React from 'react'

const RoomCard = ({room}) => {
        return (
          <div className="border rounded-lg p-4 shadow-lg bg-white">
            <img src={room.image} alt="Room" className="rounded-md mb-3" />
            <h3 className="font-bold">{room.name}</h3>
            <p>{room.details}</p>
            <p className="text-lg font-semibold">${room.price}</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded mt-2">Book Now</button>
          </div>
        );
}

export default RoomCard