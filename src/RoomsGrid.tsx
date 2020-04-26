import React from 'react'
import useAnimationFrame from './hooks/useAnimationFrame'
import { Person } from './models/room'
import RoomComponent from './Room'

interface Room {
  people: Person[],
  size: {width: number, height: number}
}

interface Props {
  columnCount: number;
  rooms: Room[] | undefined
}

const Town = ({columnCount, rooms}: Props) => {
  const [roomsData, setRoomsData] = React.useState<Room[]>([])

  useAnimationFrame(() => {
    if (!rooms) return;
    setRoomsData([...rooms])
  })

  return (
    <>
      {roomsData?.map((room, i) => (
        <RoomComponent key={i} {...room} row={Math.floor(i / columnCount)} column={i % columnCount} />)
      )}
    </>
  )

}

export default Town