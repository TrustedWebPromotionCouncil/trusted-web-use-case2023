import { FC } from 'react'

export interface Props {
  steps: string[]
  currentStep: number
}

const Stepper: FC<Props> = ({ steps, currentStep }) => {
  //const [complete, setComplete] = useState(false);

  return (
    <div className="flex w-full gap-0 flex-around mb-8">
      {steps?.map((step, index) => (
        <div className='relative' key={index}>
          <div className="flex flex-col justify-center items-center">
            <p className={`${currentStep === index + 1 ? "text-black font-bold" : "text-white"}  flex justify-center items-center mx-auto w-36`}>{step}</p>
            <div className={`${currentStep < index + 1 ? "bg-slate-200" : "text-white bg-blue-500"} z-10 transition duration-500 ease-in-out rounded-full h-10 w-10 flex justify-center items-center my-2`}>
              {index + 1}
            </div>
          </div>
          <div className={`${index === 0 && "hidden"} ${currentStep < index + 1 && currentStep !== steps.length ? "bg-slate-200" : "bg-blue-500"} right-14 flex flex-between absolute top-12 h-1 w-full`}></div>
        </div>
      ))}
    </div>
  )
}
export default Stepper;