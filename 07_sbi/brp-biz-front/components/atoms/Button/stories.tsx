import type { Meta, StoryObj } from '@storybook/react'
import Button from '.'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' },
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' }
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: (args) => <Button {...args}>ボタン</Button>,
};

export const Secondary: Story = {
  render: (args) => <Button color="secondary" {...args}>ボタン</Button>,
};

export const Danger: Story = {
  render: (args) => <Button color="danger" {...args}>ボタン</Button>,
};

export const Disabled: Story = {
  render: (args) => <Button disabled  {...args}>ボタン</Button>,
};

