import { Chance } from 'chance'
import * as R from 'ramda'
import {v4 as uuid} from 'uuid'
import { Engine, World, Bodies, Body, Events } from 'matter-js'

const chance = new Chance()
export class Person {
  infected: boolean = false
  id = uuid()
  position: Point = {x:0,y:0}
  name = chance.name()
  body = Bodies.circle(0,0,5)
  constructor(){
        
  }
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
    this.people = this.generatePopulation(population)
    this.engine = this.setupEngine()
    this.generatePopulation(population)
  }

  start() {
    const {engine} = this
    this.generatePopulationPosition()
    Engine.run(engine)
  }

  generatePopulationPosition() {
    const { engine, people, size } = this
    R.forEach(({ body }) => {
      body.position = {
        x: chance.integer({ max: size.width }),
        y: chance.integer({ max: size.height }),
      }
      World.add(engine.world, body)
    }, people)
  }

  step() {

  }

  setupEngine() {
    const engine = Engine.create()
    engine.world.gravity.y = 0
    World.add(engine.world, [
      Bodies.rectangle(400, 0, 800, 10, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 10, { isStatic: true }),
      Bodies.rectangle(800, 300, 10, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 10, 600, { isStatic: true })
    ])
    return engine
  }

  //This will eventually be done outside the room.
  generatePopulation(population: number) {
    const people: Person[] = new Array(population)    
    return people.fill(new Person())
  }

}

export default Room