import TWBtn from '@/components/TWBtn.vue';
import { t } from '@/utils';
import type { Meta, StoryObj } from '@storybook/vue3';

type Story = StoryObj<typeof TWBtn>;

const meta: Meta<typeof TWBtn> = {
  title: 'TWBtn',
  component: TWBtn,
};

const text = t('BUTTON.CANCEL');

export const Default: Story = {
  render: () => ({
    components: { TWBtn },
    template: `<TWBtn class="mx-2">${text}</TWBtn>`,
  }),
};

export default meta;
