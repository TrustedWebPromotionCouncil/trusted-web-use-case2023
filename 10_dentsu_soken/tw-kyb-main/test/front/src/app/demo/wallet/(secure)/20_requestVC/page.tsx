'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import Breadcrumb from '@/components/demo/Breadcrumb';
import Button from '@/components/demo/Button';
import PageTitle from '@/components/demo/PageTitle';
import { useRouter } from 'next/navigation';
import SelectBox from '@/components/demo/SelectBox';
import issuers from '@/consts/issuers';
import { useLocale } from '@/hooks/useLocale';

export type Issuer = {
  name: string;
};

export default function Pagesess() {
  const { t } = useLocale();
  const router = useRouter();
  const { control, handleSubmit } = useForm<Issuer>({
    defaultValues: {
      name: '/demo/acsion',
    },
  });
  const onSubmit: SubmitHandler<Issuer> = (data) => {
    console.log(data);
    router.push(data.name);
  };

  return (
    <>
      <Breadcrumb
        pages={[
          {
            title: t.COMPONENTS.BREADCRUMB.HOME,
            path: '/demo/wallet/01_home',
          },
          { title: t.COMPONENTS.BREADCRUMB.REQUEST_VC },
        ]}
      />
      <PageTitle title={t.PAGES.REQUEST_VC.TITLE} />
      <div className="w-fit pt-16 pb-8 mx-auto text-[17px]">
        <p className="whitespace-pre">{t.PAGES.REQUEST_VC.MSG_SELECT_ISSUER}</p>
      </div>
      <form className="pt-11" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2 w-fit mx-auto">
          <SelectBox<Issuer> name="name" options={issuers} control={control} />
        </div>
        <div className="flex flex-col gap-2 w-fit mx-auto pt-16">
          <Button
            label={t.PAGES.REQUEST_VC.BTN_MOVE_ISSUER_PAGE}
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
