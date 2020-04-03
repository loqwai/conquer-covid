import React from 'react';
import './App.css';
import { Person } from './infektor';
import { Engine, Render, World, Bodies, Body } from "matter-js";
import Matter from "matter-js"

const initialPopulation: Person[] = []

const zoom = 1

for (let i = 0; i < 100; i++) {
  initialPopulation.push({
    x: Math.random() * 800 / zoom,
    y: Math.random() * 600 / zoom,
    infected: Math.random() < 0.02
  })
}

function App() {

  const element = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (element.current === null) return;

    const engine = Engine.create()
    const render = Render.create({
      engine,
      element: element.current,
    })

    const circles = initialPopulation.map(({ x, y }) =>
      Bodies.circle(x, y, 10, {
        inertia: 0,
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        restitution: 1,
      }))

    circles.forEach(c => Body.setVelocity(c, { x: (Matter as any).Common.random(-10, 10), y: (Matter as any).Common.random(-10, 10) }))


    engine.world.gravity.y = 0;
    World.add(engine.world, circles);

    // walls
    World.add(engine.world, [
      Bodies.rectangle(400, 0, 800, 10, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 10, { isStatic: true }),
      Bodies.rectangle(800, 300, 10, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 10, 600, { isStatic: true })
    ]);

    Engine.run(engine);
    Render.run(render);
  }, [])

  return (
    <div className="App">
      <div ref={element} />
    </div>
  );
}

export default App;
