import Link from 'next/link';
import React from 'react';

export type BreadcrumbProps = {
  pages: {
    title: string;
    path?: string;
  }[];
};

export default function Breadcrumb({ pages }: BreadcrumbProps) {
  return (
    <div className="sm:max-w-sm md:max-w-md pl-4 pt-16 -mb-14 flex gap-[6px] flex-wrap">
      {pages.map((v, i) => {
        return (
          <span
            key={i}
            className="text-demo-current-page inline-block whitespace-pre"
          >
            {i + 1 === pages.length ? (
              <div className="flex items-start">
                <span className="inline-block pr-1">&gt;</span>
                {v.title}
              </div>
            ) : (
              <div className="flex items-start">
                {i === 0 ? null : (
                  <span className="inline-block pr-1">&gt;</span>
                )}
                <Link
                  href={v.path || '#'}
                  className="text-demo-link inline-block"
                >
                  {v.title}
                </Link>
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
}
