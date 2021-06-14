import { useReducer, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const findRemainingSpots = (state, id, appointments) => {
    const days = [...state.days];
    const dayIndex = days.findIndex((day) => day.appointments.includes(id));
    let spots = 0;

    days[dayIndex].appointments.forEach((appointment) => {
      !appointments[appointment].interview && spots++;
    });

    days[dayIndex].spots = spots;
    return days;
  };

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
        const { id, interview } = action;

        const appointment = {
          ...state.appointments[id],
          interview: interview ? { ...interview } : null,
        };

        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };

        const days = findRemainingSpots(state, id, appointments);

        return {
          ...state,
          appointments,
          days,
        };
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

  useEffect(() => {
    const days = "/api/days";
    const appointments = "/api/appointments";
    const interviewers = "/api/interviewers";

    Promise.all([
      axios.get(days),
      axios.get(appointments),
      axios.get(interviewers),
    ]).then((all) => {
      //console.log(all);
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      });
    });
    try {
      const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
      webSocket.onopen = () => {
        webSocket.send("ping");
        webSocket.onmessage = (event) => {
          const { type, id, interview } = JSON.parse(event.data);
          if (type === "SET_INTERVIEW") {
            dispatch({
              type,
              id,
              interview,
            });
          }
        };
      };
    } catch (err) {
      console.error(err);
    }
  }, []);

  const setDay = (day) => dispatch({ type: SET_DAY, day });
  const bookInterview = (id, interview) => {
    console.log(interview);
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview });
    });
  };

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview: null });
    });
  };
  return { state, setDay, bookInterview, cancelInterview };
}
