import React from 'react'
import RoomCard from './RoomCard'

const RoomList = () => {
    return (
        <div className="grid grid-cols-3 gap-4 p-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )
}

export default RoomList