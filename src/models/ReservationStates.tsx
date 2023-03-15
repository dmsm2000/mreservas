type ReservationStatesType = {
    [key: string]: { value: string; color: string, text: string };
};

const ReservationStates: ReservationStatesType = {
    canceled: { value: "CANCELED", color: "red", text: 'getCanceledReservationState'},
    booked: { value: "BOOKED", color: "", text: 'getBookedReservationState' },
    done: { value: "DONE", color: "green", text: 'getDoneReservationState' },
    postponed: { value: "POSTPONED", color: "orange", text: 'getPostponedReservationState' },
};

export default ReservationStates