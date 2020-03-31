
test("If two people are trapped in a room for 100 hours, and one's infected, the both become infected", () => {
    const Infektor = require('./infektor');
    const world = new Infector({
        population: [
            {infected: true},
            {infected: false},
        ]
    });
    world.step(100)
    expect(world.population).toEqual([
        {infected: true},
        {infected: true},
    ])
});
