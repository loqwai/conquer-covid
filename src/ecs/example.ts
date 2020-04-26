
import { World, System, Component, SystemStateComponent, Not } from 'ecsy'

class Game {
    world: World
    constructor() {
        this.world = new World()
    }
    run() {
        this.init()
        this.addEntity()
        this.world.execute(0, 0)
        setInterval(() => {
            this.world.execute(0, 0)
        }, 1000)
    }
    addEntity() {
        const entity = this.world.createEntity()
        entity.addComponent(Person, { age: 5 })
        setInterval(() => {
            console.log("removing component")
            entity.removeComponent(SomeOtherComponent)


        }, 5000)
        setInterval(() => {
            console.log("removing both")
            entity.removeComponent(Person)


        }, 11000)
        // entity.addComponent(SpriteResources)

    }
    init() {
        console.log("we r runnin")

        this.world.registerComponent(Person)
        this.world.registerComponent(SomeOtherComponent)
        this.world.registerSystem(MainSystem)
    }
}

class SomeOtherComponent extends SystemStateComponent {
    age: number
    constructor() {
        super();
        this.age = 0
        this.reset();
    }

    reset() {
        this.age = 0
    }
}

class Person {
    name: string = "Aaron"
    constructor() {
        this.reset();
    }

    reset() {
        this.name = 'empty';
    }
}

// Systems
class MainSystem extends System {
    execute() {
        this.queries.added.results.forEach(entity => {
            console.log("added 2nd component")
            entity.addComponent(SomeOtherComponent);
        });

        this.queries.removed.results.forEach(entity => {
            var resources = entity.getComponent(SomeOtherComponent);
            console.log("removed", resources)
        });

        this.queries.normal.results.forEach(entity => {
            const data = entity.getMutableComponent(SomeOtherComponent)
            console.log("normal", data)
            data.age++

        });

    }
}

MainSystem.queries = {
    added: { components: [Person, Not(SomeOtherComponent)] },
    removed: { components: [Not(Person), SomeOtherComponent] },
    normal: { components: [Person, SomeOtherComponent] }
};


export default Game