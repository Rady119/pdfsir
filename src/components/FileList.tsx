import { FileListProps } from '@/types'
import { formatFileSize } from '@/utils/formatters'
import { useState } from 'react'

export function FileList({
  files,
  currentPage,
  filesPerPage,
  onPageChange,
  onRemove,
  searchTerm = '',
  onSearch,
  sortBy = 'date',
  onSort
}: FileListProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm)

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(localSearch.toLowerCase())
  )

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch(sortBy) {
      case 'date': return b.lastModified - a.lastModified
      case 'size': return b.size - a.size
      default: return b.lastModified - a.lastModified
    }
  })

  const totalPages = Math.ceil(sortedFiles.length / filesPerPage)
  const startIndex = (currentPage - 1) * filesPerPage
  const visibleFiles = sortedFiles.slice(startIndex, startIndex + filesPerPage)

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search files..."
          value={localSearch}
          onChange={(e) => {
            setLocalSearch(e.target.value)
            onSearch?.(e.target.value)
          }}
          className="px-4 py-2 border rounded-lg text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
        />
        <select
          value={sortBy}
          onChange={(e) => onSort?.(e.target.value as 'name' | 'date' | 'size')}
          className="px-4 py-2 border rounded-lg text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="date">Date</option>
          <option value="size">Size</option>
        </select>
      </div>
      {visibleFiles.length > 0 && (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow">
          {visibleFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-4 border-b last:border-0 dark:border-gray-600">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">📄</span>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {formatFileSize(file.size)} • {new Date(file.lastModified).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => onRemove(startIndex + index)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
