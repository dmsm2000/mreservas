import { CircularProgress } from "@mui/material";

export default function Loading() {
    return (
        <div style={{height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <CircularProgress />
        </div>
    )
}