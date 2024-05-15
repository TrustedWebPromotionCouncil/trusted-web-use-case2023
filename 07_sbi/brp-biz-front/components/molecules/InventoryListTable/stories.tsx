import type { Meta, StoryObj } from '@storybook/react'
import InventoryListTable from '.'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'molecules/InventoryListTable',
  component: InventoryListTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof InventoryListTable>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: () => <InventoryListTable></InventoryListTable>
};
