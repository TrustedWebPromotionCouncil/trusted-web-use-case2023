import type { Meta, StoryObj } from '@storybook/react'
import Credential from '.';
import { BusinessUnit } from '@/types';


const meta = {
  title: 'pages/Credential',
  component: Credential,
  parameters: {
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof Credential>

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
} as BusinessUnit
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
    requestStatus: 'NONE',
    vcForBusinessUnit,
  },
};

export const Processing: Story = {
  args: {
    user,
    requestStatus: 'NONE',
    vcForBusinessUnit,
    processing: true
  },
};
