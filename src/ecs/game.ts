
import { World, System, Component, Entity, Not, TagComponent } from 'ecsy'
import { Chance } from 'chance'
import {Person, Point,createPerson } from '../models/room'
const chance = new Chance()
class Game {
    world: World
    people: Map<string, Entity>
    constructor() {
        this.world = new World()
        this.people = new Map<string, any>()
    }
    step(delta: number) {
        this.world.execute(delta, performance.now())
    }
    addPerson() {
        const identity = createPerson()
        const entity = this.world.createEntity()
        entity.addComponent(PersonComponent, identity)
        this.people.set(identity.id, entity)
        return identity.id
    }
    getPeople() {
        const ret: Array<Person> = []
        return this.people.forEach(p =>{
            ret.push(p.getComponent(PersonComponent))
        })
    }
    run() {
        console.log("we r runnin")
        this.world.registerComponent(PersonComponent)
        this.world.registerSystem(MainSystem)
    }
}
class PersonComponent extends Component {
    id: string = ""
    name: string = ""
    age: number = 0
    infected: boolean = false
    position: Point = {x:0,y:0}
}

// Systems
class MainSystem extends System {
    execute() {
        this.queries.normal.results.forEach(entity => {
            const data = entity.getMutableComponent(PersonComponent)
            data.age++
        })
    }
}

MainSystem.queries = {
    normal: { components: [PersonComponent] }
}


export default Game