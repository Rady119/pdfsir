'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { DocumentIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const tools = [
  {
    id: 'convert-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF documents to editable Word files',
    icon: '📝',
    href: '/tools/convert',
    status: 'active',
    color: 'blue'
  },
  {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    description: 'Convert JPG and PNG images to PDF format',
    icon: '🖼️',
    href: '/tools/convert',
    status: 'active',
    color: 'green'
  },
  {
    id: 'merge',
    name: 'Merge PDFs',
    description: 'Combine multiple PDF files into one document',
    icon: '🔄',
    href: '/tools/merge',
    status: 'active',
    color: 'purple'
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Extract pages or split PDF into multiple files',
    icon: '✂️',
    href: '/tools/split',
    status: 'coming',
    color: 'orange'
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    icon: '🗜️',
    href: '/tools/compress',
    status: 'coming',
    color: 'red'
  },
  {
    id: 'sign',
    name: 'Sign PDF',
    description: 'Add digital signatures to your PDF documents',
    icon: '✍️',
    href: '/tools/sign',
    status: 'coming',
    color: 'indigo'
  }
];

export default function ToolsPage() {
  const { t } = useTranslation();

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {t('tools.active')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {t('common.comingSoon')}
      </span>
    );
  };

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
      green: 'hover:bg-green-50 dark:hover:bg-green-900/20',
      purple: 'hover:bg-purple-50 dark:hover:bg-purple-900/20',
      orange: 'hover:bg-orange-50 dark:hover:bg-orange-900/20',
      red: 'hover:bg-red-50 dark:hover:bg-red-900/20',
      indigo: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mt-6 mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('tools.pageTitle')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('tools.pageDescription')}
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group ${
                getColorClass(tool.color)
              } transition-all duration-300`}
            >
              <div className="p-6">
                <div className="text-3xl mb-4">{tool.icon}</div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {tool.name}
                  </h3>
                  {getStatusBadge(tool.status)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {tool.description}
                </p>
                {tool.status === 'active' ? (
                  <Link
                    href={tool.href}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {t('tools.tryNow')}
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">
                    {t('tools.notifyMe')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Premium Features Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">{t('tools.unlockPremium')}</h2>
          <p className="mb-6 max-w-2xl mx-auto">{t('tools.premiumDescription')}</p>
          <Link
            href="/pricing"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {t('tools.viewPlans')}
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}