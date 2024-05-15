'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import Breadcrumb from '@/components/demo/Breadcrumb';
import GroupSelect from '@/components/demo/GroupSelect';
import PageTitle from '@/components/demo/PageTitle';
import { useRouter } from 'next/navigation';
import Button from '@/components/demo/Button';
import { useGroupAccount } from '@/hooks/useGroupAccount';
import { useLocale } from '@/hooks/useLocale';

// TODO これだけぽつんとあるのきもいからどうにかする。
export type Selected = {
  id: string;
};

export default function Pagesess() {
  const { t } = useLocale();
  const { groupList } = useGroupAccount();
  const router = useRouter();
  const { control, handleSubmit } = useForm<Selected>({
    defaultValues: {
      id: '',
    },
  });
  const onSubmit: SubmitHandler<Selected> = (data) => {
    router.push(`132_groupHome/${data.id}`);
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
          { title: t.COMPONENTS.BREADCRUMB.GROUP_SELECT },
        ]}
      />
      <PageTitle title={t.PAGES.GROUP_SELECT.TITLE} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-fit mx-auto pt-[50px]">
          <h2 className="text-2xl pl-[11px]">
            {t.PAGES.GROUP_SELECT.MSG_SELECT_GROUP}
          </h2>
          <div className="flex flex-col gap-6 pt-[25px] max-h-80 overflow-auto scrollbar">
            {groupList.map((v, i) => {
              return (
                <GroupSelect<Selected>
                  key={i}
                  name="id"
                  id={v.id}
                  label={v.name}
                  createAt={v.createAt}
                  control={control}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-fit mx-auto pt-8">
          <Button
            label={t.PAGES.GROUP_SELECT.BTN_MOVE_ADMIN_PAGE}
            color="blue"
            size="medium"
            variant="fill"
            type="submit"
          />
        </div>
      </form>
    </>
  );
}
