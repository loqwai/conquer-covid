import React from 'react'
import * as R from 'ramda'
import Room from './models/room'
import { Chance } from 'chance'
import './App.css'
import {createPerson } from './models/room'
import useInterval from './hooks/useInterval'
import SVGRenderer from './SVGRenderer'
const chance = new Chance()

const App = () => {
  const popCount = 100
  const roomCount = 25
  const people = R.times(createPerson, popCount)
  chance.pickone(people).infected = true
  const roomPops = R.splitEvery(popCount / roomCount, people)
  const rooms = R.map(roomPop => {
    const bigness = chance.integer({ min: 100, max: 400 })
    return new Room(roomPop, { height: bigness, width: bigness })
  }, roomPops)

  useInterval(() => {
    const r1 = chance.pickone(rooms)
    const r2 = chance.pickone(rooms)

    if (R.isEmpty(r1.getPeople())) return;

    const person = chance.pickone(r1.getPeople())
    r1.removePerson(person.id)
    r2.addPerson(person)
  }, 100)

  useInterval(() => {
    rooms.forEach(r => r.introduceEntropy())
  }, 100)

  return (
    <div className="World">
      {rooms.map((room, i) => <SVGRenderer key={i} {...room} />)}
    </div>
  )
}

export default App

