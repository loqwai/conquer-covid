import React from 'react'
import * as R from 'ramda'
import './App.css'
import { Engine, World, Bodies, Body, Events } from "matter-js"
import Matter from "matter-js"
import { v4 as uuidv4 } from 'uuid'

interface Person {
  x: number;
  y: number;
  infected: boolean;
  id: number | undefined;
}

const initialPopulation: Person[] = []

const zoom = 1

for (let i = 0; i < 1000; i++) {
  initialPopulation.push({
    x: Math.random() * 800 / zoom,
    y: Math.random() * 600 / zoom,
    infected: Math.random() < 0.02,
    id: undefined,
  })
}
//don't worry about it
const random = (min: number, max: number): number => (Matter as any).Common.random(min, max)
const choose = (Matter as any).Common.choose as <T>(arg0: T[]) => T

const App = () => {
  const [population, setPopulation] = React.useState(initialPopulation)

  React.useEffect(() => {
    const engine = Engine.create()

    const circles = initialPopulation.map(({ x, y }) =>
      Bodies.circle(x, y, 5))

    engine.world.gravity.y = 0
    World.add(engine.world, circles)

    // walls
    World.add(engine.world, [
      Bodies.rectangle(400, 0, 800, 10, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 10, { isStatic: true }),
      Bodies.rectangle(800, 300, 10, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 10, 600, { isStatic: true })
    ])

    Events.on(engine, 'collisionStart', function (event) {
      setPopulation(population => {
        var pairs = event.pairs

        pairs.forEach(pair => {
          const { bodyA, bodyB } = pair

          const personA = R.find(R.propEq('id', bodyA.id), population)
          const personB = R.find(R.propEq('id', bodyB.id), population)

          if (R.isNil(personA) || R.isNil(personB)) return;

          personA.infected = personA.infected || personB.infected
          personB.infected = personA.infected
        })

        return population
      })
    })

    Engine.run(engine)

    const interval = setInterval(() => {
      const circle = choose(circles)
      Body.applyForce(circle, { x: random(0, 800), y: random(0, 600) }, { x: random(-0.0001, 0.0001), y: random(-0.0001, 0.0001) })
    }, 100)


    let stop = false
    const animate = () => {
      setPopulation(population => circles.map<Person>((c, i) => ({ ...population[i], ...c.position, id: c.id })))

      if (stop) return
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)

    return () => {
      stop = true
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="App">
      <svg viewBox={`0 0 800 600`}>
        {population.map(({ x, y, infected, id }) => (
          <circle
            key={id}
            cx={x}
            cy={y}
            fill={infected ? 'red' : 'green'}
            r="5" />
        ))}l
      </svg>
    </div>
  )
}

export default App
