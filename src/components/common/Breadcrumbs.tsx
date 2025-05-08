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
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-primary-400" />
            )}
            <li>
              {item.href ? (
                <Link
                  to={item.href}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-gray-700">
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