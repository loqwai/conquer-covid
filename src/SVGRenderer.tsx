import React from 'react'
import { Body, Engine } from 'matter-js'

interface Props {
  engine: Engine | undefined
}

const verticesToPoints = (vertices: Matter.Vector[]) => (
  vertices.map(({ x, y }) => `${x},${y}`).join(' ')
)

const Polygon = ({ body }: { body: Body }) => (
  <polygon points={verticesToPoints(body.vertices)} fill={body.render.fillStyle} />
)

const Circle = ({ body }: { body: Body }) => (
  <circle
    cx={body.position.x}
    cy={body.position.y}
    fill={body.render.fillStyle}
    r={body.circleRadius}
  />
)

const SVGRenderer = ({ engine }: Props) => {
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

  if (!engine) return null

  return <svg viewBox="0 0 800 600">
    {engine.world.bodies.map(body => body.circleRadius ? <Circle key={body.id} body={body} /> : <Polygon key={body.id} body={body} />)}
  </svg>
}

export default SVGRenderer