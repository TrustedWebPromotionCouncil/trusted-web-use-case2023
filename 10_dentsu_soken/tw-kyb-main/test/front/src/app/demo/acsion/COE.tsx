import TextInput from '@/components/demo/TextInput';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '@/components/demo/Button';
import { COE } from '@/types';
import { useEffect, useState } from 'react';
import { coeState } from '@/states/coeState';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import prefecture from '@/consts/prefecture';
import { useApplication } from '@/hooks/useApplication';

export default function COE() {
  const [toggle, setToggle] = useState(false);
  const [submit, setSubmit] = useState(false);
  const router = useRouter();
  const d = new Date(Date.now());
  const { getLastKYC } = useApplication();
  const kyc = getLastKYC();
  const [year, setYear] = useState(d.getFullYear().toString());
  const [month, setMonth] = useState(d.getMinutes().toString());
  const [day, setDay] = useState(d.getDate().toString());
  const setCOE = useSetAtom(coeState);
  const { control, handleSubmit, register, setValue } = useForm<COE>({
    defaultValues: {
      type: 'coe',
      firstName: '',
      lastName: '',
      firstName_kana: '',
      lastName_kana: '',
      hireDate: Date.now(),
      corpName: '',
      seviceYears: 1,
      prefectuer: '',
      city: '',
      address: '',
      building: '',
    },
  });

  useEffect(() => {
    if (!!kyc) {
      setValue('firstName', kyc.firstName);
      setValue('lastName', kyc.lastName);
      setValue('firstName_kana', kyc.firstName_kana);
      setValue('lastName_kana', kyc.lastName_kana);
      setValue('prefectuer', kyc.prefectuer);
      setValue('city', kyc.city);
      setValue('address', kyc.address);
      setValue('building', kyc.building);
    }
  });
  const onSubmit: SubmitHandler<COE> = (data) => {
    console.log(data);
    const d = new Date();
    d.setFullYear(Number(year));
    d.setMonth(Number(month));
    d.setDate(Number(day));

    setCOE({
      ...data,
      hireDate: d.getTime(),
    });

    router.push('/demo/acsion/confirm?type=coe');
  };

  const modal = (
    <>
      <div className="w-screen h-screen absolute inset-0 bg-demo-modal bg-blend-screen opacity-70"></div>
      <div className="fixed inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[272px] h-fit p-4 rounded-xl bg-white">
        <div className="w-full pt-4 pb-4">
          <p>以下のデジタル証明を申請先に開示して良いですか？</p>
          <ul className="pl-5 text-xl font-bold list-disc">
            <li>本人確認(KYC)</li>
          </ul>
        </div>
        <Button
          label="OK"
          color="blue"
          size="xs"
          variant="fill"
          onClick={() => {
            setSubmit(true);
            setToggle(!toggle);
          }}
        />
        <button
          className="w-60 h-14 pt-6 text-demo-blue font-bold underline tracking-widest"
          onClick={() => setToggle(!toggle)}
        >
          キャンセル
        </button>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {toggle && modal}
      <div className="w-[327px] mx-auto pb-4">
        <h2 className="text-[24px] pb-6">
          デジタル証明の開示
          <span className="pl-2 text-xs text-demo-alert">必須</span>
        </h2>
        <div className="flex justify-center">
          {submit ? (
            <div className="w-fit mx-auto pb-10">
              <label htmlFor="birthday" className="block pb-2">
                開示するデジタル証明
              </label>
              <div className="w-[311px] h-fit px-4 py-3 border border-black rounded-lg">
                <p>本人確認(KYC)</p>
              </div>
            </div>
          ) : (
            <Button
              label={`${submit ? '開示済' : '開示する'}`}
              color={`${submit ? 'gray' : 'green'}`}
              size="small"
              variant="fill"
              onClick={() => setToggle(true)}
              disabled={submit}
            />
          )}
        </div>
      </div>
      <div className="w-fit mx-auto">
        <h2 className="text-[28px] pb-6">申請内容</h2>
        <div className="flex gap-2 pb-4">
          <TextInput<COE>
            label="法人名"
            name="corpName"
            control={control}
            rules={{ required: true }}
            size="medium"
          />
        </div>
        <div className="pb-6">
          <label htmlFor="birthday" className="block pb-2">
            入社年月日
            <span className="pl-2 text-xs text-demo-alert">必須</span>
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-white w-[95px] h-14 px-4 border border-black rounded-lg"
          >
            {Array(100)
              .fill(0)
              .map((_, i) => {
                return (
                  <option value={new Date().getFullYear() - i} key={i}>
                    {new Date().getFullYear() - i}
                  </option>
                );
              })}
          </select>
          <span className="px-2">年</span>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-white w-[66px] h-14 px-2 border border-black rounded-lg"
          >
            {Array(12)
              .fill(0)
              .map((v, i) => {
                return (
                  <option value={1 + i} key={i}>
                    {1 + i}
                  </option>
                );
              })}
          </select>
          <span className="px-2">月</span>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="bg-white w-[66px] h-14 px-2 border border-black rounded-lg"
          >
            {Array(31)
              .fill(0)
              .map((v, i) => {
                return (
                  <option value={1 + i} key={i}>
                    {1 + i}
                  </option>
                );
              })}
          </select>
          <span className="px-2">日</span>
        </div>
        <div className="pb-6">
          <select
            {...register('seviceYears')}
            className="bg-white w-[95px] h-14 px-4 border border-black rounded-lg"
          >
            {Array(60)
              .fill(0)
              .map((v, i) => {
                return (
                  <option value={1 + i} key={i}>
                    {1 + i}
                  </option>
                );
              })}
          </select>
          <span className="px-2">年</span>
        </div>
        <div className="flex gap-2 pb-4">
          <TextInput<COE>
            label="氏"
            name="lastName"
            control={control}
            rules={{ required: true }}
            size="small"
          />
          <TextInput<COE>
            label="名"
            name="firstName"
            control={control}
            rules={{ required: true }}
            size="small"
          />
        </div>
        <div className="flex gap-2 pb-6">
          <TextInput<COE>
            label="氏(カナ)"
            name="lastName_kana"
            control={control}
            rules={{ required: true }}
            size="small"
          />
          <TextInput<COE>
            label="名(カナ)"
            name="firstName_kana"
            control={control}
            rules={{ required: true }}
            size="small"
          />
        </div>
        <h3 className="text-xl pb-2">申請者住所</h3>
        <div className="flex flex-col gap-8">
          <label htmlFor="prefectuer" className="block">
            都道府県
            <span className="pl-2 text-xs text-demo-alert">必須</span>
            <br />
            <select
              {...register('prefectuer')}
              className="bg-white w-[95px] h-14 mt-2 px-2 border border-black rounded-lg"
            >
              {prefecture.map((v, i) => {
                return (
                  <option value={v.code} key={i}>
                    {v.name}
                  </option>
                );
              })}
            </select>
          </label>
          <TextInput<COE>
            label="市区町村"
            name="city"
            control={control}
            rules={{ required: true }}
            size="medium"
          />
          <TextInput<COE>
            label="番地"
            name="address"
            control={control}
            rules={{ required: true }}
            size="medium"
          />
          <TextInput<COE>
            label="建物名・部屋番号"
            name="building"
            control={control}
            size="medium"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-fit mx-auto pt-16 pb-8">
        <Button
          label="次へ"
          color="gray"
          size="medium"
          variant="fill"
          type="submit"
        />
        <Button
          label="Walletへ戻る"
          color="green"
          size="medium"
          variant="outline"
          path="/demo/wallet/20_requestVC"
        />
      </div>
    </form>
  );
}
