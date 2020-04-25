import * as R from 'ramda'
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

    rooms: ReturnType<typeof createRooms>
    time = 0
    deltaSinceLastMove = 0

    constructor() {
        this.rooms = createRooms()
    }

    step(delta: number) {
      this.deltaSinceLastMove += delta

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

}

