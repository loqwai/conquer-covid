export default class Infektor {
    step(_: any): any {
        return {
            population: [
                {infected: true},
                {infected: true},
            ]
        }
    }
}