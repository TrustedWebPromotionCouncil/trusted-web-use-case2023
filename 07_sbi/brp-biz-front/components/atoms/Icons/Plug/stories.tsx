import type { Meta, StoryObj } from '@storybook/react'
import Plug from '.'

const meta = {
  title: 'atoms/Icons/Plug',
  component: Plug,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof Plug>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    color: '#42454F',
    size: 256
  },
};
