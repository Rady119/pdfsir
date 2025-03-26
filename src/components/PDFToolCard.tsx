import Link from 'next/link'

interface PDFToolCardProps {
  title: string
  icon: string
  path: string
  description: string
  comingSoon?: boolean
}

export function PDFToolCard({ title, icon, path, description, comingSoon }: PDFToolCardProps) {
  // Remove the /tools prefix since it's already in the URL structure
  const toolPath = path.startsWith('/') ? path.slice(1) : path
  
  const content = (
    <div
      className={`bg-white dark:bg-gray-700 dark:text-white rounded-lg shadow-md p-6 ${
        !comingSoon ? 'hover:shadow-lg transition-all cursor-pointer hover:scale-105' : 'opacity-75'
      }`}
      role="button"
      aria-label={title}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold mb-2">
        {title}
        {comingSoon && (
          <span className="ml-2 text-sm bg-yellow-300 text-gray-800 px-2 py-1 rounded-full">
            Coming Soon
          </span>
        )}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );

  if (comingSoon) {
    return <div className="block">{content}</div>;
  }

  return (
    <Link href={path.startsWith('/') ? path : `/tools/${toolPath}`} className="block">
      {content}
    </Link>
  );
}
