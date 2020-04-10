import React from 'react'
import Room from './models/room'
import SVGRenderer from './SVGRenderer'
import useInterval from './hooks/useInterval'

import './Room.css'

const RoomUI = () => {
    const [room, setRoom] = React.useState<Room | undefined>(undefined)

    React.useEffect(() => {
        setRoom(new Room(10, { height: 600, width: 800 }))
    }, [])

    useInterval(room?.introduceEntropy, 100);

    if (!room) return <h1>Loading</h1>

    return (
        <div className="Room">
            <SVGRenderer population={room.population} />
        </div>
    )
}

export default RoomUI