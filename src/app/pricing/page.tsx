'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Link from 'next/link';

const features = {
  free: [
    'Convert PDF to Word',
    'Convert Images to PDF',
    'Max file size: 10MB',
    'Basic support',
    '2 conversions per day'
  ],
  premium: [
    'All Free features',
    'No file size limit',
    'Unlimited conversions',
    'Priority support',
    'Batch processing',
    'No watermark',
    'Cloud storage integration'
  ],
  enterprise: [
    'All Premium features',
    'Custom API access',
    'Dedicated support',
    'Custom integration',
    'Team management',
    'Usage analytics',
    'SLA guarantee'
  ]
};

export default function PricingPage() {
  const { t } = useTranslation();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const prices = {
    premium: {
      monthly: 9.99,
      yearly: 99.99
    },
    enterprise: {
      monthly: 49.99,
      yearly: 499.99
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('subscription.choosePlan')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('subscription.choosePlanDescription')}
          </p>

          {/* Billing period toggle */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-lg ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {t('subscription.monthly')}
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-lg ${
                billingPeriod === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {t('subscription.yearly')}
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('subscription.free')}
            </h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              $0
              <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                /forever
              </span>
            </p>
            <ul className="space-y-4 mb-8">
              {features.free.map((feature) => (
                <li key={feature} className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signup"
              className="block w-full text-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t('subscription.startFree')}
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-blue-500">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                {t('subscription.popular')}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('subscription.premium')}
            </h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              ${prices.premium[billingPeriod]}
              <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                /{billingPeriod === 'monthly' ? t('subscription.mo') : t('subscription.yr')}
              </span>
            </p>
            <ul className="space-y-4 mb-8">
              {features.premium.map((feature) => (
                <li key={feature} className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 transition-colors">
              {t('subscription.subscribe')}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('subscription.enterprise')}
            </h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              ${prices.enterprise[billingPeriod]}
              <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                /{billingPeriod === 'monthly' ? t('subscription.mo') : t('subscription.yr')}
              </span>
            </p>
            <ul className="space-y-4 mb-8">
              {features.enterprise.map((feature) => (
                <li key={feature} className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="block w-full text-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t('subscription.contactUs')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}