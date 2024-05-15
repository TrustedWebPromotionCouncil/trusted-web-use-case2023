'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '@/components/demo/Button';
import PageTitle from '@/components/demo/PageTitle';
import { useRouter } from 'next/navigation';
import CheckBox from '@/components/demo/CheckBox';
import { useLocale } from '@/hooks/useLocale';
import { useSetAtom } from 'jotai';
import { bankState } from '@/states/bankState';
import { Bank } from '@/types';

export type Application = {
  settlement: boolean;
  saving: boolean;
  finance: boolean;
  trade: boolean;
  others: boolean;
};

export default function Pagesess() {
  const router = useRouter();
  const { t } = useLocale();
  const setState = useSetAtom(bankState);
  const { control, handleSubmit } = useForm<Bank>({
    defaultValues: {
      type: 'bank',
      accountType: '普通',
    },
  });
  const onSubmit: SubmitHandler<Bank> = (data) => {
    console.log(data);
    setState(data);
    router.push('bankConfirm');
  };
  return (
    <>
      <main>
        <PageTitle title={t.PAGES.BANK_REQUEST.TITLE} />
        <form className="pt-11" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-fit mx-auto pb-10">
            <h2 className="text-[28px] pb-2">
              {t.PAGES.BANK_REQUEST.OPENED_VC}
            </h2>
            {/* TODO ここの文言は固定？選択したVCによって変わるのが正しいきがするが。。。 */}
            <div className="w-[311px] h-[100px] px-4 py-3 border border-black rounded-lg">
              {/* <p>本人確認(KYC)</p> */}
              <p>法人確認(KYB)</p>
            </div>
          </div>
          <div className="w-fit mx-auto">
            <h2 className="text-[28px] pb-4">
              {t.PAGES.BANK_REQUEST.APPLICATION_CONTENT}
            </h2>
            <div className="flex flex-col w-fit pl-4 pb-3">
              <h3>
                {t.PAGES.BANK_REQUEST.ACOUNT_TYPE}{' '}
                <span className="pl-2 text-xs text-demo-alert">必須</span>
              </h3>
              {/* TODO セレクトボックスをきれいにする */}
              <select
                name="acount_type"
                className="bg-white border border-black rounded-lg w-[165px] h-[54px] px-4"
              >
                <option value="普通">
                  {t.PAGES.BANK_REQUEST.ACOUNT_OPT_SAVINGS}
                </option>
                <option value="定期">
                  {t.PAGES.BANK_REQUEST.ACOUNT_OPT_FIXED}
                </option>
                <option value="総合">
                  {t.PAGES.BANK_REQUEST.ACOUNT_OPT_MULTIPURPOSE}
                </option>
                <option value="当座">
                  {t.PAGES.BANK_REQUEST.ACOUNT_OPT_CHECKING}
                </option>
              </select>
            </div>
            <div className="flex flex-col w-fit mx-auto pl-4">
              <h3>{t.PAGES.BANK_REQUEST.TRANSFER_TYPE}</h3>
              <CheckBox<Bank>
                name="cash"
                label={t.PAGES.BANK_REQUEST.TRANSFER_OPT_CASH}
                control={control}
              />
              <CheckBox<Bank>
                name="transfer"
                label={t.PAGES.BANK_REQUEST.TRANSFER_OPT_TRANSFER}
                control={control}
              />
              <CheckBox<Bank>
                name="other"
                label={t.PAGES.BANK_REQUEST.TRANSFER_OPT_OTHER}
                control={control}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-fit mx-auto pt-2">
            <Button
              label={t.PAGES.BANK_REQUEST.BTN_NEXT}
              color="gray"
              size="medium"
              variant="fill"
              type="submit"
            />
            <Button
              label={t.PAGES.BANK_REQUEST.BTN_BACK}
              color="yellow"
              size="medium"
              variant="outline"
              path="/demo/wallet/20_requestVC"
            />
          </div>
        </form>
      </main>
    </>
  );
}
