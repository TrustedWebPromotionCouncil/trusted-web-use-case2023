import type { Meta, StoryObj } from '@storybook/react'
import TaskList from '.'

const meta = {
  title: 'atoms/Icons/TaskList',
  component: TaskList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof TaskList>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
  },
};
