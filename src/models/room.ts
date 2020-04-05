import { Chance } from 'chance'
import * as R from 'ramda'
import {v4 as uuid} from 'uuid'
import { Engine, World, Bodies, Body, Events } from 'matter-js'
// import Matter from 'matter-js'

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
  population: Person[]
  size: Size

  engine: Engine
  constructor(population: Person[], size: Size) {
    this.population = population
    this.size = size
    this.engine = Engine.create()
    this.engine.world.gravity.y = 0
  }

  start() {    
    this.generatePopulation()
  }

  generatePopulation() {
    const { population, size } = this
    R.forEach((p) => {
      if (!p.position) {
        p.position = {
          x: chance.integer({ max: size.width }),
          y: chance.integer({ max: size.height })
        }
      }
      if (!p.id) {
        p.id = uuid()
      }
    }, population)
  }

}

export default Room