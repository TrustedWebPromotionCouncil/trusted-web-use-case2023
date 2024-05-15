import type { Meta, StoryObj } from '@storybook/react'
import SideBar from '.'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'molecules/SideBar',
  component: SideBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof SideBar>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  
};
