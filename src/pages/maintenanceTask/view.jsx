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
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import { tokens } from "../../theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";

const MaintenanceView = () => {
  const navigate = useNavigate();
  const [maintenanceTaskTypes, setMaintenanceTaskTypes] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryItemIds, setInventoryItemIds] = useState([])

  const [maintenanceTaskTypeId, setMaintenanceTaskTypeId] = useState(-1);
  const [maintenanceTaskDueDate, setMaintenanceTaskDueDate] = useState(dayjs("2000-01-01"));
  const [maintenanceTaskCompletedDate, setMaintenanceTaskCompletedDate] = useState(dayjs("2000-01-01"));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [responseReceived, setResponseReceived] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleMaintenanceTaskChange = (event) => {
    setMaintenanceTaskTypeId(event.target.value);
  };

  const handleMaintenanceTaskCompletedDate = (event) => {
    setMaintenanceTaskCompletedDate(event.$d);
  }

  const handleMaintenanceTaskDueDate = (event) => {
    setMaintenanceTaskDueDate(event.$d);
  };

  const handleName = (event) => {
    setName(event.target.value);
  };
  const handleDescription = (event) => {
    setDescription(event.target.value);
  };

    const handleDeleteClick = async (event) => {
      event.preventDefault();
      const apiURL = process.env.REACT_APP_API_URL;
      const id = window.location.hash.split('/')[2];

      const response = await axios.get(apiURL+"/MaintenanceTask/DeleteMaintenanceTask?id=" + id);

      if(response.data){
        navigate('/maintenanceTask');
      }
    }

  const handleLinkChange = (event) =>{
    console.log(event);
    setInventoryItemIds(event.target.value);
  }  

  const handleCloseClick = (event) => {
    // setup onclose handler instead of refreshing page
    navigate("/maintenanceTask");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const apiURL = process.env.REACT_APP_API_URL;

    //build update model
    const maintenanceModel = {
        MaintenanceTaskId: window.location.hash.split('/')[2],
        MaintenanceTaskTypeId: maintenanceTaskTypeId,
        Name: name,
        Description: description,
        MaintenanceTaskDueDate: maintenanceTaskDueDate,
        MaintenanceTaskCompletedDate: maintenanceTaskCompletedDate
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

    const linkModel = {
      inventoryItemIds: inventoryItemIds,
      maintenanceTaskId: window.location.hash.split('/')[2]
    }

    const linkRequestOptions ={
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(linkModel),
    }

    fetch(apiURL + "/MaintenanceTask/LinkInventoryToMaintenanceTask", linkRequestOptions)
    .then((response) => response.json())
    .then((data) => console.log(data));

    // setup onclose handler instead of refreshing page
    navigate("/maintenanceTask");
  };

  const apiURL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const getData = async () => {
      const id = window.location.hash.split("/")[2];
      const response = await axios.get(
        apiURL + "/MaintenanceTask/GetMaintenanceTaskById?id=" + id
      );
      if (response.data) {
        setMaintenanceTaskTypeId(response.data.maintenanceTaskTypeId);
        setMaintenanceTaskDueDate(response.data.MaintenanceTaskDueDate);
        setMaintenanceTaskCompletedDate(response.data.MaintenanceTaskCompletedDate);
        setName(response.data.name);
        setDescription(response.data.description);
        setResponseReceived(true);
      }

      const typeResponse = await axios.get(
        apiURL + "/MaintenanceTaskType/GetMaintenanceTaskTypes"
      );
      if (typeResponse.data) {
        setMaintenanceTaskTypes(typeResponse.data);
      }
      
      fetch(apiURL + "/InventoryItem/GetInventoryItems")
      .then((response) => response.json())
      .then((json) => {
        setInventoryItems(json);
      });
 
    };
    getData();
  }, []);

  return (
    <Dialog open={responseReceived} m="20px">
      <DialogTitle>Maintenance Task</DialogTitle>
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
          <FormControl sx={{ gridColumn: "span 6" }}>
            <InputLabel color="grey" id="MaintenanceTaskTypes">
              Maintenance Task Type
            </InputLabel>
            <Select
              labelId="MaintenanceTaskTypes"
              id="maintenanceTaskTypes"
              defaultValue={maintenanceTaskTypeId}
              label="Maintenance Task Type"
              onChange={handleMaintenanceTaskChange}
              variant="filled"
              color="grey"
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

          <TextField
            label="Name"
            required
            name="name"
            variant="filled"
            color="grey"
            id="name"
            defaultValue={name}
            onChange={handleName}
            sx={{ gridColumn: "span 6" }}
          />

          <TextField
            label="Description"
            required
            multiline
            name="description"
            variant="filled"
            color="grey"
            id="description"
            defaultValue={description}
            onChange={handleDescription}
            sx={{ gridColumn: "span 6" }}
          />

          <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Maintenance Task Due Date"
              defaultValue={dayjs(maintenanceTaskDueDate)}
              onChange={handleMaintenanceTaskDueDate}
              variant="filled"
              color="grey"
              sx={{ gridColumn: "span 6" }}
            />
          </LocalizationProvider>

          <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Maintenance Task Completed Date"
                  defaultValue={dayjs(maintenanceTaskDueDate)}
                  onChange={handleMaintenanceTaskCompletedDate}
                  variant="filled"
                  color="grey"
                  sx={{ gridColumn: "span 6" }}
                />
              </LocalizationProvider>

              <FormControl sx={{ gridColumn: "span 6" }}>
            <InputLabel color="grey" id="LinkedInventoryItems">
              Linked Inventory Items
            </InputLabel>
            <Select
              labelId="LinkedInventoryItems"
              id="linkedInventoryItems"
              multiple
              value={inventoryItemIds}
              label="Linked Inventory Items"
              onChange={handleLinkChange}
              variant="filled"
              color="grey"
            >
              {inventoryItems.map((inventoryItem) => (
                <MenuItem
                  value={inventoryItem.inventoryItemId}
                >
                  {inventoryItem.roomModel.roomNumber + " : " + inventoryItem.inventoryItemTypeModel.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>  
        </Box>
        
      </DialogContent>
      <DialogActions>
          <Button
            type="submit"
            color="success"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
            size="large"
          >
            Save
          </Button>
          <Button
            color="error"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleDeleteClick}
            size="large"
          >
            Delete
          </Button>
          <Button
            color="warning"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleCloseClick}
            size="large"
          >
            Cancel
          </Button>
        
      </DialogActions>
    </Dialog>
  );
};

export default MaintenanceView;
