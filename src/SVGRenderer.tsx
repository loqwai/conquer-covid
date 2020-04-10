import React from 'react'
import * as R from 'ramda'
import { Population, Person } from './models/room'

import './SVGRenderer.css'

const verticesToPoints = (vertices: Matter.Vector[]) => (
  vertices.map(({ x, y }) => `${x},${y}`).join(' ')
)

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
  population: Population;
  size: {
    height: number;
    width: number;
  }
}

const SVGRenderer = ({ population, size }: Props) => {
  const setRenderCount = React.useState(0)[1]

  React.useEffect(() => {
    let stop = false
    const animate = () => {
      if (stop) return

      setRenderCount(i => i + 1) // rerender
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)

    return () => { stop = true }
  }, [setRenderCount])

  if (!population) return null

  return <svg viewBox={`0 0 ${size.width} ${size.height}`} style={size}>
    {R.values(population).map(person => <PersonShape key={person.id} person={person} />)}
  </svg>
}

export default SVGRenderer