import { Chance } from 'chance'
import * as R from 'ramda'
import { v4 as uuid } from 'uuid'
import { Engine, World, Bodies, Body, Events } from 'matter-js'

const chance = new Chance()

export interface Person {
  id: string;
  infected: boolean;
  position: {
    x: number;
    y: number;
  }
  name: string;
}

const createPerson = (): Person => ({
  infected: false,
  id: uuid(),
  position: { x: 0, y: 0 },
  name: chance.name(),
})

export interface Population {
  [key: string]: Person
}

interface Point {
  x: number
  y: number
}

interface Size {
  height: number
  width: number
}

class Room {
  population: Population
  size: Size
  engine: Engine

  constructor(populationSize: number, size: Size) {
    this.size = size
    this.engine = this.setupEngine()
    this.population = this.generatePopulation(populationSize)
    this.generatePopulationPosition();
    this.start()
  }

  start = () => {
    const { engine } = this
    Engine.run(engine)
    Events.on(engine, 'afterUpdate', () => {
      this.syncPopulationPosition()
    })
  }

  introduceEntropy = () => {
    const { engine, size } = this
    const body = chance.pickone(engine.world.bodies)
    if (!body) return // we probably got called before the engine exists
    if (body.isStatic) return // it's probably a wall

    Body.applyForce(body, {
      x: chance.integer({ min: 0, max: size.width }),
      y: chance.integer({ min: 0, max: size.height }),
    }, {
      x: chance.floating({ min: -0.0001, max: 0.0001 }),
      y: chance.floating({ min: -0.0001, max: 0.0001 }),
    })
  }

  generatePopulationPosition = () => {
    const { engine, population: people, size } = this
    R.forEach(({ id }) => {
      const body = Bodies.circle(
        chance.integer({ min: 0, max: size.width }),
        chance.integer({ min: 0, max: size.width }),
        5,
        { label: id })
      World.add(engine.world, body)
    }, R.values(people))
  }

  syncPopulationPosition = () => {
    const { engine, population } = this
    R.forEach(body => {
      if (!body.label) return;
      const person = population[body.label]
      if (!person) return
      person.position = body.position
    }, engine.world.bodies)
  }

  setupEngine = () => {
    const { size } = this
    const wallWidth = 10
    const engine = Engine.create()
    engine.world.gravity.y = 0
    World.add(engine.world, [
      Bodies.rectangle(size.width / 2, 0, size.width, wallWidth, { isStatic: true }),
      Bodies.rectangle(size.width, size.height / 2, wallWidth, size.height, { isStatic: true }),
      Bodies.rectangle(size.width / 2, size.height, size.width, wallWidth, { isStatic: true }),
      Bodies.rectangle(0, size.height / 2, wallWidth, size.height, { isStatic: true }),
    ])
    return engine
  }

  //This will eventually be done outside the room.
  generatePopulation = (population: number) => (
    R.indexBy(R.prop('id'), R.times(createPerson, population))
  )
}

export default Room