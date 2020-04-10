import React from 'react'
import * as R from 'ramda'
import { Body, Engine } from 'matter-js'
import { Population, Person } from './models/room'

const verticesToPoints = (vertices: Matter.Vector[]) => (
  vertices.map(({ x, y }) => `${x},${y}`).join(' ')
)

const PersonShape = ({ person }: { person: Person }) => (
  <circle
    cx={person.position.x}
    cy={person.position.y}
    fill={person.infected ? 'red' : 'green'}
    r="5"
  />
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

  return <svg viewBox={`0 0 ${size.width} ${size.height}`}>
    {R.values(population).map(person => <PersonShape key={person.id} person={person} />)}
  </svg>
}

export default SVGRenderer