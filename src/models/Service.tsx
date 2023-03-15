export default class Service {

    constructor(public id: string | null, public name: string, public description: string, public price: number, public duration: number) {

    }

    public static fromJson(json: any) {
        return new Service(json.id, json.name, json.description, json.price, json.duration)
    }

    getId(): string | null {
        return this.id
    }

}