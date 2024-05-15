import { FC, InputHTMLAttributes } from 'react'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  placeholder: string;
  className?: string;
  isIndented?: boolean;
  disabled?: boolean
}

const InputField: FC<InputFieldProps> = (({ onChange, ...props }) => {
  const handleChange = (event: any) => {
    if (onChange) {
      onChange(event);
    }
  }

  return (
    <div className='grid grid-cols-3 my-3'>
      {props.label && <div className='grid grid-cols-2'>
        {props.isIndented ? <div></div> : ""}
        <label
          className="text-md font-semibold my-3"
        >{props.label}
        </label>
      </div>}
      <input
        disabled={props.disabled}
        type={props.type ? `${props.type}` : 'text'}
        className={`${props.className} col-span-2 border-solid border-2 border-grey-500 rounded rounded-md mx-2 p-3`}
        placeholder={props.placeholder}
        onChange={handleChange}
        value={props.value}>
      </input>
    </div>
  )
})

export default InputField