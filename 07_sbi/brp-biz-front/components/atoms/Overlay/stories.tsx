import type { Meta, StoryObj } from '@storybook/react'
import Overlay from '.'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'atoms/Overlay',
  component: Overlay,
  parameters: {
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof Overlay>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    open: true,
  },
  render: ({...args}) => 
  <Overlay {...args}>
    <div className="flex justify-center bg-slate-50 rounded w-72 h-32">
      <p className="font-bold self-center">
        オーバーレイ
      </p>
    </div>
  </Overlay>,
}