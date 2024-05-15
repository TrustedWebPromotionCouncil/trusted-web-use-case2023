import type { Meta, StoryObj } from '@storybook/react'
import InventoryConfirmModal from '.'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'molecules/InventoryConfirmModal',
  component: InventoryConfirmModal,
  parameters: {
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof InventoryConfirmModal>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    open: true,
    verificationResult: {
      id: 1,
      date: new Date,
      hasValidBusinessUnitCredentialStatus: true,
      hasValidBusinessUnitSignature: true,
      hasValidIssuerCredentialStatus: true,
      hasValidIssuerSignature: true,
      hasValidIssuerVc: true,
      hasValidVcForBusinessUnit: true,
      vpId: 1,
      vp: {
        key: "aaaa",
        did: "ajamas",
        orderId: 1,
        order: {

        }
      },
    }
  }
};
