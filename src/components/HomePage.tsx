'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { DocumentArrowUpIcon, ArrowPathIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: <DocumentArrowUpIcon className="w-12 h-12" />,
    title: 'Easy To Use',
    description: 'Simple and intuitive interface for all your PDF needs'
  },
  {
    icon: <ArrowPathIcon className="w-12 h-12" />,
    title: 'Fast Processing',
    description: 'Quick and efficient conversion of your documents'
  },
  {
    icon: <ShieldCheckIcon className="w-12 h-12" />,
    title: 'Secure',
    description: 'Your files are processed securely and deleted after conversion'
  }
];

const popularTools = [
  {
    name: 'PDF to Word',
    href: '/tools/convert',
    description: 'Convert PDF to editable Word documents',
    icon: '📝'
  },
  {
    name: 'Images to PDF',
    href: '/tools/convert',
    description: 'Convert images to PDF format',
    icon: '🖼️'
  },
  {
    name: 'Merge PDFs',
    href: '/tools/merge',
    description: 'Combine multiple PDF files into one document',
    icon: '🔄'
  }
];

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              {t('home.title')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              {t('home.subtitle')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/tools"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {t('home.getStarted')}
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
              >
                {t('common.about')} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t('home.features')}
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center text-center">
                  <div className="mb-6 text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </div>
                  <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Popular Tools Section */}
      <div className="bg-white dark:bg-gray-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t('tools.pageTitle')}
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {popularTools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="flex flex-col bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-blue-500 dark:hover:ring-blue-400 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {tool.name}
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}