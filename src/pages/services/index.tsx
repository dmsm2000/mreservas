import { Backdrop, Button, Card, CircularProgress, Divider, Fab, Grid, List, ListItem, ListItemText, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Navigation from '../../components/Navigation';
import "./style.css"
import { auth, deleteDocumentWithId, getCollectionRef } from "../../firebase";
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loading from '../../components/Loading';
import Service from '../../models/Service';
import { Add, Functions, Title } from '@mui/icons-material';
import ServiceDialog from './serviceDialog';
import toast, { Toaster } from 'react-hot-toast';
import Collections from '../../utils/Collections';
import { onSnapshot } from 'firebase/firestore';
import Reservation from '../../models/Reservation';
import reservations from '../reservations';


import { useTranslation } from 'react-i18next';

function Services() {

  const [isLoadingIfLogged, setIsLoadingIfLogged] = useState(true)

  const [isLoading, setIsLoading] = useState(false)

  const [user, loading, error] = useAuthState(auth);

  let [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showServiceDialog, setShowServiceDialog] = useState(false)

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (loading) {
      setIsLoadingIfLogged(true)
      return;
    }
    if (!user) navigate("/login");
    else setIsLoadingIfLogged(false);
  }, [user, loading]);

  useEffect(() => {
    const unsubscribe = onSnapshot(getCollectionRef(Collections.services), (querySnapshot) => {
      const tempServices: Service[] = []
      querySnapshot.forEach((doc) => {
        let tempService: Service = Service.fromJson(doc.data())
        tempServices.push(tempService)
      });
      services = tempServices
      setServices(services)
      setIsLoading(false)
    });
    return () => unsubscribe();
  }, []);

  const handleSelectService = (selectedService: Service) => {
    setSelectedService(selectedService);
    setShowServiceDialog(true)
  };

  const handleAddService = () => {
    setSelectedService(null)
    setShowServiceDialog(true)
  }

  const handleDelete = () => {
    setIsLoading(true)
    deleteDocumentWithId(Collections.services, selectedService!.getId()!).then(() => {
      setIsLoading(false)
    }).catch((error) => {
      setIsLoading(false)
    })
  }

  const serviceDialog = () => {
    return (<ServiceDialog handleClose={(wasSuccess: any, message: string) => {
      setShowServiceDialog(false)
      if (wasSuccess == true) {
        toast.success(message)
      } else if (wasSuccess == false) {
        toast.error(message)
      }
    }} handleDelete={handleDelete} service={selectedService} handleAddService={() => { }} />)
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
        <Card variant="outlined" style={{ height: "85vh", margin: "10px" }}>
          <h2 style={{ width: "100%", textAlign: "center" }}>{t('getServicesTitle')}</h2>
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
            <Fab style={{ margin: "10px" }} color="primary" aria-label="add" onClick={handleAddService}>
              <Add />
            </Fab>
          </div>
          <Card variant="outlined" style={{ margin: "10px", textAlign: "center" }}>
            <List component="nav">
              {services.map((service, index) => (
                <React.Fragment key={service.id}>
                  <ListItem style={{ cursor: "pointer" }} onClick={() => handleSelectService(service)}>
                    <ListItemText primary={service.name} secondary={service.description} />
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ListItemText primary={`${service.duration} min`} />
                      <Divider orientation="vertical" style={{ margin: "0 0.5rem" }} />
                      <ListItemText primary={`${service.price} €`} />
                    </div>
                  </ListItem>
                  {index < services.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>


          </Card>
        </Card>

        {showServiceDialog && serviceDialog()}
        <Toaster />
        <Footer />
      </>
    );
}

export default Services;