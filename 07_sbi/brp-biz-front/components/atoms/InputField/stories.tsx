import type { Meta, StoryObj } from '@storybook/react'
import InputField from '.'

const meta = {
  title: 'atoms/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof InputField>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    id: 'name',
    label: '名前',
    placeholder: '名前を入れてください',
  },
};
