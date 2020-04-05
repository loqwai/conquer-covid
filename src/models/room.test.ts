import * as R from 'ramda'
import Room from './room'
test('Can we make a room?', ()=>{
  const r = new Room(0, {height:100, width:200})
  expect(r).toBeTruthy()
})


test('Creating a room should create people', () => {
  const r = new Room(10, { height: 100, width: 200 })
  expect(r.people).toHaveLength(10)
  const person = r.people[0]
  expect(person.name).toBeTruthy()
})

// test('Starting the room should cause them to move')
