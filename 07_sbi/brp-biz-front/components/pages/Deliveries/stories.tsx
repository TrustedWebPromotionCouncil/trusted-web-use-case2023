import type { Meta, StoryObj } from '@storybook/react'
import Deliveries from '.'

const meta = {
  title: 'pages/Deliveries',
  component: Deliveries,
  parameters: {
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof Deliveries>

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
const user = {
  id: 1,
  email: '',
  name: 'ユーザーX',
  businessUnitId: 1,
  businessUnit,
}
const vcForBusinessUnit = {
  id: 1,
  authenticationLevel: 1,
  issuerName: '日本発行機構',
  uuid: 'abcd-1234567890',
  validFrom: new Date(),
  validUntil: new Date,
  original: '<json></json>',
  businessUnitId: 1,
  businessUnit,
}

export const Primary: Story = {
  args: {
    user,
    orders: [],
    vcForBusinessUnit,
  },
}

export const Processing: Story = {
  args: {
    user,
    orders: [],
    vcForBusinessUnit,
    processing: true
  },
}
