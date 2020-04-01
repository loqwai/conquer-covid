export interface Person {
  x: number;
  y: number;
  infected: boolean;
}

interface State {
  population: Person[];
}


const distance = (p1: Person, p2: Person) => {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) +
    Math.pow(p1.y - p2.y, 2)
  )
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
}