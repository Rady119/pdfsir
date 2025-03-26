'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts, type BlogPost } from '@/types/blog';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type Category = BlogPost['category'];

const categories = {
  all: {
    ar: 'جميع المقالات',
    en: 'All Posts'
  },
  tutorial: {
    ar: 'شروحات',
    en: 'Tutorials'
  },
  feature: {
    ar: 'مميزات',
    en: 'Features'
  },
  guide: {
    ar: 'أدلة',
    en: 'Guides'
  },
  update: {
    ar: 'تحديثات',
    en: 'Updates'
  }
};

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'ar' | 'en';

  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 mt-8">

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLang === 'ar' ? 'المدونة' : 'Blog'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {currentLang === 'ar' 
              ? 'اكتشف أحدث المقالات والأدلة حول منصتنا وأدواتها'
              : 'Discover the latest articles and guides about our platform and tools'
            }
          </p>
        </div>

        {/* Categories */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(categories).map(([key, labels]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as Category | 'all')}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === key
                    ? 'bg-yellow-400 text-gray-900 shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-700'
                }`}
              >
                {labels[currentLang]}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.translations[currentLang].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <span className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                  {categories[post.category][currentLang]}
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-yellow-500 dark:group-hover:text-yellow-400">
                  {post.translations[currentLang].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {post.translations[currentLang].excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US')}</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <ClockIcon className="h-4 w-4" />
                    <span>
                      {post.readingTime} {currentLang === 'ar' ? 'دقائق' : 'minutes'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}