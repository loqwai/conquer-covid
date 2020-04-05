import { Chance } from 'chance'
import * as R from 'ramda'
import {v4 as uuid} from 'uuid'
import { Engine, World, Bodies, Body, Events } from 'matter-js'

export interface Person {
  infected: boolean
  id?: string
  position?: Point

}

interface Population {
  [key: number]: Person
}

interface Point {
  x: number
  y: number
}

interface Size {
  height: number
  width: number
}


const chance = new Chance()
class Room {
  people: Person[]
  size: Size
  engine: Engine

  constructor(population: number, size: Size) {
    this.size = size
    
    this.engine = Engine.create()
    this.engine.world.gravity.y = 0

    this.generatePopulation(population)
  }

  start() {    

  }

  generatePopulation(population: number) {
    const people: Person[] = []
    R.times(() => people.push(this.createPerson()), population)
    this.people = people
  }

  createPerson(): Person {
    const { size } = this
    return {
        id: uuid(),
        infected: false,
        position: {
          x: chance.integer({ max: size.width }),
          y: chance.integer({ max: size.height })
        }
    }
  }

}

export default Room