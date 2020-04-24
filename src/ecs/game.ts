
import { World, System, SystemStateComponent, Not, TagComponent } from 'ecsy'
import { Chance } from 'chance'
import { createPerson } from '../models/room'
const chance = new Chance()
class Game {
    world: World
    constructor() {
        this.world = new World()
    }
    step(delta: number) {
        this.world.execute(delta, performance.now())
    }
    run() {
        this.init()
    }
    addPerson() {
        const entity = this.world.createEntity()
        entity.addComponent(Person)

    }
    init() {
        console.log("we r runnin")

        this.world.registerComponent(Person)
        this.world.registerComponent(Identity)
        this.world.registerSystem(MainSystem)
    }
}

class Person extends TagComponent { }
class Identity extends SystemStateComponent {
    name: string = ""
    age: number = 0
}

// Systems
class MainSystem extends System {
    execute() {
        this.queries.added.results.forEach(entity => {
            const identity = createPerson()
            console.log("new person:", identity)
            entity.addComponent(Identity, identity);
        })

        this.queries.normal.results.forEach(entity => {
            const data = entity.getMutableComponent(Identity)
            console.log("person:", data)
            data.age++

        })
    }
}

MainSystem.queries = {
    added: { components: [Person, Not(Identity)] },
    normal: { components: [Person, Identity] }
};


export default Game