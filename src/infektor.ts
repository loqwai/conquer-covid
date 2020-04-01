export interface Person {
  x: number;
  y: number;
  infected: boolean;
}

interface State {
  population: Person[];
  zoom: number;
}


const distance = (p1: Person, p2: Person) => {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) +
    Math.pow(p1.y - p2.y, 2)
  )
}

const newCoord = (previous: number, zoom: number) => {
  const n = previous + ((Math.random() - 0.5) * 0.3)
  if (n < 0) return 0;
  if (n > 100 / zoom) return 100 / zoom;
  return n
}

export default class Infektor {
  state: State

  constructor(state: State) {
    this.state = {...state}
  }

  getPopulation() {
    return this.state.population
  }

  step(): void {
    this.infect();
    this.mingle();
  }

  infect(): void {
    let population = [...this.state.population]
    this.state.population.forEach(p1 => {
      if(!p1.infected) return
      population.forEach(p2 => {
        if(distance(p1, p2) <= 1){
          p2.infected = true
        }
      })
    })
    this.state = {...this.state, population}
  } 

  mingle() {
    this.state.population.forEach(p => {
      p.x = newCoord(p.x, this.state.zoom)
      p.y = newCoord(p.y, this.state.zoom)
    })
  }
}