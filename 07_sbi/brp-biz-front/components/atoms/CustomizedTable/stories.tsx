import type { Meta, StoryObj } from '@storybook/react'
import CustomizedTable from '.'
import Button from '../Button'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'atoms/CustomizedTable',
  component: CustomizedTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof CustomizedTable>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    name: "Table",
    columns:
      [
        // {
        //   header: "column 1",
        //   accessor: "columnName1"
        // }, {
        //   header: "column 2",
        //   accessor: "columnName2"
        // }, {
        //   header: "column 3",
        //   accessor: "columnName3"
        // }, {
        //   header: "column with a long name",
        //   accessor: "columnName4"
        // }
        "column 1", "column 2", "column 3", "column 4"
      ]
    ,
    rows: [
      {
        items:
          ["item 1a", "item 1b", "item 1c", "item 1d"],
      }, {
        items:
          ["item 2a", "item 2b", "item 2c", "item 123456"]
      }
    ],
  },
};

export const Secondary: Story = {
  args: {
    name: "Table",
    columns:
      [
        // {
        //   header: "column 1",
        //   accessor: "columnName1"
        // }, {
        //   header: "column 2",
        //   accessor: "columnName2"
        // }, {
        //   header: "column 3",
        //   accessor: "columnName3"
        // }, {
        //   header: "column with a long name",
        //   accessor: "columnName4"
        // }
        "column 1", "column 2", "column 3", "column 4"
      ]
    ,
    rows: [
      {
        items:
          ["item 1a", "item 1b", "item 1c", "item 1d"],
      }, {
        items:
          ["item 2a", "item 2b", "item 2c", "item 123456"]
      }
    ],
    hasDetails: true,
    detailBackgroundColor: "bg-[#986b6b]",
    actionButton:
      <div>
        <Button>準備</Button>
        <Button>完成</Button>
      </div>
  },
};