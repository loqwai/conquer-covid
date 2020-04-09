import React from 'react'
import Room from './models/room'
import SVGRenderer from './SVGRenderer'
import useInterval from './hooks/useInterval'
const RoomUI = () => {    
    const [room, setRoom] = React.useState<Room>(new Room(10, { height: 100, width: 100 }))

    React.useEffect(() => {
        console.log('hey')      
        room.start() 
    }, [])

    useInterval(() => {
        room.step() 
    }, 100)

    return (
        <div className="Room">
            <SVGRenderer engine={room.engine} />
        </div>
    )
}

export default RoomUI