import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface BreadcrumbItem {
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
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            )}
            <li className="flex items-center">
              {item.href ? (
                <Link
                  to={item.href}
                  className={cn(
                    'text-sm font-medium',
                    'transition-colors duration-200',
                    'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-gray-900">
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