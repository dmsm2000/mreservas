import { Backdrop, Button, CircularProgress } from "@mui/material";
import moment, { Moment } from "moment";

import { useEffect, useState } from "react";
import {
  Calendar,
  CalendarProps,
  EventPropGetter,
  momentLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Reservation from "../../models/Reservation";

import "moment/locale/pt";

import AddIcon from "@mui/icons-material/Add";
import { deleteDocumentWithId, getCollectionRef } from "../../firebase";
import { CollectionReference, onSnapshot } from "firebase/firestore";
import Collections from "../../utils/Collections";
import ReservationDialog from "./reservationDialog";

import toast, { Toaster } from "react-hot-toast";
import { ModeComment, PropaneSharp } from "@mui/icons-material";
import ReservationStates from "../../models/ReservationStates";

import { useTranslation } from "react-i18next";

export default function MyCalendar() {
  const [isLoading, setIsLoading] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState<React.ReactNode>(null);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [showReservationDialog, setShowReservationDialog] = useState(false);

  let [reservations, setReservations] = useState<Reservation[]>([]);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      getCollectionRef(Collections.reservations),
      (querySnapshot) => {
        const tempReservations: Reservation[] = [];
        querySnapshot.forEach((doc) => {
          let tempReservation: Reservation = Reservation.fromJson(doc.data());
          tempReservations.push(tempReservation);
        });
        reservations = tempReservations;
        setReservations(reservations);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleDelete = () => {
    setIsLoading(true);
    deleteDocumentWithId(
      Collections.reservations,
      selectedReservation!.getId()!
    )
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  function handleClose() {
    setShowReservationDialog(false);
    setSelectedReservation(null);
  }

  const addReservation = () => {
    setSelectedReservation(null);
    setShowReservationDialog(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedReservation(
      new Reservation(
        null,
        "",
        slotInfo.start,
        slotInfo.end,
        ReservationStates.booked.value,
        "",
        "",
        "",
        undefined
      )
    );
    setShowReservationDialog(true);
  };

  const handleSelectEvent = (selectedReservation: Reservation) => {
    setSelectedReservation(selectedReservation);
    setShowReservationDialog(true);
  };

  const reservationDialog = () => {
    return (
      <ReservationDialog
        handleClose={(wasSuccess: any, message: string) => {
          setShowReservationDialog(false);
          if (wasSuccess === true) {
            toast.success(message);
          } else if (wasSuccess === false) {
            toast.error(message);
          }
        }}
        handleDelete={handleDelete}
        reservation={selectedReservation}
        handleAddReservation={() => {}}
      />
    );
  };

  const calendarProps: CalendarProps<any, any> = {
    popup: true,
    selectable: true,
    events: reservations,
    defaultView: "month",
    scrollToTime: new Date(0, 0, 0, 6),
    defaultDate: new Date(),
    onSelectEvent: (selectedReservation: Reservation) => {
      handleSelectEvent(selectedReservation);
    },
    onSelectSlot: (slotInfo: { start: any; end: any }) =>
      handleSelectSlot(slotInfo),
    localizer: momentLocalizer(moment),
  };

  // TODO: TRADUZIR
  const messages = {
    today: t("getCalendar.TodayLabel"),
    previous: t("getCalendar.getPreviousButonLabel"),
    next: t("getCalendar.getNextButonLabel"),
    month: t("getCalendar.MonthLabel"),
    week: t("getCalendar.WeekLabel"),
    day: t("getCalendar.DayLabel"),
    // agenda: t('agendaButonCalendar'),
    noEventsInRange: t("getCalendar.getNoEventsInRangeMessage"),
    showMore: (count: number) =>
      t("getCalendar.getShowMoreButonLabel", { count }),
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 10000 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          style={{ marginBottom: "20px" }}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addReservation}
        >
          {" "}
          {t("getCreateEvent")}{" "}
        </Button>
      </div>
      <Calendar
        messages={messages}
        style={{ height: "80vh" }}
        {...calendarProps}
        eventPropGetter={(reservation) => {
          return { style: { backgroundColor: reservation.color } };
        }}
      >
        {selectedSlot}
      </Calendar>
      {showReservationDialog && reservationDialog()}
      <Toaster />
    </>
  );
}
