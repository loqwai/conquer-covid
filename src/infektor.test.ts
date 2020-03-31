import Infector from './infektor'

describe("When two people are not practicing social distancing", () => {
    var infector:Infector
    describe("when one person is infected", ()=>{
        beforeEach(() => {
            infector = new Infector({
                population: [
                    { infected: true, x: 0, y: 0 },
                    { infected: false, x: 0, y: 1 },
                ]
            });
        })
        describe("when an infection event occurs", ()=>{
            beforeEach(()=>{
                infector.step()
            })
            test("person 2 should be infected", () => {
                const pop = infector.getPopulation()
                pop.forEach(p => {
                    expect(p.infected).toBeTruthy()
                });
                expect(pop.length).toEqual(2)
            })
        })                
    })
    describe("when nobody is infected", () => {
        beforeEach(() => {
            infector = new Infector({
                population: [
                    { infected: false, x: 0, y: 0 },
                    { infected: false, x: 0, y: 1 },
                ]
            });
        })
        describe("when an infection event occurs", () => {
            beforeEach(() => {
                infector.step()
            })
            test("person 2 should be infected", () => {
                const pop = infector.getPopulation()
                pop.forEach(p => {
                    expect(p.infected).toBeFalsy()
                });
                expect(pop.length).toEqual(2)
            })
        })
    })
})
describe("When two people are practicing social distancing", () => {
    var infector: Infector
    describe("when one person is infected", () => {
        beforeEach(() => {
            infector = new Infector({
                population: [
                    { infected: true, x: 0, y: 0 },
                    { infected: false, x: 0, y: 2 },
                ]
            });
        })
        describe("when an infection event occurs", () => {
            beforeEach(() => {
                infector.step()
            })
            test("person 2 should not be infected", () => {
                const pop = infector.getPopulation()
                expect(pop).toEqual(
                    expect.arrayContaining([
                        {infected: true, x:0, y:0},
                        {infected: false, x:0, y:2},
                    ])
                )
            })
        })
    })
})