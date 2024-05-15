import TextInput from '@/components/demo/TextInput';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '@/components/demo/Button';
import { KYB } from '@/types';
import { useState } from 'react';
import { kybState } from '@/states/kybState';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import prefecture from '@/consts/prefecture';

export default function KYB() {
  const router = useRouter();
  const [toggle, setToggle] = useState(false);
  const [submit, setSubmit] = useState(false);
  const d = new Date(Date.now());
  const [year, setYear] = useState(d.getFullYear().toString());
  const [month, setMonth] = useState(d.getMinutes().toString());
  const [day, setDay] = useState(d.getDate().toString());
  const setKYB = useSetAtom(kybState);
  const { control, handleSubmit, register } = useForm<KYB>({
    defaultValues: {
      type: 'kyb',
      address: '',
      building: '',
      city: '',
      corpName: '',
      establishDate: 0,
      prefectuer: '',
      president: '',
    },
  });
  const onSubmit: SubmitHandler<KYB> = (data) => {
    console.log(data);
    const d = new Date();
    d.setFullYear(Number(year));
    d.setMonth(Number(month));
    d.setDate(Number(day));

    setKYB({
      ...data,
      establishDate: d.getTime(),
    });

    router.push('/demo/acsion/confirm?type=kyb');
  };

  const modal = (
    <>
      <div className="w-screen h-screen absolute inset-0 bg-demo-modal bg-blend-screen opacity-70"></div>
      <div className="fixed inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[272px] h-fit p-4 rounded-xl bg-white">
        <div className="w-full pt-4 pb-4">
          <p>以下のデジタル証明を申請先に開示して良いですか？</p>
          <ul className="pl-5 text-xl font-bold list-disc">
            <li>本人確認(KYC)</li>
            <li>在籍証明</li>
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
      <div className="w-fit mx-auto pb-4">
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
                <p>在籍証明</p>
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
        <h2 className="text-[28px] pb-6">申請内容</h2>
        <div className="flex flex-col gap-2 pb-4">
          <TextInput<KYB>
            label="法人名"
            name="corpName"
            control={control}
            rules={{ required: true }}
            size="medium"
          />
          <TextInput<KYB>
            label="法人番号"
            name="corpNumber"
            control={control}
            rules={{ required: true }}
            size="medium"
          />
        </div>
        <div className="pb-6">
          <label htmlFor="birthday" className="block pb-2">
            設立年月日
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
        <TextInput<KYB>
          label="代表者名"
          name="president"
          control={control}
          rules={{ required: true }}
          size="medium"
        />
        <h3 className="text-xl pt-6 pb-2">所在地</h3>
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
          <TextInput<KYB>
            label="市区町村"
            name="city"
            control={control}
            rules={{ required: true }}
            size="medium"
          />
          <TextInput<KYB>
            label="番地"
            name="address"
            control={control}
            rules={{ required: true }}
            size="medium"
          />
          <TextInput<KYB>
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
