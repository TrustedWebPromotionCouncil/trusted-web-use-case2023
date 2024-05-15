import type { Meta, StoryObj } from '@storybook/react'
import CredentialList from '.'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'organisms/CredentialList',
  component: CredentialList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof CredentialList>

export default meta
type Story = StoryObj<typeof meta>

const businessUnit = {
  id: 1,
  name:'',
  address: '',
  did: '',
  publicKey: '',
  privateKey: '',
  vcsForBusinessUnit: [],
  users: [],
  legalEntityId: 1,
  legalEntity: {
    id: 1,
    name: '事業者A',
    color: '#008080',
    businessUnits: [],
  },
  products: [],
  orders: [],
}

export const Primary: Story = {
  args: {
    vcForBusinessUnit: {
      id: 1,
      authenticationLevel: 1,
      issuerName: '日本発行機構',
      uuid: 'abcd-1234567890',
      validFrom: new Date(),
      validUntil: new Date,
      original: {},
      businessUnitId: 1,
      businessUnit,
    }
  }
};
