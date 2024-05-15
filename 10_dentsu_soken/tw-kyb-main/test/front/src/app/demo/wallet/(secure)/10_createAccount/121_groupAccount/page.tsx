'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import Breadcrumb from '@/components/demo/Breadcrumb';
import Button from '@/components/demo/Button';
import PageTitle from '@/components/demo/PageTitle';
import TextInput from '@/components/demo/TextInput';
import { useRouter } from 'next/navigation';
import { GroupAccount } from '@/types';
// TODO 最終的にはFirebaseAuthのidにするのでその時に消す。
import { randomString } from '@stablelib/random';
import { useGroupAccount } from '@/hooks/useGroupAccount';
import { useLocale } from '@/hooks/useLocale';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

export default function Pagesess() {
  const { t } = useLocale();
  const { addGroup, addAccount, groupList } = useGroupAccount();
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const { control, handleSubmit } = useForm<GroupAccount>({
    defaultValues: {
      name: '',
      id: '',
      createAt: 0,
      registeredList: [],
    },
  });
  const onSubmit: SubmitHandler<GroupAccount> = (data) => {
    addGroup({
      ...data,
      id: randomString(32),
      createAt: Date.now(),
      registeredList: [
        {
          id: user ? user.uid : '',
          type: 'admin',
          name: user ? (user.displayName ? user.displayName : '') : '',
          from: Date.now(),
          to: Date.now() + 20 * 24 * 60 * 60 * 1000,
          signable: 20,
        },
      ],
    });
    router.push('122_groupAccountDone');
  };

  return (
    <>
      <Breadcrumb
        pages={[
          {
            title: t.COMPONENTS.BREADCRUMB.HOME,
            path: '/demo/wallet/01_home',
          },
          {
            title: t.COMPONENTS.BREADCRUMB.CREATE_ACCOUNT,
            path: '/demo/wallet/10_createAccount',
          },
          { title: t.COMPONENTS.BREADCRUMB.GROUP_ACCOUNT },
        ]}
      />
      <PageTitle title={t.PAGES.GROUP_ACCOUNT.TITLE} />
      <form className="pt-11" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2 w-fit mx-auto">
          <TextInput<GroupAccount>
            label={t.PAGES.GROUP_ACCOUNT.INP_NAME}
            name="name"
            control={control}
            rules={{ required: true }}
            size="medium"
          />
        </div>
        <div className="flex flex-col gap-2 w-fit mx-auto pt-[230px]">
          <Button
            label={t.PAGES.GROUP_ACCOUNT.BTN_CREATE}
            color="blue"
            size="medium"
            variant="fill"
            type="submit"
          />
          <Button
            label={t.PAGES.GROUP_ACCOUNT.BTN_BACK}
            color="blue"
            size="medium"
            variant="outline"
            path="/demo/wallet/10_createAccount"
          />
        </div>
      </form>
    </>
  );
}
