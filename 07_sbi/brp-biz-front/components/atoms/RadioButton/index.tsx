import React, { FC, useState} from "react";

interface RadioButtonProps {
  options: string[],
  value: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const RadioButton: FC<RadioButtonProps> = ({ options, value, onChange }) => {
  
  return (
    <div className="flex flex-col mb-2 min-h-4">
      {options.map((option) => (
        <label key={option} className="text-xl mt-8 my-6 hover:cursor-pointer">
          <input
            type="radio"
            name="radioGroup"
            onChange={onChange}
            value={option}
            checked={value === option}
            className="w-4 h-4 mr-4"
          />
          {option}
        </label>
      ))}
    </div>
  )
}

export default RadioButton