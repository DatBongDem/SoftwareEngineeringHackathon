import type { ReactNode } from 'react'

export interface TableColumn<T> {
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
}

export function Table<T>({ columns, rows, rowKey }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
      <table className="w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800/50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
              {columns.map((column) => (
                <td key={column.header} className={column.className ?? 'px-4 py-3 text-slate-700 dark:text-slate-200'}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
