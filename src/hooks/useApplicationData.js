import { useReducer, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.day,
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers,
        };
      case SET_INTERVIEW: {
        return {
          ...state,
          id: action.id,
          interview: action.interview,
        }; /* insert logic */
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  const [state, dispatch] = useReducer(reducer, {
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
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      });
    });
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    console.log(interview);
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      findRemainingSpots(state.days, id, appointments);
      dispatch({ type: SET_INTERVIEW, id, interview });
    });
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = { ...state.appointments, [id]: appointment };
    return axios.delete(`/api/appointments/${id}`).then(() => {
      findRemainingSpots(state.days, id, appointments);
      dispatch({ type: SET_INTERVIEW, id, interview: null });
    });
  };
  return { state, setDay, bookInterview, cancelInterview };
}
