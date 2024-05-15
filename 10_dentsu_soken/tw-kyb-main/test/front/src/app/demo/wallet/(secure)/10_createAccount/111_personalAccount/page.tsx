'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import Breadcrumb from '@/components/demo/Breadcrumb';
import Button from '@/components/demo/Button';
import PageTitle from '@/components/demo/PageTitle';
import TextInput from '@/components/demo/TextInput';
import { useRouter } from 'next/navigation';
import { PersonalAccount } from '@/types';
import { useLocale } from '@/hooks/useLocale';
import { usePersonalAccount } from '@/hooks/usePersonalAccount';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

export default function Pagesess() {
  const { t } = useLocale();
  const { addAccount } = usePersonalAccount();
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const { control, handleSubmit } = useForm<PersonalAccount>({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });
  const onSubmit: SubmitHandler<PersonalAccount> = (data) => {
    addAccount({
      ...data,
      id: user ? user.uid : '',
    });
    router.push('112_personalAccountDone');
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
          { title: t.COMPONENTS.BREADCRUMB.PERSONAL_ACCOUNT },
        ]}
      />
      <PageTitle title={t.PAGES.PERSONAL_ACCOUNT.TITLE} />
      <form className="pt-11" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2 w-fit mx-auto">
          <TextInput<PersonalAccount>
            label={t.PAGES.PERSONAL_ACCOUNT.INP_LAST_NAME}
            name="lastName"
            control={control}
            rules={{ required: true }}
            size="small"
          />
          <TextInput<PersonalAccount>
            label={t.PAGES.PERSONAL_ACCOUNT.INP_FIRST_NAME}
            name="firstName"
            control={control}
            rules={{ required: true }}
            size="small"
          />
        </div>
        <div className="flex flex-col gap-2 w-fit mx-auto pt-[230px]">
          <Button
            label={t.PAGES.PERSONAL_ACCOUNT.BTN_CREATE}
            color="blue"
            size="medium"
            variant="fill"
            type="submit"
          />
          <Button
            label={t.PAGES.PERSONAL_ACCOUNT.BTN_BACK}
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
