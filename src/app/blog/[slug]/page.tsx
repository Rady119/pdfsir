'use client';

import { useParams } from 'next/navigation';
import { blogPosts } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, ClockIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { BlogImage } from '@/components/BlogImage';

const categories = {
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

export default function BlogPostPage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'ar' | 'en';
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLang === 'ar' ? 'المقال غير موجود' : 'Post Not Found'}
          </h1>
          <Link 
            href="/blog"
            className="text-yellow-500 hover:text-yellow-600 flex items-center justify-center gap-2"
          >
            <ArrowLongRightIcon className="h-5 w-5" />
            {currentLang === 'ar' ? 'العودة إلى المدونة' : 'Return to Blog'}
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    currentLang === 'ar' ? 'ar-SA' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  const renderContent = (content: typeof post.translations[typeof currentLang]['content']) => {
    return content.map((item, index) => {
      switch (item.type) {
        case 'paragraph':
          return (
            <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {item.content}
            </p>
          );
        case 'heading':
          return (
            <h3 key={index} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-4">
              {item.content}
            </h3>
          );
        case 'list-item':
          return (
            <li key={index} className="text-gray-600 dark:text-gray-300 ml-6">
              {item.content}
            </li>
          );
        case 'image':
          return (
            <BlogImage
              key={index}
              src={item.content}
              alt={item.caption || ''}
              caption={item.caption}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src={post.coverImage}
          alt={post.translations[currentLang].title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 w-full p-8">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-medium mb-4">
              {categories[post.category][currentLang]}
            </span>
            <h1 className="text-4xl font-bold text-white mb-4">
              {post.translations[currentLang].title}
            </h1>
            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                <span>
                  {post.readingTime} {currentLang === 'ar' ? 'دقائق قراءة' : 'minutes read'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="prose prose-lg dark:prose-invert rtl:prose-p:text-right max-w-none">
            {renderContent(post.translations[currentLang].content)}
          </div>
        </div>

        {/* Author */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4">
            <Image
              src={post.author.image}
              alt={post.author.name[currentLang]}
              width={60}
              height={60}
              className="rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {post.author.name[currentLang]}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {currentLang === 'ar' ? 'كاتب محتوى ومحرر تقني' : 'Content Writer & Technical Editor'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}