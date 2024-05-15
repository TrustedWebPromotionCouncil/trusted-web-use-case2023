import type { Meta, StoryObj } from '@storybook/react'
import  ProcessingModal from '.'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'molecules/ProcessingModal',
  component: ProcessingModal,
  parameters: {
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof ProcessingModal>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    open: true
  },
}

