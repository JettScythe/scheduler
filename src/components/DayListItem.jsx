import React from "react"
import classnames from "classnames"
import "components/DayListItem.scss"

export default function DayListItem(props) {
  let dayListItemClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots
  }) 

  const formatSpots = () => {
    let spots = props.spots
    if (spots > 1) {
      return `${spots} spots remaining`
    }
    if (spots === 1) {
      return `${spots} spot remaining`
    }
    if (spots <= 0) {
      return "no spots remaining"
    }
  }

  return (
    <li onClick={() => props.setDay(props.name)} className={dayListItemClass}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  );
}