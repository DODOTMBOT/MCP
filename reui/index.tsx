"use client";

import React from "react";

type CrumbItem = {
  label: string;
  href?: string;
  isCurrent?: boolean;
};

export function Breadcrumb({ items, className }: { items: CrumbItem[]; className?: string }) {
  return (
    <nav className={className} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href && !item.isCurrent ? (
              <a href={item.href} className="hover:text-gray-700">
                {item.label}
              </a>
            ) : (
              <span className={item.isCurrent ? "text-gray-900 font-medium" : undefined}>{item.label}</span>
            )}
            {index < items.length - 1 && <span className="mx-2 text-gray-400">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}


