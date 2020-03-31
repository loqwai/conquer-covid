export default class Infektor {
  step(_: number): any {
    return {
      population: [
        { infected: true },
        { infected: true },
      ]
    }
  }
}