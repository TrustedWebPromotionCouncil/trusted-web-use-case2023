'use client';

import Button from '@/components/demo/Button';
import LoginButton from '@/components/demo/LoginButton';
import LoginHeader from '@/components/demo/LoginHeader';
import PageTitle from '@/components/demo/PageTitle';
import { useAccount } from '@/hooks/useAccount';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useLocale } from '@/hooks/useLocale';
import { useEffect, useState } from 'react';
import { PersonalAccount } from '../../../../types/index';
import TextInput from '@/components/demo/TextInput';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { usePersonalAccount } from '@/hooks/usePersonalAccount';

export default function Pagesess() {
  const { t } = useLocale();
  const [firstLogin, setFirstLogin] = useState(false);
  const { user } = useFirebaseAuth();
  const { account, addAccount } = usePersonalAccount();
  const router = useRouter();
  const { control, handleSubmit } = useForm<PersonalAccount>({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  useEffect(() => {
    if (user && !account.id) {
      setFirstLogin(true);
    }
  }, [user]);

  const onSubmit: SubmitHandler<PersonalAccount> = (data) => {
    addAccount({
      ...data,
      id: user ? user.uid : '',
    });
    router.push('/demo/wallet/01_home');
  };

  if (firstLogin) {
    return (
      <main>
        <PageTitle title={t.PAGES['LOGIN'].TITLE} />
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
              label={'次へ'}
              color="blue"
              size="medium"
              variant="fill"
              type="submit"
            />
          </div>
        </form>
      </main>
    );
  }

  return (
    <>
      {/* <LoginHeader /> */}
      <main>
        <PageTitle title={t.PAGES['LOGIN'].TITLE} />
        <div className="w-fit mx-auto pt-[113px] flex flex-col gap-8">
          <LoginButton type="google" />
          <LoginButton type="webAuth" />
        </div>
      </main>
    </>
  );
}
