import { Backdrop, Card, CircularProgress, Grid, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Footer from '../../components/Footer';
import Navigation from '../../components/Navigation';
import "./style.css"
import { auth, getCollectionRef, getDocRefWithId } from "../../firebase";
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import { getDoc, onSnapshot } from 'firebase/firestore';
import Collections from '../../utils/Collections';
import toast, { Toaster } from "react-hot-toast"
import { Chart } from "react-google-charts";
import Reservation from '../../models/Reservation';


import { useTranslation } from 'react-i18next';

function Dashboard() {

  const [isLoadingIfLogged, setIsLoadingIfLogged] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const [user, loading, error] = useAuthState(auth);
  let [reservations, setReservations] = useState<Reservation[]>([]);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const theme = useTheme();
const matches = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (loading) {
      setIsLoadingIfLogged(true)
      return;
    }
    if (!user) navigate("/login");
    else setIsLoadingIfLogged(false);
  }, [user, loading]);

  useEffect(() => {
    const unsubscribe = onSnapshot(getCollectionRef(Collections.reservations), (querySnapshot) => {
      const tempReservations: Reservation[] = []
      querySnapshot.forEach((doc) => {
        let tempReservation: Reservation = Reservation.fromJson(doc.data())
        tempReservations.push(tempReservation)
      });
      reservations = tempReservations
      setReservations(reservations)
      setIsLoading(false)
    });
    return () => unsubscribe();
  }, []);

  function generateDataForReservationsByState() {
    type ReservationsByState = {
      [key: string]: number;
    }

    const reservationsByState: ReservationsByState = {
      BOOKED: 0,
      CANCELED: 0,
      DONE: 0,
      POSTPONED: 0,
    };

    reservations.forEach((reservation: Reservation) => {
      reservationsByState[reservation.state]++;
    });

    return [
      ["Reservation State", "Number of Reservations"],
      [t('getBookedReservationState'), reservationsByState.BOOKED],
      [t('getCanceledReservationState'), reservationsByState.CANCELED],
      [t('getDoneReservationState'), reservationsByState.DONE],
      [t('getPostponedReservationState'), reservationsByState.POSTPONED],
    ];
  }

  function generateDataForReservationsByService() {
    type ServicesByName = {
      [key: string]: number;
    }

    const servicesByName: ServicesByName = {};

    reservations.forEach((reservation: Reservation) => {
      const serviceName = reservation.service?.name ?? 'No service';
      if (!servicesByName[serviceName]) {
        servicesByName[serviceName] = 1;
      } else {
        servicesByName[serviceName]++;
      }
    });
    const servicesList = Object.entries(servicesByName);
    servicesList.sort((a, b) => b[1] - a[1]);
    const serviceCounts = servicesList.map(([name, count]) => [name.toString(), count]);

    return [["Reservation Service", "Number of Reservations for that service"], ...serviceCounts]

  }

  function getNumberOfReservationsInMonth(month: number) {
    return reservations.filter((reservation) => {
      return reservation.start.getMonth() === month;
    }).length;
  }

  function generateDataForNumberOfReservationsByMonth() {
    return [
      [t('getCalendar.MonthLabel'), t('getReservationTitlePlural')],
      [t('getCalendar.MonthNames.january'), getNumberOfReservationsInMonth(0)],
      [t('getCalendar.MonthNames.february'), getNumberOfReservationsInMonth(1)],
      [t('getCalendar.MonthNames.march'), getNumberOfReservationsInMonth(2)],
      [t('getCalendar.MonthNames.april'), getNumberOfReservationsInMonth(3)],
      [t('getCalendar.MonthNames.may'), getNumberOfReservationsInMonth(4)],
      [t('getCalendar.MonthNames.june'), getNumberOfReservationsInMonth(5)],
      [t('getCalendar.MonthNames.july'), getNumberOfReservationsInMonth(6)],
      [t('getCalendar.MonthNames.august'), getNumberOfReservationsInMonth(7)],
      [t('getCalendar.MonthNames.september'), getNumberOfReservationsInMonth(8)],
      [t('getCalendar.MonthNames.october'), getNumberOfReservationsInMonth(9)],
      [t('getCalendar.MonthNames.november'), getNumberOfReservationsInMonth(10)],
      [t('getCalendar.MonthNames.december'), getNumberOfReservationsInMonth(11)],
    ];
  }

  


  return isLoadingIfLogged ?
    <Loading /> :
    (
      <>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10000 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Navigation />
        <Card variant="outlined" style={{ minHeight: "85vh", margin: "10px" }}>

          <Grid container spacing={2}>
          {matches ? (
      // single-column layout on smaller screens
      <>
        <Grid item xs={12}>
          <Card variant="outlined" style={{ margin: "10px", padding: "20px" }}>
            <Chart
              chartType="PieChart"
              width="100%"
              height="50vh"
              data={generateDataForReservationsByState()}
              options={{
                title: t("getReservationsByStateTitle") || "",
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined" style={{ margin: "10px", padding: "20px" }}>
            <Chart
              chartType="PieChart"
              width="100%"
              height="50vh"
              data={generateDataForReservationsByService()}
              options={{
                title: t('getReservationsByServiceTitle') || ""
              }}
            />
          </Card>
        </Grid>
      </>
    ) : (
      // two-column layout on larger screens
      <>
        <Grid item xs={6}>
          <Card variant="outlined" style={{ margin: "10px", padding: "20px" }}>
            <Chart
              chartType="PieChart"
              width="100%"
              height="30vh"
              data={generateDataForReservationsByState()}
              options={{
                title: t("getReservationsByStateTitle") || "",
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" style={{ margin: "10px", padding: "20px" }}>
            <Chart
              chartType="PieChart"
              width="100%"
              height="30vh"
              data={generateDataForReservationsByService()}
              options={{
                title: t('getReservationsByServiceTitle') || ""
              }}
            />
          </Card>
        </Grid>
      </>
    )}
          </Grid>

          <Card variant="outlined" style={{ margin: "10px", padding: "20px" }}>

            <Chart
              chartType="LineChart"
              width="100%"
              height="40vh"
              data={generateDataForNumberOfReservationsByMonth()}
              options={{
                title: t('getNumberReservationsPerMonthTitle') || "",
                hAxis: {
                  title: t('getCalendar.MonthLabel') || "",
                },
                vAxis: {
                  title: t('getNumberReservationsLabel') || "",
                  minValue: 0,
                },
              }}
            />

          </Card>
        </Card>
        <Footer />
        <Toaster />
      </>
    );
}

export default Dashboard;
