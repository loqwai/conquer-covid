export default class Infektor {
  state: any

  constructor(state:any) {
    this.state = state
  }

  step(_: number): any {
    let population = [
      {infected: false},
      {infected: false},
    ] 
    this.state.population.forEach(p => {
      console.log(p)
      if(p.infected) {
        population = [
          {infected: true},
          {infected: true},
        ]
        return
      }        
    })
    return {population} 
  } 
}