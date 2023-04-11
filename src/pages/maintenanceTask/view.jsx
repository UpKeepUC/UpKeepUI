import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Box,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import axios from "axios";

const MaintenanceView = () => {
  const navigate = useNavigate();
  const [maintenanceTaskTypes, setMaintenanceTaskTypes] = useState([]);
  const [roomModel, setRoomModel] = useState([]);


  const [maintenanceTaskTypeId, setMaintenanceTaskTypeId] = useState(-1);
  const [roomId, setRoomId] = useState(-1);
  const [maintenanceTaskDueDate, setMaintenanceTaskDueDate] = useState(new Date());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [responseReceived, setResponseReceived] = useState(false);

  const handleMaintenanceTaskChange = (event) => {
    setMaintenanceTaskTypeId(event.target.value); 
  };

  const handleRoomChange = (event) => {
    setRoomId(event.target.value);
  }

  const handleMaintenanceTaskDueDate = (event) => {
    setMaintenanceTaskDueDate(event.target.value);
  };

  const handleName = (event) => {
    setName(event.target.value);
  };
  const handleDescription = (event) => {
    setDescription(event.target.value);
  };

    const handleDeleteClick = (event) => {
      event.preventDefault();
      const apiURL = process.env.REACT_APP_API_URL;

    //build update model
    const maintenanceModel = {
        MaintenanceTaskId: 0,
        MaintenanceTaskTypeId: maintenanceTaskTypeId,
        RoomId: roomId,
        Name: name,
        Description: description,
        MaintenanceTaskDueDate: maintenanceTaskDueDate
      };

    //submit post
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(maintenanceModel),
    };
      fetch(apiURL + '/MaintenanceTask/DeleteMaintenanceTask', requestOptions)
        .then(response => response.json())
        .then(data => console.log(data));
      

        navigate('/maintenanceTask');
        window.location.reload();
    }

    const handleCloseClick = (event) => {
       // setup onclose handler instead of refreshing page
       navigate('/maintenanceTask');
    }
  
    const handleSubmit = (event) => {
        event.preventDefault();
        const apiURL = process.env.REACT_APP_API_URL;

    //build update model
    const maintenanceModel = {
        MaintenanceTaskId: 0,
        MaintenanceTaskTypeId: maintenanceTaskTypeId,
        RoomId: roomId,
        Name: name,
        Description: description,
        MaintenanceTaskDueDate: maintenanceTaskDueDate
      };

    //submit post
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(maintenanceModel),
    };
    fetch(apiURL + "/MaintenanceTask/UpdateMaintenanceTask", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));

    // setup onclose handler instead of refreshing page
    navigate("/maintenanceTask");
    window.location.reload();
  };

  const apiURL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const getData = async () => {
      const id = window.location.hash.split('/')[2];
      const response = await axios.get(
        apiURL + "/MaintenanceTask/GetMaintenanceTaskById?id=" + id
      );
      if (response.data) {
        setMaintenanceTaskTypeId(response.data.maintenanceTaskTypeId);
        setMaintenanceTaskDueDate(response.data.MaintenanceTaskDueDate);
        setRoomId(response.data.roomId);
        setName(response.data.name);
        setDescription(response.data.description);
        setResponseReceived(true);
      }

      const typeResponse = await axios.get(
        apiURL + "MaintenanceTaskType/GetMaintenanceTaskTypes"
      );
      if (typeResponse.data) {
        setMaintenanceTaskTypes(typeResponse.data);
      }

      const roomResponse = await axios.get(apiURL + "/Room/GetRooms");
      if (roomResponse.data) {
        setRoomModel(roomResponse.data);
      }
    };
    getData();
  }, []);


  return (
    <Dialog open={responseReceived} m="20px">
      <DialogTitle>Maintenance Task</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container direction="row" padding="10px">
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="MaintenanceTaskTypes">
                  Maintenance Task Type
                </InputLabel>
                <Select
                color="grey"
                labelId="MaintenanceTaskTypes"
                id="maintenanceTaskTypes"
                  defaultValue={maintenanceTaskTypeId}
                  label="Inventory Item Type"
                  onChange={handleMaintenanceTaskChange}
                >
                  {maintenanceTaskTypes.map((maintenanceTaskTypeModel) => (
                    <MenuItem
                      value={maintenanceTaskTypeModel.maintenanceTaskTypeId}
                    >
                      {maintenanceTaskTypeModel.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid item xs={12} padding="10px">
              <TextField
                label="Name"
                required
                name="name"
                fullWidth
                id="name"
                defaultValue={name}
                onChange={handleName}
              />
            </Grid>
            <Grid item xs={12} padding="10px">
              <TextField
                label="Description"
                required
                name="description"
                fullWidth
                id="description"
                defaultValue={description}
                onChange={handleDescription}
              />
            </Grid>
            <Grid item xs={12} padding="10px">
              <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Maintenance Task Due Date"
                  defaultValue={dayjs(maintenanceTaskDueDate)}
                  onChange={handleMaintenanceTaskDueDate}
                />
              </LocalizationProvider>              
              </Grid>
            </Grid>
            </Box>
            </DialogContent>
            <DialogActions>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Button
              color="error"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
            <Button
              color="error"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleCloseClick}
            >
              Close
            </Button>
            </DialogActions>
            

        
      </Dialog>
    );
  };
  
  export default MaintenanceView;