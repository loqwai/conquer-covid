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
    describe("when nobody is infected", () => {
        beforeEach(() => {
            infector = new Infector({
                population: [
                    { infected: false },
                    { infected: false },
                ]
            });
        })
        describe("when we wait 100 hours", () => {
            beforeEach(() => {
                state = infector.step(100)
            })
            test("person 2 should be infected", () => {
                expect(state.population).toEqual([
                    { infected: false },
                    { infected: false },
                ])
            })
        })
    })
})

describe("When there are 1000 rooms of 2 people, one infected in each", () => {
    beforeEach(()=>{
        let populations: any[] = new Array(1000)  
        for(i = 0; i < 1000; i++){
            const i = new Infector()
        }
    })    
})