import Infector from './infektor'

describe("When two people are trapped in a room", () => {
    var infector:Infector
    var state:any
    describe("when one person is infected", ()=>{
        beforeEach(() => {
            infector = new Infector({
                population: [
                    { infected: true },
                    { infected: false },
                ]
            });
        })
        describe("when we wait 100 hours", ()=>{
            beforeEach(()=>{
                state = infector.step(100)
            })
            test("person 2 should become infected", () => {
                expect(state.population).toEqual([
                    { infected: true },
                    { infected: true },
                ])
            })
        })                
    })
})
