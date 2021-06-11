import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const findRemainingSpots = (days, id, appointments) => {
    const theDay = days.find((day) => day.appointments.includes(id));
    let numOfSpots = 0;
    for (let appointment in appointments) {
      if (
        !appointments[appointment].interview &&
        theDay.appointments.includes(appointments[appointment].id)
      ) {
        numOfSpots++;
      }
    }
    theDay.spots = numOfSpots;
    return theDay;
  };

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
        interviewers: all[2].data,
      }));
    });
  }, []);

  const setDay = (day) => setState({ ...state, day });
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      findRemainingSpots(state.days, id, appointments);
      setState({
        ...state,
        appointments,
      });
    });
  };

  const cancelInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = { ...state.appointments, [id]: appointment };
    return axios.delete(`/api/appointments/${id}`).then(() => {
      findRemainingSpots(state.days, id, appointments);
      setState({
        ...state,
        appointments,
      });
    });
  };
  return { state, setDay, bookInterview, cancelInterview };
}
