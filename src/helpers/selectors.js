export function getAppointmentsForDay(state, day) {
  const filteredAppts = state.days.find((dayInfo) => dayInfo.name === day);
  if (filteredAppts) {
    return filteredAppts.appointments.map((id) => state.appointments[id]);
  } else {
    return [];
  }
}

export function getInterview(state, interview) {
  return (
    interview && {
      student: interview.student,
      interviewer: { ...state.interviewers[interview.interviewer] },
    }
  );
}

export function getInterviewersForDay(state, day) {
  const filteredInterviewers = state.days.find(
    (dayInfo) => dayInfo.name === day
  );
  if (filteredInterviewers) {
    return filteredInterviewers.interviewers.map(
      (key) => state.interviewers[key]
    );
  } else {
    return [];
  }
}
