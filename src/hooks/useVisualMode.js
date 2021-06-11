import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const transition = (mode, replace = false) => {
    if (replace) {
      setMode(mode);
    } else {
      setMode(mode);
      setHistory((prev) => [...prev, mode]);
    }
  };
  function back() {
    if (history.length > 1) {
      let newHist = [...history];
      newHist.pop();
      setHistory(newHist);
      setMode(newHist[newHist.length - 1]);
    }
  }
  return { mode, transition, back };
}
