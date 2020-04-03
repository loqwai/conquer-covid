import React from 'react';
import './App.css';
import { Person } from './infektor';
import { Engine, Render, World, Bodies, Body } from "matter-js";

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

    const circles = initialPopulation.map(({ x, y }) => Bodies.circle(x, y, 5))
    circles.forEach(c => {
      Body.applyForce(c, { x: 1, y: 0 }, { x: 100, y: 0 })
    })

    World.add(engine.world, circles);
    engine.world.gravity.y = 0;

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
