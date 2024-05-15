import type { Meta, StoryObj } from '@storybook/react'
import DeliveryListTable from '.'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'molecules/DeliveryListTable',
  component: DeliveryListTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof DeliveryListTable>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: () => <DeliveryListTable></DeliveryListTable>
}