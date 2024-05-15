import type { Meta, StoryObj } from '@storybook/react'
import  DeliveryPrepareModal from '.'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'molecules/DeliveryPrepareModal',
  component: DeliveryPrepareModal,
  parameters: {
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof DeliveryPrepareModal>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    open: true,
    vcs: [
      {
        id: 1,
        validFrom: new Date(2023, 9, 1),
        validUntil: new Date(2023, 9, 1),
        issuerName: "デジタル認証機構",
        uuid: "999e8400-nmnm-41d4-a716-44",
        original: '',
      },
      {
        id: 2,
        validFrom: new Date(2023, 9, 1),
        validUntil: new Date(2023, 9, 1),
        issuerName: "デジタル認証機構",
        uuid: "999e8400-nmnm-41d4-a716-44",
        original: '',
      }      
    ]
  },
};

