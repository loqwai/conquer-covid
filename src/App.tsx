import React from 'react';
import './App.css';
import Infektor, { Person } from './infektor';

const frameDelay = 1000;

const initialPopulation: Person[] =  []

const zoom = 3

for (let i = 0; i < 1000; i++) {
  initialPopulation.push({
    x: Math.random() * 100 / zoom,
    y: Math.random() * 100 / zoom,
    infected: Math.random() < 0.02
  })
}

function App() {
  const [population, setPopulation] = React.useState(initialPopulation)

  React.useEffect(() => {
    const infektor = new Infektor({ population: initialPopulation })

    const animate = () => {
      infektor.step();
      setPopulation(infektor.getPopulation())
      timeout = setTimeout(animate, frameDelay)
    }

    let timeout = setTimeout(animate, frameDelay);

    return () => clearTimeout(timeout) 
  }, [])

  return (
    <div className="App">
      <svg viewBox={`0 0 ${100 / zoom} ${100 / zoom}`}>
        {population.map(({x, y, infected}, i) => (
          <circle 
            key={i} 
            cx={x} 
            cy={y} 
            fill={infected ? 'red' : 'green' } 
            r="0.5"/>
        ))}
      </svg>
      <pre>{JSON.stringify(population, null, 2)}</pre>
    </div>
  );
}

export default App;
