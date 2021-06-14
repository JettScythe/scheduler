import React from "react";
import PropTypes from "prop-types";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";

// PROPS //
/* interviewers:array - an array of objects containing the information of each interviewer
interviewer:number - the id of an interviewer
setInterviewer:function - a function that accepts an interviewer id */

export default function InterviewerList(props) {
  const interviewer = props.interviewers.map((interviewerData) => {
    return (
      <InterviewerListItem
        key={interviewerData.id}
        name={interviewerData.name}
        avatar={interviewerData.avatar}
        setInterviewer={(event) => props.onChange(interviewerData.id)}
        selected={interviewerData.id === props.value}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewer}</ul>
    </section>
  );
}
InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired,
};
