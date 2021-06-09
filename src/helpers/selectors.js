export function getAppointmentsForDay(state, day) {
  const filteredAppts = state.days.find((dayInfo) => dayInfo.name === day);
  if (filteredAppts) {
    return filteredAppts.appointments.map((id) => state.appointments[id]);
  } else {
    return [];
  }
}
