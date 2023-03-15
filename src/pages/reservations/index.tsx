import { Alert, Backdrop, Box, Button, Card, CircularProgress, Collapse, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Navigation from '../../components/Navigation';
import { auth, deleteDocumentWithId, getCollectionRef, updateDocument } from "../../firebase";
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import "./style.css"

import Reservation from '../../models/Reservation';
import ReservationStates from '../../models/ReservationStates';
import Dialog from '@mui/material/Dialog';
import Loading from '../../components/Loading';
import { doc, onSnapshot } from 'firebase/firestore';
import Collections from '../../utils/Collections';
import MyCalendar from './calendar';

function Reservations() {

  const [isLoadingIfLogged, setIsLoadingIfLogged] = useState(true)

  const [user, loading, userError] = useAuthState(auth);

  const [showDialogConfirmDelete,
    setShowDialogConfirmDelete] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      setIsLoadingIfLogged(true)
      return;
    }
    if (!user) navigate("/login");
    else setIsLoadingIfLogged(false);
  }, [user, loading]);

  function handleClose() {
    setShowDialogConfirmDelete(false)
  }

  return isLoadingIfLogged ?
    <Loading /> :
    (
      <>
        <Navigation />
        <Card variant="outlined" style={{ minHeight: "85vh", margin: "10px" }}>
          <div style={{ padding: "25px" }}>
            <MyCalendar />
          </div>
        </Card>

        <Footer />
      </>
    );
}

export default Reservations;