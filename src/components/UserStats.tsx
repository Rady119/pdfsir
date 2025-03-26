'use client';

import { UserProfile } from '@/types';
import {
  ChartPieIcon,
  DocumentDuplicateIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface UserStatsProps {
  profile: UserProfile;
}

export function UserStats({ profile }: UserStatsProps) {
  const { t } = useTranslation();
  
  const formatStorage = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  const usagePercentage = (profile.usedStorage / profile.usageLimit) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Storage Usage */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <ChartPieIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ltr:ml-4 rtl:mr-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('StorageUsage')}
            </h3>
            <div className="mt-1">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatStorage(profile.usedStorage)} / {formatStorage(profile.usageLimit)}
              </p>
              <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plan */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="ltr:ml-4 rtl:mr-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('CurrentPlan')}
            </h3>
            <div className="mt-1">
              <p className="text-2xl font-semibold capitalize text-gray-900 dark:text-white">
                {profile.subscription}
              </p>
              {profile.subscription === 'free' && (
                <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500">
                  {t('UpgradePlan')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Total Files */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DocumentDuplicateIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="ltr:ml-4 rtl:mr-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('TotalFiles')}
            </h3>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {profile.totalFiles || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}