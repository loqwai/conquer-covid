import React from 'react';
import './App.css';
import * as Particulate from 'particulate'

const PARTICLES_COUNT = 5;
const relaxIterations = 2;

const system = Particulate.ParticleSystem.create(PARTICLES_COUNT, relaxIterations);
var gravity = Particulate.DirectionalForce.create();

system.addForce(gravity);
system.each((i: number) => {
  if (i > 0 && i < PARTICLES_COUNT - 1) {
    system.setPosition(i,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20)
  }
})


function App() {
  const [positions, setPositions] = React.useState(system.positions)

  React.useEffect(() => {
    const interval = setInterval(() => {
      system.tick(1);
      setPositions(system.positions)
    }, 1)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="App">
      <pre>{JSON.stringify(positions, null, 2)}</pre>
    </div>
  );
}

export default App;
