import Button from '@/components/atoms/Button'
import Overlay from '@/components/atoms/Overlay'
import RadioButton from '@/components/atoms/RadioButton'
import { ChangeEvent, FC, useState } from 'react'

interface LevelModalProps {
  open?: boolean;
  onCancel?: () => void;
  // eslint-disable-next-line no-unused-vars
  onNext: (level: string) => void;
}

const LevelModal: FC<LevelModalProps> = ({ open, onCancel, onNext}) => {
  const [selectedLevel, setSelectedLevel] = useState('')
  const options = ['Level 1', 'Level 2', 'Level 3']
  const handleRadioButtonChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedLevel(event.target.value);
  }
  
  const handleNext = () => {
    if (selectedLevel === options[0]) onNext('1')
    else if (selectedLevel === options[1]) onNext('2')
    else if (selectedLevel === options[2]) onNext('3')
  }

  const handleClose = () => {
    onCancel && onCancel()
  }

  return (
  <Overlay open={open} onBackdropClick={handleClose}>
    <div className="flex flex-col items-center justify-center border-solid border-gray border-2 bg-white" style={{width: '460px', height: '370px'}}>  
      <div className="pl-6 text-xl font-bold">申請したい認証レベルを選択する。</div>
      <RadioButton options={options} value={selectedLevel} onChange={handleRadioButtonChange}></RadioButton>
      <Button onClick={handleNext}>進む</Button>
    </div>
  </Overlay>
  )
}

export default LevelModal