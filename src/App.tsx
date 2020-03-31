import React from 'react';
import './App.css';
import Infektor from './infektor';

const frameDelay = 100;

const initialPopulation =  [{
  x: 0,
  y: 0,
  infected: false
}, {
  x: 1,
  y: 1,
  infected: true
}]

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
      <pre>{JSON.stringify(population, null, 2)}</pre>
      <svg>
        {population.map(({x, y, infected}) => (

        <circle x={x} y={y} fill={infected ? 'red' : 'green' }/>
        ))}
      </svg>
    </div>
  );
}

export default App;
