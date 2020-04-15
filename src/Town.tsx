import React, { useEffect } from 'react'
import useAnimationFrame from './hooks/useAnimationFrame'
import Room from './models/room'
import RoomComponent from './Room'

interface Props {
  columnCount: number;
  rooms: Room[]
}

const Town = ({columnCount, rooms}: Props) => {
  const [roomsData, setRoomsData] = React.useState(rooms.map(r => r.toData()))

  useEffect(() => {
    console.log('Town construction')
    return () => console.log('Town destruction')
  }, [])

  useAnimationFrame(() => {
    setRoomsData(rooms.map(r => r.toData()))
  })

  return (
    <>
      {roomsData.map((room, i) => (
        <RoomComponent key={i} {...room} row={Math.floor(i / columnCount)} column={i % columnCount} />)
      )}
    </>
  )

}

export default Town