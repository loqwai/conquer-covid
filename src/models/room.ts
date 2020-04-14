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

export const createPerson = (): Person => ({
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

  constructor(population: Person[], size: Size) {
    this.size = size
    this.engine = this.setupEngine()
    this.population = {}
    R.forEach(this.addPerson, population)
    this.start()

    population.forEach(this.addPerson)
  }

  addPerson = (person: Person) => {
    const { population, engine, size } = this
    population[person.id] = person
    const body = Bodies.circle(
      chance.integer({ min: 0, max: size.width }),
      chance.integer({ min: 0, max: size.width }),
      5,
      { label: person.id })
    World.add(engine.world, body)
  }

  removePerson = (id: string) => {
    const { population, engine } = this
    delete population[id]
    const body = R.find(R.propEq('label', id), engine.world.bodies)
    if (!body) return
    World.remove(engine.world, body)
  }

  getPeople = () => {
    return R.values(this.population)
  }

  start = () => {
    const { engine, population } = this
    Engine.run(engine)
    Events.on(engine, 'afterUpdate', () => {
      this.syncPopulationPosition()
    })
    Events.on(engine, 'collisionStart', ({ pairs }) => {
      pairs.forEach(({ bodyA, bodyB }) => {
        const p1 = population[bodyA.label]
        const p2 = population[bodyB.label]
        if (!p2 || !p1) return
        p1.infected = p2.infected = (p1.infected || p2.infected)
      })
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

  toData = () => ({
    population: this.population,
    size: this.size
  })

  syncPopulationPosition = () => {
    const { engine, population } = this
    R.forEach(body => {
      if (!body.label) return
      const person = population[body.label]
      if (!person) return
      person.position = body.position
    }, engine.world.bodies)
  }

  setupEngine = () => {
    const { size } = this
    const wallWidth = 1000
    const engine = Engine.create()
    engine.world.gravity.y = 0
    World.add(engine.world, [
      Bodies.rectangle(size.width / 2, 0 - wallWidth / 2, size.width, wallWidth, { isStatic: true }),
      Bodies.rectangle(size.width + wallWidth / 2, size.height / 2, wallWidth, size.height, { isStatic: true }),
      Bodies.rectangle(size.width / 2, size.height + wallWidth / 2, size.width, wallWidth, { isStatic: true }),
      Bodies.rectangle(0 - wallWidth / 2, size.height / 2, wallWidth, size.height, { isStatic: true }),
    ])
    return engine
  }
}

export default Room