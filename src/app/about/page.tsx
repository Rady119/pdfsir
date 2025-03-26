'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';

const features = [
  {
    icon: '📄',
    title: 'PDF Conversion',
    description: 'Convert PDFs to various formats and back with high accuracy'
  },
  {
    icon: '🔒',
    title: 'Secure Processing',
    description: 'Your files are processed securely and deleted after conversion'
  },
  {
    icon: '⚡',
    title: 'Fast Processing',
    description: 'Advanced algorithms ensure quick conversions'
  },
  {
    icon: '🌐',
    title: 'Multi-language Support',
    description: 'Available in English, Arabic, Hindi, and Chinese'
  }
];

const tools = [
  {
    name: 'PDF to Word',
    status: 'active',
    icon: '📝'
  },
  {
    name: 'Image to PDF',
    status: 'active',
    icon: '🖼️'
  },
  {
    name: 'PDF Merge',
    status: 'coming',
    icon: '🔄'
  },
  {
    name: 'PDF Split',
    status: 'coming',
    icon: '✂️'
  },
  {
    name: 'PDF Compress',
    status: 'coming',
    icon: '🗜️'
  },
  {
    name: 'PDF Sign',
    status: 'coming',
    icon: '✍️'
  }
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 mt-32">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('about.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('about.description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Tools Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {t('about.tools')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4"
              >
                <div className="text-2xl">{tool.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {tool.name}
                  </h3>
                  {tool.status === 'coming' && (
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      {t('common.comingSoon')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('about.trust')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('about.trustDescription')}
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">100K+</div>
              <div className="text-gray-600 dark:text-gray-300">
                {t('about.monthlyUsers')}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">500K+</div>
              <div className="text-gray-600 dark:text-gray-300">
                {t('about.filesProcessed')}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600 dark:text-gray-300">
                {t('about.uptime')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}