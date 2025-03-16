import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import { show } from "../states/alerts";
import { useDispatch } from "react-redux";
import { deleteSchedule, updateSchedule } from "../api/Services";
import { Delete, Edit } from "@mui/icons-material";

function Schedule({ schedules, isAddSched, close, locations }) {
  const dispatch = useDispatch();

  const [isDelete, setIsDeleting] = useState(false);
  const [localSchedules, setLocalSchedules] = useState(schedules?.data || []);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  useEffect(() => {
    if (schedules?.data) {
      const updatedSchedules = schedules.data.filter(
        (newSched) =>
          !localSchedules.some((localSched) => localSched.id === newSched.id)
      );
      setLocalSchedules((prevSchedules) => [...prevSchedules, ...updatedSchedules]);
    }
  }, [schedules]);

  const openConfirmDelete = (scheduleId, e) => {
    e.stopPropagation(); // Prevent row click event
    setScheduleToDelete(scheduleId);
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDelete = () => {
    setScheduleToDelete(null);
    setConfirmDeleteDialog(false);
  };

  const handleDelete = async () => {
    if (!scheduleToDelete) {
      console.error("No schedule ID provided");
      return;
    }
    
    try {
      setIsDeleting(true);

      // Call the deleteSchedule API
      await deleteSchedule([scheduleToDelete]); // Pass the schedule ID as an array

      // Remove the deleted schedule from the local state
      setLocalSchedules((prevSchedules) =>
        prevSchedules.filter((schedule) => schedule.id !== scheduleToDelete)
      );

      dispatch(
        show({
          message: "Schedule Deleted Successfully",
          type: "success",
          duration: 3000,
          show: true,
        })
      );

      closeConfirmDelete();
    } catch (error) {
      console.error("Delete Error:", error);
      dispatch(
        show({
          message: "Failed to delete schedule. Please try again.",
          type: "error",
          duration: 3000,
          show: true,
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRowClick = (schedule) => {
    setSelectedSchedule(schedule);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedSchedule(null);
    setDialogOpen(false);
  };

  const handleUpdate = async () => {
    if (!selectedSchedule) {
      console.error("No schedule selected for update.");
      return;
    }
  
    try {
      console.log("Updating Schedule:", selectedSchedule);
  
    
      await updateSchedule(selectedSchedule.id, {
        note: selectedSchedule.note,
        barangay: selectedSchedule.barangay,
        day: selectedSchedule.day,
        timeF: selectedSchedule.timeF,
        timeT: selectedSchedule.timeT,
      });
  
      
      setLocalSchedules((prevSchedules) =>
        prevSchedules.map((sched) =>
          sched.id === selectedSchedule.id ? selectedSchedule : sched
        )
      );
  
      dispatch(
        show({
          message: "Schedule Updated Successfully",
          type: "success",
          duration: 3000,
          show: true,
        })
      );
  
      handleDialogClose();
    } catch (error) {
      console.error("Update Error:", error);
      dispatch(
        show({
          message: "Failed to update schedule. Please try again.",
          type: "error",
          duration: 3000,
          show: true,
        })
      );
    }
  };


  const validateInput = (value) => {
    const regex = /^[a-zA-Z0-9]*$/; 
    return regex.test(value);
  };

  return (
    <div className="w-full">
      <div className="relative overflow-scroll shadow-md rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-green-100 text-black">
            <tr>
              <th className="px-4 py-3 w-40">NOTE</th>
              <th className="px-4 py-3 w-96">AREA</th>
              <th className="px-4 py-3 w-32">Day</th>
              <th className="px-4 py-3 w-32">Time</th>
              <th className="px-4 py-3 w-32">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="font-semibold text-black divide-y divide-gray-200">
            {localSchedules.map((schedule) => (
              <tr
                key={schedule.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(schedule)}
              >
                <td className="px-4 py-3">
                  <div className="w-40 truncate" title={schedule.note}>
                    {schedule.note}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="w-96 truncate" title={schedule.barangay}>
                    {schedule.barangay}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="w-20 truncate" title={schedule.day}>
                    {schedule.day}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="w-30 truncate">
                    {schedule.timeF} - {schedule.timeT}
                  </div>
                </td>
                <td className="px-4 py-3 flex flex-row">
                  <Button
                    variant="text"
                    startIcon={<Edit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(schedule);
                    }}
                  />
                  <Button
                    variant="text"
                    color="error"
                    startIcon={<Delete />}
                    onClick={(e) => openConfirmDelete(schedule.id, e)}
                    disabled={isDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
      {selectedSchedule && (
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Edit Schedule</DialogTitle>
          <DialogContent>
            <TextField
              label="Note"
              fullWidth
              value={selectedSchedule.note}
              onChange={(e) => {
                const value = e.target.value;
                if (validateInput(value)) {
                  setSelectedSchedule({ ...selectedSchedule, note: value });
                }
              }}
              margin="normal"
            />
            <TextField
              label="Area"
              fullWidth
              value={selectedSchedule.barangay}
              onChange={(e) => {
                const value = e.target.value;
                if (validateInput(value)) {
                  setSelectedSchedule({ ...selectedSchedule, barangay: value });
                }
              }}
              margin="normal"
            />

            <div className="flex flex-row gap-3"> 
              <TextField
                label="Time From"
                type="time"
                value={selectedSchedule.timeF}
                onChange={(e) =>
                  setSelectedSchedule({ ...selectedSchedule, timeF: e.target.value })
                }
                margin="normal"
              />
              <TextField
                label="Time To"
                type="time"
                value={selectedSchedule.timeT}
                onChange={(e) =>
                  setSelectedSchedule({ ...selectedSchedule, timeT: e.target.value })
                }
                margin="normal"
              />
         
              <select
                name="day"
                value={selectedSchedule.day} 
                onChange={(e) =>
                  setSelectedSchedule({ ...selectedSchedule, day: e.target.value })}
                className="form-select mt-4 p-2 border rounded-md">                 
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>  
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}

      
      <Dialog open={confirmDeleteDialog} onClose={closeConfirmDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this schedule? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDelete}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            disabled={isDelete}
          >
            {isDelete ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Schedule;