import { collection, doc, DocumentSnapshot, getDoc } from "firebase/firestore";
import { workerData } from "worker_threads";
import { db, getDocRefWithId } from "../firebase";
import Collections from "./Collections";

export default {   
    formatDateForInput: function formatDateForInput(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      },

      validateEmail: function validateEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email)
      },
      validatePassword: function validatePassword(password: string) {
        const passwordRegex = /^(?=.*\d)[\d\w]{6,}$/;
          return passwordRegex.test(password)
      },
};
