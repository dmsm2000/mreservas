import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import loginImage from "./login.png"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { EmailOutlined } from '@mui/icons-material';

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, sendPasswordReset } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./style.css";
import Loading from '../../components/Loading';
import toast, { Toaster } from 'react-hot-toast';
import Functions from '../../utils/Functions';

import { useTranslation } from 'react-i18next';

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false)
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [isLoadingIfLogged, setIsLoadingIfLogged] = useState(true)


  const [loginError, setLoginError] = useState<string | null>("")
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean | null>(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (loading) {
      setIsLoadingIfLogged(true)
      return;
    }
    if (user) navigate("/")
    else setIsLoadingIfLogged(false);
  }, [user, loading]);

  async function login() {
    validateEmail()
    validatePassword()
    if(!passwordError && !emailError){setIsLoadingLogin(true);
    try {
      await logInWithEmailAndPassword(email, password);
    } catch (e: unknown) {
      if (e instanceof Error) {
        const errorMessage = e.message;
        toast.error(errorMessage)
      }
    }
    setIsLoadingLogin(false);}
  }

  function handleClose() {
    setShowResetPasswordDialog(false)
  }

  function handleSend(email: string) {
    sendPasswordReset(email)
    setShowResetPasswordDialog(false)
  }

  function validateEmail() {
    setEmailError(!Functions.validateEmail(email));
  }

  function validatePassword() {
    setPasswordError(!Functions.validatePassword(password))
  };

  return isLoadingIfLogged ?
    <Loading /> :
    (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card raised sx={{ maxWidth: 500, margin: "0 20px" }}>
          <CardContent style={{ textAlign: "center" }}>
            <img src={loginImage} style={{ width: "70%" }} />
            <Typography gutterBottom variant="h2" component="div">
              {t('getLoginTitle')}
            </Typography>
            <div style={{ width: "100%" }}>
              <TextField
                style={{ width: "80%" }}
                variant="outlined"
                label= {t('getEmailLabel')}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                onBlur={validateEmail}
                error={emailError!}
                helperText={emailError && "Invalid email address"}
              />
              <br />
              <br />
              <TextField
                variant="outlined"
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                type={"password"}
                style={{ width: "80%" }}
                label={t('getPasswordLabel')}
                onBlur={validatePassword}
                error={passwordError!}
                helperText={passwordError && "Password must be 6+ characters with letters and at least 1 number"}
              />
            </div>
            <br />
            {loginError && ( // render error message if there was a login error
              <Typography variant="body1" color="error">
                {loginError}
              </Typography>
            )}
            <br />
            <Link to="#" onClick={() => setShowResetPasswordDialog(true)}>
              {t('getResetPasswordLabel')}
            </Link>
            <br /><br /><br />
            <Button onClick={login} style={{ width: "80%", height: "70px" }} variant="contained">
              {isLoadingLogin ? <CircularProgress style={{ color: "white" }} /> : t('getLoginTitle')}
            </Button>
          </CardContent>
          <br />
          <br />
        </Card>
        <Dialog open={showResetPasswordDialog} onClose={handleClose}>
          <DialogTitle>{t('getResetPasswordTitle')}</DialogTitle> 
          <DialogContent>
            <DialogContentText>
              {t('getResetPasswordMessage')}
            </DialogContentText>
            <br />
            <TextField
              onChange={(e) => setResetPasswordEmail(e.target.value)}
              autoFocus
              margin="dense"
              label={t('getEmailLabel')}
              type="email"
              fullWidth
              variant="filled"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} style={{ color: "red" }}>{t('getCancelButtonLabel')}</Button>
            <Button onClick={() => handleSend(resetPasswordEmail)}>{t('getSendButtonLabel')}</Button>
          </DialogActions>
        </Dialog>
        <Toaster />
      </div>
    )

}