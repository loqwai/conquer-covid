interface Person {
  x: number;
  y: number;
  infected: boolean;
}

interface State {
  population: Person[];
}

export default class Infektor {
  state: State

  constructor(state: State) {
    this.state = {...state}
  }

  getPopulation() {
    return [...this.state.population]
  }

  step(): any {
    let population = [
      {infected: false, x:0, y:0},
      {infected: false, x:0, y:1},
    ] 
    this.state.population.forEach(p => {

      if(p.infected) {
        population = [
          {infected: true, x: 0, y: 0},
          {infected: true, x: 0, y: 1},
        ]
        return
      }        
    })
    this.state = {...this.state, population}
  } 
}