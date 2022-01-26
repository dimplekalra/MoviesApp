import React from "react";

export interface IInputProps {
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
  id: string;
  important?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: string;
  disabled?: boolean;
}

const Input: React.FC<IInputProps> = ({
  type,
  onChange,
  value,
  name,
  id,
  important,
  onBlur,
  error,
  icon,
  disabled,
}) => {
  return (
    <React.Fragment>
      <i className="material-icons prefix">{icon}</i>
      <label htmlFor={name}>
        {id}
        {important ? " *" : ""}
      </label>

      <input
        type={type}
        name={name}
        id={id}
        onChange={onChange}
        value={value}
        className={` ${error ? (error.length ? "invalid" : "valid") : ""} `}
        required={important}
        onBlur={onBlur}
        disabled={disabled}
      />
      {error ? <p className="red-text error">{error}</p> : null}
    </React.Fragment>
  );
};

export default Input;
