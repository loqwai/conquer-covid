import Infector from './infektor'
test("If two people are trapped in a room for 100 hours, and one's infected, they both become infected", () => {
    const Infektor = require('./infektor');
    const infector = new Infector({
        population: [
            {infected: true},
            {infected: false},
        ]
    });
    const state = infector.step(100)
    expect(state.population).toEqual([
        {infected: true},
        {infected: true},
    ])
});
