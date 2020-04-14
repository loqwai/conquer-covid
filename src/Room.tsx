import React from 'react'
import * as R from 'ramda'
import { Population, Person } from './models/room'

import './SVGRenderer.css'

const PersonShape = ({ person }: { person: Person }) => (
  <>
    <text
      className="person-shape-face"
      x={person.position.x - 5}
      y={person.position.y + 5}
    >{person.infected ? '🤮' : '🙂'}</text>
    <text
      className="person-shape-name"
      x={person.position.x - 5}
      y={person.position.y + 10}
      lengthAdjust="spacingAndGlyphs"
      textLength="10"
    >{person.name}</text>
  </>
)

interface Props {
  row: number;
  column: number;
  population: Population;
  size: {
    height: number;
    width: number;
  }
}

const Room = ({ row, column, population, size }: Props) => {
  if (!population) return null

  const maxWidth = 400
  const maxHeight = 400

  const offsetX = (maxWidth - size.width) / 2
  const offsetY = (maxHeight - size.height) / 2

  return <g style={{transform: `translate(${column * maxWidth}px, ${row * maxHeight}px)`}}>
    <rect width={maxWidth} height={maxHeight} fill="transparent" stroke="#cccccc" />
    <g style={{transform: `translate(${offsetX}px, ${offsetY}px)`}}>
      <rect width={size.width} height={size.height} fill="transparent" stroke="black" />
      {R.values(population).map(person => <PersonShape key={person.id} person={person} />)}
    </g>
  </g>
}

export default Room