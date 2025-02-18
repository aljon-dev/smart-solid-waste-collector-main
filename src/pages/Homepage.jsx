import React, { useEffect, useReducer, useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import Announcement from "../components/Announcement";
import Schedule from "../components/Schedule";
import Feedback from "../components/Feedback";
import Notifications from "../components/Notifications"; // Import the static Notifications component
import {
  CalendarIcon,
  ChatBubbleLeftIcon,
  HomeIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { hide, show } from "../states/alerts";
import { Alert, Snackbar } from "@mui/material";
import {
  getAnnouncements,
  getFeedbacks,
  getLocations,
  getSchedules,
  onSnapshot,
} from "../api/Services";
import { differenceInSeconds } from "date-fns";

function Homepage() {
  const [screen, setScreen] = useState(0);
  const [isAddSched, setAddSched] = useState(false);

  const dispatch = useDispatch();
  const alert = useSelector((state) => state.alert.value);

  const [announcements, setAnnouncements] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      data: [],
      count: 0,
    }
  );

  const [feedbacks, setFeedbacks] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      data: [],
      count: 0,
    }
  );

  const [schedules, setSchedules] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      data: [],
      count: 0,
      group: [],
    }
  );

  const [locations, setLocations] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      data: [],
      count: 0,
    }
  );

  const screens = [
    {
      label: "Dashboard",
      component: <Dashboard />,
      icon: <HomeIcon />,
      header: "Garbage Truck Map Tracker",
    },
    {
      label: "Announcement",
      component: <Announcement announcements={announcements} />,
      icon: <MegaphoneIcon />,
      header: "Announcements",
    },
    {
      label: "Schedule",
      component: (
        <Schedule
          schedules={schedules}
          isAddSched={isAddSched}
          locations={locations}
          close={() => {
            setAddSched(true);
          }}
        />
      ),
      icon: <CalendarIcon />,
      header: "Barangay Schedule",
    },
    {
      label: "Feedback",
      component: <Feedback feedbacks={feedbacks} />,
      icon: <ChatBubbleLeftIcon />,
      header: "Residents Feedback",
    },
    {
      label: "Notifications",
      component: <Notifications />, // Static Notifications component
      icon: <CalendarIcon />,
      header: "Notifications",
    },
  ];

  return (
    <div className="w-full bg-white h-screen flex flex-row font-inter text-[#F2F2F2] overflow-hidden">
      <Sidebar screens={screens} screen={screen} setScreen={setScreen} />
      <div className="flex-1 h-full flex flex-col p-4 gap-4">
        <Navbar
          screen={screens[screen]}
          index={screen}
          toggleAdd={() => {
            setAddSched(true);
          }}
        />
        {screens[screen].component}
      </div>
      {alert.show && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={alert.show}
          autoHideDuration={alert.duration}
          onClose={() => {
            dispatch(hide());
          }}
        >
          <Alert severity={alert.type}>{alert.message}</Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default Homepage;