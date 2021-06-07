import React from 'react'
import DayListItem from './DayListItem'
export default function DayList(props) {
  const { days, day, setDay } = props
  const dayListDay = days ? days.map((dayListData) => {
    return (
    <DayListItem key={dayListData.id} name={dayListData.name} spots={dayListData.spots} setDay={setDay} selected={dayListData.name === props.day}/>
    )}) : "There are no available days"
  return (
    <ul>
    {dayListDay}
    </ul>
  )
}