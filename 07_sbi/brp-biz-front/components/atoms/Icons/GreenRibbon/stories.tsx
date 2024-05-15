import type { Meta, StoryObj } from '@storybook/react'
import GreenRibbon from '.'

const meta = {
  title: 'atoms/Icons/GreenRibbon',
  component: GreenRibbon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof GreenRibbon>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
  },
};
