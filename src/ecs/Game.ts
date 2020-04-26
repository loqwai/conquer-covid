import * as R from 'ramda'

import { World, Entity, System, Component, createComponentClass} from 'ecsy'

import { Chance } from 'chance'

import { createPerson, Person } from '../models/room'
import Matter, { Engine, World as MatterWorld, Bodies, Body, Query} from 'matter-js'

const chance = new Chance()

export default class Game {
    static popCount = 90;
    static roomCount = 9
    static columnCount = Math.floor(Math.sqrt(Game.roomCount))
    static rowCount = Math.floor(Game.roomCount / Game.columnCount)
    static maxBigness = 400

    time = 0
    deltaSinceLastMove = 0
    world: World
    rooms: {people: Person[], size: {width: number, height: number}}[] = []

    constructor() {
        this.world = new World()
        this.world.registerComponent(DeltaComponent)
        this.world.registerComponent(RoomComponent)
        this.world.registerSystem(DeltaSystem)
        this.world.registerSystem(RoomSystem)

        R.times(this.createRoom, Game.roomCount)
    }

    step(delta: number) {
      this.time += delta
      this.world.execute(delta, this.time)
    }

    createRoom = () => {
      const initialRoomPeopleCount = Game.popCount / Game.roomCount
      const people = R.times(createPerson, initialRoomPeopleCount)
      const bigness = chance.integer({ min: 100, max: Game.maxBigness })
      const size = {width: bigness, height: bigness}

      const entity = this.world.createEntity()
      entity.addComponent(DeltaComponent)
      entity.addComponent(RoomComponent, {people, size })

      const room = {people, size}
      this.rooms.push(room)
    }
}

const DeltaComponent = createComponentClass<{value: number}>({value: {default: 0}}, 'DeltaComponent')

class DeltaSystem extends System {
  execute(delta: number) {
    this.queries.normal.results.forEach(entity => {
      const data = entity.getMutableComponent(DeltaComponent)
      data.value += delta
    })
  }
}

DeltaSystem.queries = {
  normal: { components: [DeltaComponent] }
}

class RoomComponent extends Component {
  engine: Engine;
  people: Person[] = []
  size = {width: 0, height: 0};

  constructor() {
    super()
    this.engine = Engine.create();
    this.reset()
  }

  reset() {
    this.people = []
    this.size = {width: 0, height: 0}
    this.engine = this.setupEngine()
  }

  setupEngine = () => {
    const { size } = this
    const wallWidth = 1000
    const engine = Engine.create()
    engine.world.gravity.y = 0
    MatterWorld.add(engine.world, [
      Bodies.rectangle(size.width / 2, 0 - wallWidth / 2, size.width, wallWidth, { isStatic: true }),
      Bodies.rectangle(size.width + wallWidth / 2, size.height / 2, wallWidth, size.height, { isStatic: true }),
      Bodies.rectangle(size.width / 2, size.height + wallWidth / 2, size.width, wallWidth, { isStatic: true }),
      Bodies.rectangle(0 - wallWidth / 2, size.height / 2, wallWidth, size.height, { isStatic: true }),
    ])
    return engine
  }
}

class RoomSystem extends System {
  execute(delta: number) {

    this.queries.normal.results.forEach(entity => {
      const {engine, size} = entity.getMutableComponent(RoomComponent)
      const body = chance.pickone(engine.world.bodies)
      if (body.isStatic) return // it's probably a wall
      Body.applyForce(body, {
        x: chance.integer({ min: 0, max: size.width }),
        y: chance.integer({ min: 0, max: size.height }),
      }, {
        x: chance.floating({ min: -0.0001, max: 0.0001 }),
        y: chance.floating({ min: -0.0001, max: 0.0001 }),
      })
      Matter.Engine.update(engine, delta)
      const bodies = engine.world.bodies

      bodies.forEach(b => {
        // @ts-ignore
        Query.collides(b, bodies)
      })

    })
  }
}

RoomSystem.queries = {
  normal: { components: [RoomComponent] }
}
