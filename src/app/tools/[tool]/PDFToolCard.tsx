import Link from 'next/link'

interface PDFToolCardProps {
  title: string
  icon: string
  path: string
  description: string
}

export function PDFToolCard({ title, icon, path, description }: PDFToolCardProps) {
  // Remove /tools prefix since it's already in the link
  const toolPath = path.startsWith('/') ? path : `/${path}`
  
  return (
    <Link href={`/tools${toolPath}`} className="block">
      <div className="bg-white dark:bg-gray-700 dark:text-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105" role="button" aria-label={title}>
        <div className="text-4xl mb-4">{icon}</div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </Link>
  )
}
