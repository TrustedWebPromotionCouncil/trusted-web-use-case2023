import TWHeader from '../components/TWHeader.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

type Story = StoryObj<typeof TWHeader>;

const meta: Meta<typeof TWHeader> = {
  title: 'TWHeader',
  component: TWHeader,
};

export const Default: Story = {
  render: () => ({
    components: { TWHeader },
    template: '<TWHeader />',
  }),
};

export default meta;
