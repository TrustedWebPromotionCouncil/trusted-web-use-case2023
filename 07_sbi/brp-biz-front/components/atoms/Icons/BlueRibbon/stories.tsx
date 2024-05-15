import type { Meta, StoryObj } from '@storybook/react'
import BlueRibbon from '.'

const meta = {
  title: 'atoms/Icons/BlueRibbon',
  component: BlueRibbon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof BlueRibbon>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
  },
};
