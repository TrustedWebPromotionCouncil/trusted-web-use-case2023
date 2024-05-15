import type { Meta, StoryObj } from '@storybook/react'
import MiniCertificate from '.';

const meta = {
  title: 'atoms/MiniCertificate',
  component: MiniCertificate,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof MiniCertificate>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    type: "事業所VC",
    validFrom: "2023-09-01",
    size: 320,
    uuid: "999e8400-nmnm-41d4-a716-44"
  },
};

export const DateType: Story = {
  args: {
    type: "事業所VC",
    validFrom: new Date(),
    size: 320,
    uuid: "999e8400-nmnm-41d4-a716-44"
  },
};
