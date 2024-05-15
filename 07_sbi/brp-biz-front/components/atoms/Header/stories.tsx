import type { Meta, StoryObj } from '@storybook/react'
import Header from '.'

const meta = {
  title: 'atoms/Header',
  component: Header,
  parameters: {
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    legalEntityName: '株式会社A',
    userName: 'ユーザーA',
    color: '#42454F'
  },
};
