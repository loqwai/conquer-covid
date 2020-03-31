import React from 'react';
import './App.css';
import * as Particulate from 'particulate'

const particleCount = 5;
const relaxIterations = 2;

const system = Particulate.ParticleSystem.create(particleCount, relaxIterations);
var dist = Particulate.DistanceConstraint.create(10, [0, 1, 1, 2, 2, 3, 3, 4]);
var pin = Particulate.PointConstraint.create([0, 0, 0], 0);
var gravity = Particulate.DirectionalForce.create([0, -0.05, 0]);

system.addConstraint(dist);
system.addPinConstraint(pin);
system.addForce(gravity);

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
      <header className="App-header">
        <h1>Conquer Covid</h1>
      </header>
      <pre>{JSON.stringify(positions, null, 2)}</pre>
    </div>
  );
}

export default App;
