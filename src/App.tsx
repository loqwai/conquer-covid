import * as R from 'ramda';
import React from 'react';
import './App.css';
import Infektor, { Person } from './infektor';

const targetFps = 10
const frameDelay = 1000 / targetFps;

const initialPopulation: Person[] = []

const zoom = 2

for (let i = 0; i < 1000; i++) {
  initialPopulation.push({
    x: Math.random() * 100 / zoom,
    y: Math.random() * 100 / zoom,
    infected: Math.random() < 0.02
  })
}

const pushDateAndLimit = (frames: number[]) => {
  const newFrames = R.prepend(Date.now(), frames);
  return R.slice(0, 5, newFrames)
}

const framerate = (frames: number[]) => {
  if (R.isEmpty(frames)) return 0;

  let totalDistance = 0
  for (let i = 0; i < frames.length - 2; i++) {
    totalDistance += frames[i] - frames[i + 1]
  }
  return Math.round(1000 / (totalDistance / frames.length))
}

function App() {
  const [frames, setFrames] = React.useState<number[]>([]);
  const [population, setPopulation] = React.useState(initialPopulation)

  React.useEffect(() => {
    const infektor = new Infektor({ population: initialPopulation, zoom })
    let stop = false

    const animate = () => {
      infektor.step();
      setPopulation(infektor.getPopulation())
      if (stop) return;
      setFrames(f => pushDateAndLimit(f))
      setTimeout(animate, frameDelay)
    }
    animate()

    return () => { stop = true }
  }, [])

  return (
    <div className="App">
      <p className="framerate">{framerate(frames)}</p>
      <svg viewBox={`0 0 ${100 / zoom} ${100 / zoom}`}>
        {population.map(({ x, y, infected }, i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            fill={infected ? 'red' : 'green'}
            r="0.5" />
        ))}
      </svg>
    </div>
  );
}

export default App;
