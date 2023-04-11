import React, { useEffect, useState } from "react";
import DataTable from "../common/dataTable";

const columns = [
  {
    field: "maintenanceTaskId",
    headerName: "Id",
    type: "number",
    headerAlign: "left",
    align: "left",
    flex: 0.3
  },
  { field: "name", headerName: "Name", flex: 0.5 },
  { field: "description", headerName: "Description", flex: 1.25 },
  {
    field: "maintenanceTaskDueDate",
    headerName: "Task Due Date",
    valueGetter: ({ value }) => value && new Date(value),
    flex: 1,
  },
];

const MaintenanceTasksTableStyles = {
  height: "300px",
};

function MaintenanceTable(props) {
  const { inventoryId } = props;
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const apiURL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const id = window.location.pathname.split("/")[2];
    console.log(inventoryId);
    fetch(apiURL + "/MaintenanceTask/GetMaintenanceTaskByInventoryId?id=" + id)
      .then((response) => response.json())
      .then((json) => {
        setMaintenanceTasks(json);
      })
      .catch(() => {
        console.log("error");
      });
  }, []);

  return (
    <DataTable
      rows={maintenanceTasks}
      columns={columns}
      loading={!maintenanceTasks.length}
      sx={MaintenanceTasksTableStyles}
      getRowId={(row) => row.maintenanceTaskId}
    />
  );
}

export default MaintenanceTable;
