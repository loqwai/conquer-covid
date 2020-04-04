import React from 'react'
import * as R from 'ramda'
import './App.css'
import { Engine, World, Bodies, Body, Events } from 'matter-js'
import Matter from 'matter-js'
import SVGRenderer from './SVGRenderer'
import useInterval from './hooks/useInterval'

interface Person {
  infected: boolean;
  id: number | undefined;
}

interface Population {
  [key: number]: Person;
}

//don't worry about it
const random = (min: number, max: number): number => (Matter as any).Common.random(min, max)
const choose: <T> (list: T[] | undefined) => T | undefined = (list) => {
  if (R.isNil(list)) return
  return (Matter as any).Common.choose(list)
}

const generateCircle = () => (
  Bodies.circle(random(0, 800), random(0, 600), 5, { 
    render: { 
      fillStyle: Math.random() < 0.02 ? 'red' : 'green'
    }
  })
) 

const currentUrl = new URL(window.location.href)
const getPopulationSizeOrDefault = () => {
  const defaultSize = 1000

  const sizeString = currentUrl.searchParams.get('populationSize')
  if (!sizeString) return defaultSize

  const size = parseInt(sizeString, 10)
  if (isNaN(size)) return defaultSize

  return size
}

const App = () => {
  const setPopulation = React.useState<Population>({})[1]
  const [engine, setEngine] = React.useState<Engine | undefined>(undefined)

  React.useEffect(() => {
    const circles: Body[] = R.times(generateCircle, getPopulationSizeOrDefault()) 
    const people = circles.map(({ id, render: { fillStyle } }) => ({ 
      id, 
      infected: fillStyle === 'red' 
    }))

    setPopulation(R.indexBy(person => `${person.id}`, people))

    const engine = Engine.create()
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

          const personA = population[bodyA.id]
          const personB = population[bodyB.id]

          if (R.isNil(personA) || R.isNil(personB)) return

          if (personA.infected || personB.infected) {
            bodyA.render.fillStyle = bodyB.render.fillStyle = 'red'
            personB.infected = personA.infected = true
          }
        })

        return population
      })
    })

    Engine.run(engine)
    setEngine(engine)
  }, [setPopulation])

  useInterval(() => {
    const body = choose(engine?.world.bodies)
    if (!body) return // we probably got called before the engine exists
    if (body.isStatic) return // it's probably a wall

    Body.applyForce(body, { x: random(0, 800), y: random(0, 600) }, { x: random(-0.0001, 0.0001), y: random(-0.0001, 0.0001) })
  }, 100, [engine])

  return (
    <div className="App">
      <SVGRenderer engine={engine} />
    </div>
  )
}

export default App
