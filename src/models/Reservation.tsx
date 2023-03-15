import ReservationStates from "./ReservationStates";
import Service from "./Service";

export default class Reservation {

    public title: String
    public color: String

    constructor(private id: string | null,
        public name: string,
        public start: Date,
        public end: Date,
        public state: string = ReservationStates.booked.value,
        public phone: string,
        public email: string,
        public observations: string,
        public service: Service | undefined) {
        this.title = name
        this.color = Reservation.getColor(state)
    }

    static getColor(state: string): string {
        switch (state) {
            case ReservationStates.booked.value:
                return ReservationStates.booked.color
            case ReservationStates.canceled.value:
                return ReservationStates.canceled.color
            case ReservationStates.done.value:
                return ReservationStates.done.color
            case ReservationStates.postponed.value:
                return ReservationStates.postponed.color
            default:
                return "gray"
        }
    }

    static fromJson(json: any): Reservation {
        let service = Service.fromJson(json.service)
        return new Reservation(json.id, json.name, new Date(json.start), new Date(json.end), json.state, json.phone, json.email, json.observations, service);
    }

    getId(): string | null {
        return this.id
    }
}
