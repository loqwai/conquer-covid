import * as R from 'ramda'

import { World, System, Component} from 'ecsy'

import { Chance } from 'chance'

import Room, { createPerson } from '../models/room'

const chance = new Chance()

const createRooms = () => {
  const people = R.times(createPerson, Game.popCount)
  chance.pickone(people).infected = true
  const roomPops = R.splitEvery(Game.popCount / Game.roomCount, people)
  return R.map(roomPop => {
    const bigness = chance.integer({ min: 100, max: Game.maxBigness })
    return new Room(roomPop, { height: bigness, width: bigness })
  }, roomPops)
}

export default class Game {
    static popCount = 90;
    static roomCount = 9
    static columnCount = Math.floor(Math.sqrt(Game.roomCount))
    static rowCount = Math.floor(Game.roomCount / Game.columnCount)
    static maxBigness = 400

    rooms: Room[];
    time = 0
    deltaSinceLastMove = 0
    world: World

    constructor() {
        this.world = new World()
        this.world.registerComponent(WiggleComponent)
        this.world.registerSystem(WiggleSystem)
        this.rooms = []
        R.times(this.createRoom, Game.roomCount)
    }

    step(delta: number) {
      this.time += delta
      this.world.execute(delta, this.time)
      if (this.deltaSinceLastMove < 100) return

      this.moveOneRandomPerson()
      this.wiggleThePeople()
      this.deltaSinceLastMove = 0
    }

    moveOneRandomPerson = () => {
        const r1 = chance.pickone(this.rooms)
        const r2 = chance.pickone(this.rooms)

        if (R.isEmpty(r1.getPeople())) return

        const person = chance.pickone(r1.getPeople())
        r1.removePerson(person.id)
        r2.addPerson(person)
    }

    wiggleThePeople = () => {
        this.rooms.forEach(r => r.introduceEntropy())
    }

    createRoom = () => {
      const initialRoomPeopleCount = Game.popCount / Game.roomCount
      const people = R.times(createPerson, initialRoomPeopleCount)
      const bigness = chance.integer({ min: 100, max: Game.maxBigness })

      const room = new Room(people, { height: bigness, width: bigness })
      const entity = this.world.createEntity()
      entity.addComponent(WiggleComponent, { room })
      this.rooms.push(room)
    }
}

class WiggleComponent extends Component {
  deltaWiggle = 0
  room: Room | undefined

  reset() {
    this.deltaWiggle = 0
    this.room = undefined
  }
}

class WiggleSystem extends System {
  execute(delta: number) {
    this.queries.normal.results.forEach(entity => {
      const data = entity.getMutableComponent(WiggleComponent)
      data.deltaWiggle += delta
      if(data.deltaWiggle > 100) {
        data.deltaWiggle = 0
        data.room?.introduceEntropy()
      }
    })

  }
}

WiggleSystem.queries = {
  normal: { components: [WiggleComponent] }
}


