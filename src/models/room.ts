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
    
    this.engine = Engine.create()
    this.engine.world.gravity.y = 0
    this.people = []
    this.generatePopulation(population)
  }

  start() {}

  generatePopulation(population: number) {
    const{people, size} = this
    R.times(() => {
      const p = new Person()
      p.body.position = {
        x: chance.integer({max: size.width}),
        y: chance.integer({ max: size.width }),
      }
      people.push(p)
    }, population)
  }

  createPerson(): Person {
    const { size } = this
    return {
        id: uuid(),
        infected: false,
        position: {
          x: chance.integer({ max: size.width }),
          y: chance.integer({ max: size.height })
        },
        body: Bodies.circle(
          chance.integer({max: size.width}),
          chance.integer({max: size.height}),
          1
        ),
        name: chance.name()
    }
  }

}

export default Room