import { FC, ReactNode } from 'react'
import Button from '../Button';

interface Props {
  currentStep: number
  steps: string[]
  onReturn?: () => void
  onFinish?: () => void
  onNext?: () => void
  labelNext: string
  children?: ReactNode
}

const StepperController: FC<Props> = ({ ...props }) => {
  return (
    <div>
      <div className={`grid grid-cols-4 w-full gap-0 mt-8 p-4`}>
        {props.steps?.map((step, index) => (
          <div className='relative grid' key={index}>
            <div className="flex flex-col justify-center items-center">
              <p className={`${props.currentStep === index + 1 ? "text-black font-bold" : "text-white"}  flex justify-center items-center`}>{step}</p>
              <div className={`${props.currentStep < index + 1 ? "bg-slate-200" : "text-white bg-blue-500"} z-10 transition duration-500 ease-in-out rounded-full h-10 w-10 flex justify-center items-center mt-2`}>
                {index + 1}
              </div>
            </div>
            <div className={`${index === 0 && "hidden"} ${props.currentStep < index + 1 && props.currentStep !== props.steps?.length ? "bg-slate-200" : "bg-blue-500"} right-1/2 absolute top-12 h-1 w-full`}></div>
          </div>
        ))}
      </div>
      <main>{props.children}</main>
      <div className="container flex justify-around items-center mt-4 mb-8">
        {props.currentStep === 1 ? <Button color='secondary' onClick={props.onReturn}>戻る</Button> : <Button color='secondary' onClick={props.onFinish}>閉じる</Button>}
        {props.currentStep !== props.steps.length ? <Button color='primary' onClick={props.onNext}>{props.labelNext}</Button> : null}
      </div>
    </div>
  )
}
export default StepperController;