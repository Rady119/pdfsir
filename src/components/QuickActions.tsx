'use client';

import {
  ArrowUpTrayIcon,
  DocumentDuplicateIcon,
  DocumentPlusIcon,
  ScissorsIcon,
  Square2StackIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface QuickActionProps {
  onAction: (type: string) => void;
}

export function QuickActions({ onAction }: QuickActionProps) {
  const { t } = useTranslation();

  const actions = [
    {
      id: 'compress',
      icon: ArrowUpTrayIcon,
      title: t('Actions.Compress'),
      description: t('actions.compressDesc'),
      color: 'blue'
    },
    {
      id: 'convert',
      icon: DocumentDuplicateIcon,
      title: t('Actions.Convert'),
      description: t('actions.convertDesc'),
      color: 'green'
    },
    {
      id: 'merge',
      icon: Square2StackIcon,
      title: t('Actions.Merge'),
      description: t('actions.mergeDesc'),
      color: 'purple'
    },
    {
      id: 'split',
      icon: ScissorsIcon,
      title: t('Actions.Split'),
      description: t('actions.splitDesc'),
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const classes = {
      blue: 'bg-blue-50 text-blue-600 ring-blue-500/10 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30',
      green: 'bg-green-50 text-green-600 ring-green-500/10 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30',
      purple: 'bg-purple-50 text-purple-600 ring-purple-500/10 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30',
      orange: 'bg-orange-50 text-orange-600 ring-orange-500/10 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30'
    };
    return classes[color as keyof typeof classes];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className={`relative flex flex-col items-center rounded-lg p-6 ring-1 ring-inset transition-all duration-200 ${getColorClasses(action.color)}`}
        >
          <div className="mb-4">
            <action.icon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold">{action.title}</h3>
          <p className="mt-2 text-sm opacity-75 text-center">
            {action.description}
          </p>
        </button>
      ))}
    </div>
  );
}