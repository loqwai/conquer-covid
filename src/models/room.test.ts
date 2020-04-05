import Room from './room'
test('Can we make a room?', ()=>{
  const r = new Room([], {height:100, width:200})
  expect(r).toBeTruthy()
})


test('start() should generate an id', () => {
  const pop = [
    {infected: false}
  ]
  const r = new Room(pop, { height: 100, width: 200 })

  r.start()  
  expect(r.population[0].id).toBeDefined()
})
