'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import Breadcrumb from '@/components/demo/Breadcrumb';
import PageTitle from '@/components/demo/PageTitle';
import { usePathname, useRouter } from 'next/navigation';
import TabMenu from '@/components/demo/TabMenu';
import TextInput from '@/components/demo/TextInput';
import Button from '@/components/demo/Button';
import { GroupAccount, RegisteredAccount } from '@/types';
import { useGroupAccount } from '@/hooks/useGroupAccount';
import { MouseEventHandler, useEffect, useState } from 'react';
import { useLocale } from '@/hooks/useLocale';

export default function Pagesess() {
  const { t } = useLocale();
  const { addAccount, getGroup, getAccountList } = useGroupAccount();
  const [from, setFrom] = useState<number>(0);
  const [to, setTo] = useState<number>(10);
  const router = useRouter();
  const [group, setGroup] = useState<GroupAccount | undefined>();
  const [accounts, setAccounts] = useState<RegisteredAccount[] | undefined>();
  const pathname = usePathname();
  const id = pathname.slice(pathname.lastIndexOf('/') + 1);
  const { register, control, handleSubmit } = useForm<RegisteredAccount>({
    defaultValues: {
      id: '',
      name: '',
      type: 'admin',
    },
  });

  useEffect(() => {
    console.log('to :>> ', to);
    console.log('from :>> ', from);

    setGroup(getGroup(id));
    setAccounts(() => getAccountList(id, from, to));
  }, [getGroup(id), from, to]);

  const next = () => {
    console.log('next');
    setFrom(from + 10);

    to + 10 < (group ? group.registeredList.length : 0)
      ? setTo(to + 10)
      : setTo(group ? group.registeredList.length : 0);
    setAccounts(getAccountList(id, from, to));
  };

  const before = () => {
    setFrom(from + 10);
    setTo(to + 10);
  };

  const onSubmit: SubmitHandler<RegisteredAccount> = (data) => {
    addAccount(id, {
      ...data,
      from: Date.now(),
      to: Date.now() + 20 * 24 * 60 * 60 * 1000,
      signable: 20,
    });
    router.push(`/demo/wallet/10_createAccount/133_groupDone/${id}`);
  };

  const Registration = (
    <form className="w-fit mx-auto pt-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-[25px]">
        <label htmlFor="admin" className="flex gap-4 w-127 py-2">
          <input
            {...register('type')}
            type="radio"
            id="admin"
            value={'admin'}
            className="w-6 h-6 scale-75"
          />
          <span>{t.PAGES.GROUP_HOME.REGISTRATION.INP_RADIO_ADMIN}</span>
        </label>
        <label htmlFor="pic" className="flex gap-4 w-127 py-2">
          <input
            {...register('type')}
            type="radio"
            id="pic"
            value={'pic'}
            className="w-6 h-6 scale-75"
          />
          <span>{t.PAGES.GROUP_HOME.REGISTRATION.INP_RADIO_PIC}</span>
        </label>
      </div>
      <div className="flex flex-col gap-4 pt-5">
        <TextInput<RegisteredAccount>
          label={t.PAGES.GROUP_HOME.REGISTRATION.INP_ID}
          name="id"
          control={control}
          size="medium"
        />
        <TextInput<RegisteredAccount>
          label={t.PAGES.GROUP_HOME.REGISTRATION.INP_NAME}
          name="name"
          control={control}
          size="small"
        />
      </div>
      <div className="flex flex-col gap-2 w-fit mx-auto pt-12">
        <Button
          label={t.PAGES.GROUP_HOME.REGISTRATION.BTN_CREATE}
          color="blue"
          size="medium"
          variant="fill"
          type="submit"
        />
        <Button
          label={t.PAGES.GROUP_HOME.REGISTRATION.BTN_BACK}
          color="blue"
          size="medium"
          variant="outline"
          path="/demo/wallet/10_createAccount/131_groupSelect"
        />
      </div>
    </form>
  );

  const PagingButton = ({
    label,
    onClick,
  }: {
    label: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
  }) => {
    return (
      <button
        onClick={onClick}
        className="w-12 h-12 text-demo-link border rounded-full"
      >
        {label}
      </button>
    );
  };

  const List = (
    <div className="w-screen max-w-2xl mx-auto mb-[82px]">
      <table className="text-center mt-[38px] w-full border-collapse">
        <thead className="text-demo-thin font-normal">
          <tr className="border-b">
            <th>{t.PAGES.GROUP_HOME.LIST.TABLE_COL_EXPIRES_AT}</th>
            <th>{t.PAGES.GROUP_HOME.LIST.TABLE_COL_NAME}</th>
            <th>{t.PAGES.GROUP_HOME.LIST.TABLE_COL_SIGNABLE}</th>
            <th>{t.PAGES.GROUP_HOME.LIST.TABLE_COL_ACCOUNT_TYPE}</th>
          </tr>
        </thead>
        <tbody className="text-sm leading-6">
          {accounts?.map((v, i) => (
            <tr key={i} className="border-b h-[69px]">
              <td>
                <p>{new Date(v.from).toLocaleDateString()}</p>
                <p>-{new Date(v.to).toLocaleDateString()}</p>
              </td>
              <td className="w-24 text-base font-bold whitespace-pre-wrap">
                {v.name}
              </td>
              <td>{v.signable}</td>
              <td>
                {v.type === 'admin'
                  ? t.PAGES.GROUP_HOME.LIST.ACCOUNT_ADMIN
                  : t.PAGES.GROUP_HOME.LIST.ACCOUNT_PIC}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center gap-6 w-fit h-fit py-4 mx-auto">
        <PagingButton label="|&lt;" onClick={() => {}} />
        <PagingButton label="&lt;" onClick={() => {}} />
        <span>
          {from + 1}/{accounts?.length}
        </span>
        <PagingButton label="&gt;" onClick={next} />
        <PagingButton label="&gt;|" onClick={() => {}} />
      </div>
    </div>
  );

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
          {
            title: t.COMPONENTS.BREADCRUMB.GROUP_SELECT,
            path: '/demo/wallet/10_createAccount/131_groupSelect',
          },
          {
            title: group ? group.name : '',
          },
        ]}
      />
      <PageTitle title={group ? group.name : ''} />
      <TabMenu
        displays={[
          {
            button: t.COMPONENTS.TAB_MENU.REGISTRATION,
            children: Registration,
          },
          { button: t.COMPONENTS.TAB_MENU.LIST, children: List },
        ]}
      />
    </>
  );
}
