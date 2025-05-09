import React from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Column<T> {
    key: string;
    header: string;
    cell: (item: T) => React.ReactNode;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: string;
}

interface TableViewProps<T> {
    data: T[];
    columns: Column<T>[];
    sortKey?: string;
    sortOrder?: 'asc' | 'desc';
    onSort?: (key: string) => void;
    className?: string;
    loading?: boolean;
    emptyState?: React.ReactNode;
}

function TableView<T>({
    data,
    columns,
    sortKey,
    sortOrder,
    onSort,
    className,
    loading = false,
    emptyState,
}: TableViewProps<T>) {
    const renderSortIcon = (column: Column<T>) => {
        if (!column.sortable) return null;

        if (sortKey === column.key) {
            return sortOrder === 'asc' ? (
                <ChevronUp className="h-4 w-4" />
            ) : (
                <ChevronDown className="h-4 w-4" />
            );
        }

        return <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />;
    };

    return (
        <div className={cn('overflow-x-auto rounded-lg border border-gray-200/60', className)}>
            <table className="w-full divide-y divide-gray-200/60">
                <thead className="bg-gray-50/50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                style={{ width: column.width }}
                                className={cn(
                                    'px-6 py-3',
                                    'text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                                    'whitespace-nowrap',
                                    column.sortable && 'cursor-pointer hover:bg-gray-100/50',
                                    column.align === 'center' && 'text-center',
                                    column.align === 'right' && 'text-right'
                                )}
                                onClick={() => column.sortable && onSort?.(column.key)}
                            >
                                <span className="group inline-flex items-center gap-1">
                                    {column.header}
                                    {renderSortIcon(column)}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200/60">
                    {loading ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-12 text-center text-sm text-gray-500"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-500" />
                                    <span>Loading...</span>
                                </div>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-12 text-center text-sm text-gray-500"
                            >
                                {emptyState || 'No data available'}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50/50 transition-colors duration-200"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={cn(
                                            'px-6 py-4 text-sm text-gray-900 whitespace-nowrap',
                                            column.align === 'center' && 'text-center',
                                            column.align === 'right' && 'text-right'
                                        )}
                                    >
                                        {column.cell(item)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TableView;