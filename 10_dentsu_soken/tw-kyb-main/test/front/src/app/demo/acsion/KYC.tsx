import TextInput from '@/components/demo/TextInput';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '@/components/demo/Button';
import { KYC } from '@/types';
import { useState } from 'react';
import { kycState } from '@/states/kycState';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import prefecture from '@/consts/prefecture';

export default function KYC() {
  const router = useRouter();
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const setKYC = useSetAtom(kycState);
  const { control, handleSubmit, register } = useForm<KYC>({
    defaultValues: {
      type: 'kyc',
      firstName: '',
      lastName: '',
      gender: 'female',
      birthday: Date.now(),
      firstName_kana: '',
      lastName_kana: '',
      prefectuer: '',
      city: '',
      address: '',
      building: '',
    },
  });
  const onSubmit: SubmitHandler<KYC> = (data) => {
    console.log(data);
    const d = new Date();
    d.setFullYear(Number(year));
    d.setMonth(Number(month));
    d.setDate(Number(day));

    setKYC({
      ...data,
      birthday: d.getTime(),
    });

    router.push('/demo/acsion/confirm?type=kyc');
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-fit mx-auto">
        <h2 className="text-[28px] pb-6">申請内容</h2>
        <div className="flex gap-2 pb-4">
          <TextInput<KYC>
            label="氏"
            name="lastName"
            control={control}
            rules={{ required: true }}
            size="small"
          />
          <TextInput<KYC>
            label="名"
            name="firstName"
            control={control}
            rules={{ required: true }}
            size="small"
          />
        </div>
        <div className="flex gap-2 pb-6">
          <TextInput<KYC>
            label="氏(カナ)"
            name="lastName_kana"
            control={control}
            rules={{ required: true }}
            size="small"
          />
          <TextInput<KYC>
            label="名(カナ)"
            name="firstName_kana"
            control={control}
            rules={{ required: true }}
            size="small"
          />
        </div>
        <div className="pb-6">
          <label htmlFor="birthday" className="block pb-2">
            生年月日
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
          <label htmlFor="gender">性別</label>
          <label htmlFor="female" className="block py-2">
            <input
              type="radio"
              value={'female'}
              {...register('gender')}
              className="scale-150"
            />
            <span className="pl-4">女性</span>
          </label>
          <label htmlFor="male" className="block py-2">
            <input
              type="radio"
              value={'male'}
              {...register('gender')}
              className="scale-150"
            />
            <span className="pl-4">男性</span>
          </label>
          <label htmlFor="other" className="block py-2">
            <input
              type="radio"
              value={'other'}
              {...register('gender')}
              className="scale-150"
            />
            <span className="pl-4">その他・無回答</span>
          </label>
        </div>
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
          <TextInput<KYC>
            label="市区町村"
            name="city"
            control={control}
            rules={{ required: true }}
            size="medium"
          />
          <TextInput<KYC>
            label="番地"
            name="address"
            control={control}
            rules={{ required: true }}
            size="medium"
          />
          <TextInput<KYC>
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
