import { Functions } from "@mui/icons-material"
import { Dialog, DialogTitle, DialogContent, Grid, TextField, DialogActions, Button, Backdrop, CircularProgress, DialogContentText } from "@mui/material"
import { useEffect, useState } from "react"
import { addDocumentWithId, updateDocument } from "../../firebase";
import Service from "../../models/Service";
import Collections from "../../utils/Collections";

import { useTranslation } from 'react-i18next';

interface ChildProps {
    handleClose: (wasSuccess: Boolean | null, message: string) => void;
    handleDelete: Function
    handleAddService: Function
    service: Service | null
}

export default function ServiceDialog(props: ChildProps) {

    const [isLoading, setIsLoading] = useState(false)


    // public id: string, public name: string, public description: string, public price: number, public duration: number
    const [nameOfService, setNameOfService] = useState(props.service?.getId() != null ? props.service.name : "")
    const [descriptionOfService, setDescriptionOfService] = useState(props.service?.getId() != null ? props.service.description : "")
    const [priceOfService, setPriceOfService] = useState(props.service?.getId() != null ? props.service.price : 0)
    const [durationOfService, setDurationOfService] = useState(props.service?.getId() != null ? props.service.duration : 0)

    const [showDialogConfirmDelete, setShowDialogConfirmDelete] = useState(false)
    const [service, setService] = useState<Service | null>(props.service)

    const { t } = useTranslation();

    useEffect(() => {
        setService(props.service)
    }, [props.service]);

    const createOrUpdateService = () => {
        if (service?.getId() == null) {
            const tempService = new Service((Date.now()).toString(), nameOfService, descriptionOfService, priceOfService, durationOfService)
            addDocumentWithId(Collections.services,
                tempService!.getId()!, tempService).then(() => {
                    props.handleClose(true, t('getCreateServiceSucessMessage'))
                }).catch((error) => {
                    alert(error)
                    props.handleClose(false, t('getCreateServiceErrorMessage'))
                })
        } else {
            const tempService = new Service(service.getId(), nameOfService, descriptionOfService, priceOfService, durationOfService)
            updateDocument(Collections.services,
                tempService!.getId()!, tempService).then(() => {
                    props.handleClose(true, t('getUpdatedServiceSucessMessage'))
                }).catch((error) => {
                    alert(error)
                    props.handleClose(false, t('getUpdatedServiceErrorMessage'))
                })
        }
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
                <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>{service?.getId() != null ? t('getServiceNameLabel') : t('getServiceNameLabel')}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label={t('getServiceNameLabel') + ' *'}
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={nameOfService}
                                onChange={(e) => { setNameOfService(e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label={t('getDescriptionLabel') + ' *'}
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={descriptionOfService}
                                onChange={(e) => { setDescriptionOfService(e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label={t('getServicePrice') + ' *'}
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={priceOfService}
                                onChange={(e) => { setPriceOfService(Number(e.target.value)) }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label={t('getServiceDurationLabel') + ' *'}
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={durationOfService}
                                onChange={(e) => { setDurationOfService(Number(e.target.value)) }}
                            />
                        </Grid>
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
                    {service?.getId() != null && <Button style={{ color: "red" }} onClick={() => {
                        setShowDialogConfirmDelete(true)
                    }}>{t('getDeleteButtonLabel')}</Button>}
                    <Button
                        disabled={!(nameOfService != "" && descriptionOfService != "" && priceOfService > 0 && durationOfService > 0)}
                        onClick={() => {
                            setIsLoading(true)
                            createOrUpdateService()
                        }}>{service?.getId() != null ? t('getUpdateButtonLabel') : t('getCreateButtonLabel')}</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={showDialogConfirmDelete}
                keepMounted
                onClose={() => setShowDialogConfirmDelete(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    {t('getDeletServiceTitle')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('getDeleteServiceMessage')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ color: "red" }} onClick={() => setShowDialogConfirmDelete(false)}> {t('getNoButtonLabel')}</Button>
                    <Button onClick={() => {
                        props.handleDelete()!
                        props.handleClose(true, t('getDeletedServiceSuccessMessage'))
                        setShowDialogConfirmDelete(false)
                    }}>{t('getYesButtonLabel')}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}