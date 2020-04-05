import Room from './room'
test('Can we make a room?', ()=>{
  const r = new Room(0, {height:100, width:200})
  expect(r).toBeTruthy()
})


test('start() should generate an id', () => {
  const pop = [
    {infected: false}
  ]
  const r = new Room(10, { height: 100, width: 200 })

  r.start()  
  expect(r.people[0].id).toBeDefined()
})
