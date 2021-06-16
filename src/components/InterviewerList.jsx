import React from "react";
import PropTypes from "prop-types";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";

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
