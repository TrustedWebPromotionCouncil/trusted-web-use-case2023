import type { Meta, StoryObj } from '@storybook/react'
import VioletRibbon from '.'

const meta = {
  title: 'atoms/Icons/VioletRibbon',
  component: VioletRibbon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof VioletRibbon>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
  },
};
