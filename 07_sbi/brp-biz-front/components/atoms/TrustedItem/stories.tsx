import type { Meta, StoryObj } from '@storybook/react'
import TrustedItem from '.';

const meta = {
  title: 'atoms/TrustedItem',
  component: TrustedItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof TrustedItem>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    country: 'jp',
    validFrom: '2023-11-23',
    contents: "\"id\"：\"did:detc:TWAO:GHUQ1234567890\"\"publicKeyMultibase\":\"555LAzzsefefwhekwXw1NEEhe99FYttdddddd\""
  },
};

export const DateType: Story = {
  args: {
    country: 'jp',
    validFrom: new Date(2023, 10, 2),
    contents: "\"id\"：\"did:detc:TWAO:GHUQ1234567890\"\"publicKeyMultibase\":\"555LAzzsefefwhekwXw1NEEhe99FYttdddddd\""
  },
};
