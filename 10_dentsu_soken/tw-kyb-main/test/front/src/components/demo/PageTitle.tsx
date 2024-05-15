export type PageTitleParams = {
  title: string;
};

export default function PageTitle({ title }: PageTitleParams) {
  return (
    <div className="pt-20 pl-8">
      <h1 className="text-3xl font-medium tracking-wider whitespace-pre-wrap">
        {title}
      </h1>
    </div>
  );
}
