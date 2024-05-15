import React, { FC, useState} from "react";

interface CheckboxProps {
  options: string[],
  checked?: boolean,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox: FC<CheckboxProps> = ({ options, checked, onChange }) => {
  return (
    <div className="flex flex-col mx-4 mb-2 min-h-4">
      {options.map((option, index) => (
        <label key={index} className="hover:cursor-pointer">
          <input
            type="checkbox"
            name="checkboxGroup"
            onChange={onChange}
            className="w-4 h-4 mr-4"
          />
          <span className="checkmark">{option}</span>
        </label>
      ))}
    </div>
  )
}

export default Checkbox