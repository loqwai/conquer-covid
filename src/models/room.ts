import { Chance } from 'chance'
import * as R from 'ramda'
import { v4 as uuid } from 'uuid'
import { Engine, World, Bodies, Body, Events } from 'matter-js'

const chance = new Chance()
export class Person {
  infected: boolean = false
  id = uuid()
  position: Point = { x: 0, y: 0 }
  name = chance.name()
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
  people: Person[]
  size: Size
  engine: Engine

  constructor(population: number, size: Size) {
    this.size = size
    this.engine = this.setupEngine()
    this.people = this.generatePopulation(population)
    this.generatePopulationPosition();
    this.start()
  }

  start = () => {
    const { engine } = this
    Engine.run(engine)
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
    const { engine, people, size } = this
    R.forEach(() => {
      const body = Bodies.circle(
        chance.integer({ min: 0, max: size.width }),
        chance.integer({ min: 0, max: size.width }),
        5,
      )
      World.add(engine.world, body)
    }, people)
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
    R.times(() => new Person(), population)
  )
}

export default Room