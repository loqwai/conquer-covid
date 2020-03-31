import React from 'react';
import './App.css';
import Infektor, { Person } from './infektor';

const frameDelay = 100;

const initialPopulation: Person[] =  []

for (let i = 0; i < 10000; i++) {
  initialPopulation.push({
    x: Math.random() * 100,
    y: Math.random() * 100,
    infected: Math.random() < 0.02
  })
}

function App() {
  const [population, setPopulation] = React.useState(initialPopulation)

  React.useEffect(() => {
    const infektor = new Infektor({ population: initialPopulation })

    const intervalId = setInterval(() => {
      infektor.step();
      setPopulation(infektor.getPopulation())
    }, frameDelay)

    return () => clearInterval(intervalId) 
  }, [])

  return (
    <div className="App">
      <svg viewBox="0 0 100 100">
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
