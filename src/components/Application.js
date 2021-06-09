import React, { useState, useEffect } from "react";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
  });

  let dailyAppointments = [];

  const setDay = (day) => setState({ ...state, day });

  dailyAppointments = getAppointmentsForDay(state, state.day);

  const appointment = dailyAppointments.map((appointmentData) => {
    return <Appointment key={appointmentData.id} {...appointmentData} />;
  });

  useEffect(() => {
    const days = "/api/days";
    const appointments = "/api/appointments";
    const interviewers = "/api/interviewers";

    Promise.all([
      axios.get(days),
      axios.get(appointments),
      axios.get(interviewers),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
      }));
    });
  }, []);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointment}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
