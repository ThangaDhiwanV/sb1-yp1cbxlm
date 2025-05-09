import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav className={cn('flex items-center', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-primary-400 flex-shrink-0" />
            )}
            <li className="flex items-center">
              {item.href ? (
                <Link
                  to={item.href}
                  className={cn(
                    'text-sm font-medium px-2 py-1 rounded-md',
                    'transition-all duration-200',
                    'text-gray-600 hover:text-primary-600',
                    'hover:bg-primary-50',
                    'relative group'
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className={cn(
                    'absolute inset-0 bg-primary-100/0',
                    'group-hover:bg-primary-100/50',
                    'rounded-md transition-all duration-200',
                    '-z-0'
                  )} />
                </Link>
              ) : (
                <span className={cn(
                  'text-sm font-medium px-2 py-1',
                  'text-primary-700',
                  'bg-primary-50/50',
                  'rounded-md'
                )}>
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;