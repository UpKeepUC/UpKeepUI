import React, { useEffect, useState } from "react";
import { Box, 
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions 
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { tokens } from "../../theme";
import Button from "@mui/material/Button";
import InventoryTable from "../InventoryTable/InventoryTableByRoom";
import MaintenanceTable from "../MaintenanceTable/MaintenanceTableByRoom";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RoomModal = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [roomNumber, setRoomNumber] = useState("");
  const [roomLocation, setRoomLocation] = useState("");
  const [roomId, setRoomId] = useState(-1);
  const [roomTypeId, setRoomTypeId] = useState(-1);

  const [responseReceived, setResponseReceived] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const apiURL = process.env.REACT_APP_API_URL;
      const id = window.location.hash.split("/")[2];
      const response = await axios.get(
        apiURL + "/Room/GetRoomById?id=" + id
      );
      if (response.data) {
        setRoomNumber(response.data.roomNumber);
        setRoomLocation(response.data.roomLocation);
        setRoomId(response.data.roomId);
        setRoomTypeId(response.data.roomTypeId);

        setResponseReceived(true);
      }
    };
    getData();

  },[]);

  const handleClose = (event) =>{
    navigate("/rooms")
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const apiURL = process.env.REACT_APP_API_URL;
    const data = new FormData(event.currentTarget);

    console.log("save");
  };

  return (
    <Dialog open={responseReceived} m="20px">
      <DialogTitle>Room Number: {roomNumber}</DialogTitle>
      <DialogContent>
      <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(6, minmax(0, 1fr))"
          sx={{
            mt: 3,
            "& > div": { gridColumn: isNonMobile ? undefined : "span 6" },
            "& .MuiTextField-root": { alignContent: "center" },
          }}
        >
          <TextField
              name="roomLocation"
              color="grey"
              variant="filled"
              required
              fullWidth
              id="roomLocation"
              label="Room Location"
              defaultValue={roomLocation}
              sx={{ gridColumn: "span 4" }}
              autoFocus
            />
            <TextField
              required
              color="grey"
              fullWidth
              variant="filled"
              id="roomNumber"
              label="Room Number"
              name="roomNumber"
              value={roomNumber}
              sx={{ gridColumn: "span 2" }}
            />
        </Box>
        <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <Box>
          <h2>Inventory Items in Room</h2>
          <InventoryTable roomId={roomId} />
        </Box>
        <Box>
          <h2>Maintenance Tasks for Room</h2>
          <MaintenanceTable roomId={roomId} />
        </Box>
      </Box>
      </DialogContent>
      <DialogActions>
      <Button
              justifyContent="space-between"
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Save
            </Button>
            <Button
            color="warning"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleClose}
          >
            Cancel
          </Button>
      </DialogActions>
    </ Dialog>
  );
}

export default RoomModal;
