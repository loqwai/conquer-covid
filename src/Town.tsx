import React from 'react'

import Room from './models/room'
import SVGRenderer from './SVGRenderer'

interface Props {
    rooms : Room[]    
}

const Town = ({ rooms }: Props) => {
    return (<div className="World">
        {rooms.map((room, i) => <SVGRenderer key={i} {...room} />)}
    </div>)
}

export default Town
