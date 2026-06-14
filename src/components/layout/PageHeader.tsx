type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-adab-gray-300 bg-white">
      <div className="site-container py-12">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-adab-navy-800 phone:text-3xl tablet:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-adab-gray-500">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
