import * as R from 'ramda'
import Room from './room'
test('Can we make a room?', ()=>{
  const r = new Room(0, {height:100, width:200})
  expect(r).toBeTruthy()
})


test('start() should generate an id', () => {
  const r = new Room(10, { height: 100, width: 200 })
  expect(r.people).toHaveLength(10)
})
