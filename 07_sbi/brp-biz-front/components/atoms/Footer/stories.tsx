import type { Meta, StoryObj } from '@storybook/react'
import Footer from '.'

const meta = {
  title: 'atoms/Footer',
  component: Footer,
  parameters: {
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    color: '#42454F'
  },
};
