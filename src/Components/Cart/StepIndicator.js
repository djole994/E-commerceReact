import React from "react";
import "./stepIndicator.css";   // stilovi ispod

export default function StepIndicator({ steps, current }) {
  return (
    <ol className="stepper">
      {steps.map((label, idx) => (
        <li key={label} className={idx <= current ? "active" : ""}>
          <span>{idx + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}
