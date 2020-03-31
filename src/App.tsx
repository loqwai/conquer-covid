import React from 'react';
import './App.css';
import * as Particulate from 'particulate'

const PARTICLES_COUNT = 5;
const relaxIterations = 2;

const system = Particulate.ParticleSystem.create(PARTICLES_COUNT, relaxIterations);
(window as any).system = system;

var gravity = Particulate.DirectionalForce.create([0, -0.001, 0]);

system.addForce(gravity);
system.each((i: number) => {
  if (i > 0 && i < PARTICLES_COUNT - 1) {
    system.setPosition(i,
      Math.random() * 10,
      Math.random() * 10,
      Math.random() * 10)
  }
})


function App() {
  const [positions, setPositions] = React.useState(system.positions)

  React.useEffect(() => {
    let stop = false;
    const animate = () => {
      console.log('animate')
      system.tick(1);
      setPositions(system.positions)
      if (stop) return
      window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
    return () => { stop = true }
  }, [])

  return (
    <div className="App">
      <pre>{JSON.stringify(positions, null, 2)}</pre>
    </div>
  );
}

export default App;
