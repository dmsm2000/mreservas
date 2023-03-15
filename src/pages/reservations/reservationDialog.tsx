import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Backdrop, CircularProgress, Grid, DialogContentText, InputLabel, MenuItem, Select, FormControl } from "@mui/material"
import { addDocumentWithId, getCollectionRef, updateDocument } from "../../firebase"
import Reservation from "../../models/Reservation"
import Collections from "../../utils/Collections"
import "./style.css"
import Functions from "../../utils/Functions"
import ReservationStates from "../../models/ReservationStates"
import { useEffect, useState } from "react"
import Service from "../../models/Service"

import { useTranslation } from 'react-i18next';
import { onSnapshot } from "@firebase/firestore"
import reservations from "."

interface ChildProps {
    handleClose: (wasSuccess: Boolean | null, message: string) => void;
    handleDelete: Function
    handleAddReservation: Function
    reservation: Reservation | null
}

export default function ReservationDialog(props: ChildProps) {

    const [isLoading, setIsLoading] = useState(false)

    let [services, setServices] = useState<Service[]>([])

    const [selectedService, setSelectedService] = useState<Service | undefined>(props.reservation != null ? props.reservation.service : undefined)

    const [name, setName] = useState(props.reservation != null ? props.reservation.name : "")
    const [phone, setPhone] = useState(props.reservation != null ? props.reservation.phone : "")
    const [email, setEmail] = useState(props.reservation != null ? props.reservation.email : "")
    const [observations, setObservations] = useState(props.reservation != null ? props.reservation.observations : "")
    const [startDate, setStartDate] = useState<Date>(props.reservation != null ? props.reservation.start : new Date())
    const [endDate, setEndDate] = useState<Date>(props.reservation != null ? props.reservation.end : new Date())
    const [state, setState] = useState(props.reservation != null ? props.reservation.state : "")

    const [showDialogConfirmDelete, setShowDialogConfirmDelete] = useState(false)
    const [reservation, setReservation] = useState<Reservation | null>(null)

    const { t } = useTranslation('translation');

    useEffect(() => {
        setReservation(props.reservation)
    }, [props.reservation]);

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
    }, [])

    useEffect(() => {
        if (selectedService && startDate) {
            const duration = selectedService.duration;
            const endDate = new Date(startDate.getTime() + duration * 60000);
            setEndDate(endDate);
        }
    }, [selectedService, startDate]);

    function createOrUpdateReservation() {

        if (reservation?.getId() == null) {
            const tempReservation = new Reservation((Date.now()).toString(), name, startDate, endDate, ReservationStates.booked.value, phone, email, observations, selectedService!)
            addDocumentWithId(Collections.reservations,
                tempReservation!.getId()!, tempReservation).then(() => {
                    props.handleClose(true, t('getCreateReservationSucessMessage'))
                }).catch((error) => {
                    alert(error)
                    props.handleClose(false, t('getCreateReservationErrorMessage'))
                })
        } else {
            const tempReservation = new Reservation(reservation!.getId(), name, startDate, endDate, state, phone, email, observations, selectedService!)
            updateDocument(Collections.reservations,
                tempReservation!.getId()!, tempReservation).then(() => {
                    props.handleClose(true, t('getUpdatedReservationSucessMessage'))
                }).catch((error) => {
                    alert(error)
                    props.handleClose(false, t('getUpdatedReservationErrorMessage'))
                })
        }
    }

    function disableCreateUpdateButton(): boolean {
        if(reservation?.getId != null) {
            return !(name !== "" && selectedService !== null && startDate !== null && endDate !== null && 
            endDate.getTime() > startDate.getTime())

        } 
        return !(name !== "" && selectedService !== null && startDate !== null && endDate !== null && 
                        startDate.getTime() >= new Date().getTime() && endDate.getTime() > startDate.getTime())
    }

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10000 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Dialog open={true} onClose={() => props.handleClose(null, "")} fullWidth>
                <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>{reservation?.getId() != null ? t('getReservationTitle') : t('getCreateReservation')}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label={t('getReservationNameLabel') + ' *'}
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label={t('getPhoneLabel')}
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={phone}
                                onChange={(e) => { setPhone(e.target.value) }}
                            />

                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label={t('getEmailLabel')}
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label={t('getObservationLabel')}
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={observations}
                                onChange={(e) => { setObservations(e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="service-select-label">{t('getServiceLabel') + ' *'}</InputLabel>
                                <Select
                                    label={t('getServiceLabel') + ' *'}
                                    labelId="service-select-label"
                                    value={selectedService?.getId() || ""}
                                    onChange={(e) => {
                                        const selectedServiceId = e.target.value;
                                        const selectedService = services.find(service => service.id === selectedServiceId);
                                        setSelectedService(selectedService);
                                    }}
                                    fullWidth
                                    variant="outlined"
                                >
                                    {services.map(service => (
                                        <MenuItem key={service.id!} value={service.id!}>{service.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label={t('getReservationStartDateLabel') + ' *'}
                                type="datetime-local"
                                fullWidth
                                variant="outlined"
                                value={Functions.formatDateForInput(startDate)}
                                onChange={(e) => {
                                    const newStartDate = new Date(e.target.value);
                                    setStartDate(newStartDate);
                                    if (selectedService) {
                                        const duration = selectedService.duration;
                                        const newEndDate = new Date(newStartDate.getTime() + duration * 60000);
                                        setEndDate(newEndDate);
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label={t('getReservationEndDateLabel') + ' *'}
                                type="datetime-local"
                                fullWidth
                                variant="outlined"
                                value={Functions.formatDateForInput(endDate)}
                                onChange={(e) => {
                                    const newEndDate = new Date(e.target.value);
                                    setEndDate(newEndDate);
                                }}
                            />
                        </Grid>
                        {reservation != null && <Grid item xs={12}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="service-select-label">Estado</InputLabel>
                                <Select
                                    label={"estado"}
                                    labelId="service-select-label"
                                    value={state || ""}
                                    onChange={(e) => {
                                        setState(e.target.value);
                                    }}
                                    fullWidth
                                    variant="outlined"
                                >
                                    {Object.keys(ReservationStates).map((state) => (
                                        <MenuItem key={ReservationStates[state].value} value={ReservationStates[state].value}>
                                            {t(ReservationStates[state].text)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>}
                    </Grid>
                    <DialogContentText style={{ color: "red", marginTop: "5px", fontSize: "smaller" }}>
                        {t('getMandatoryFieldsText')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        props.handleClose(null, "")
                    }
                    }>{t('getCancelButtonLabel')}</Button>
                    {reservation?.getId() != null && <Button style={{ color: "red" }} onClick={() => {
                        setShowDialogConfirmDelete(true)
                    }}>{t('getDeleteButtonLabel')}</Button>}
                    <Button
                        disabled={disableCreateUpdateButton()}
                        onClick={() => {
                            setIsLoading(true)
                            createOrUpdateReservation()
                        }}>{reservation?.getId() != null ? t('getUpdateButtonLabel') : t('getCreateButtonLabel')}</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={showDialogConfirmDelete}
                keepMounted
                onClose={() => setShowDialogConfirmDelete(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle> {t('getDeletReservationTitle')} </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('getDeleteReservationMessage')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ color: "red" }} onClick={() => setShowDialogConfirmDelete(false)}> {t('getNoButtonLabel')} </Button>
                    <Button onClick={() => {
                        props.handleDelete()!
                        props.handleClose(true, t('getDeletedReservationSuccessMessage'))
                        setShowDialogConfirmDelete(false)
                    }}> {t('getYesButtonLabel')}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}