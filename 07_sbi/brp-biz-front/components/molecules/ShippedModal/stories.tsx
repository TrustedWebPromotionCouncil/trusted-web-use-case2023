import type { Meta, StoryObj } from '@storybook/react'
import  ShippedModal from '.'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'molecules/ShippedModal',
  component: ShippedModal,
  parameters: {
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof ShippedModal>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    open: true,
  },
};

