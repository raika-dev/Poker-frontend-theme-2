import React, { useState } from "react";

const NumberInput = (props) => {
  const handleChange = (e) => {
    if (isNaN(Number(e))) return;
    props.onChange(
      e < props.min ? props.min : e > props.max ? props.max : Number(e)
    );
  };
  return (
    <input
      className={props.error ? "error" : ""}
      value={props.value}
      onChange={(e) => {
        handleChange(e.target.value);
      }}
      min={props.min}
      max={props.max}
    ></input>
  );
};
export default NumberInput;
