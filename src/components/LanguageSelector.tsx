import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const languages = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  },
  {
    code: 'ar',
    name: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl'
  },
  {
    code: 'hi',
    name: 'हिंदी',
    flag: '🇮🇳',
    dir: 'ltr'
  },
  {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳',
    dir: 'ltr'
  }
]

export function LanguageSelector() {
  const router = useRouter()
  const { i18n } = useTranslation()
  
  const changeLanguage = useCallback((lang: string) => {
    const selectedLang = languages.find(l => l.code === lang)
    if (selectedLang) {
      document.documentElement.dir = selectedLang.dir
      i18n.changeLanguage(lang)
      document.cookie = `NEXT_LOCALE=${lang}; path=/`
      router.refresh()
    }
  }, [router, i18n])

  return (
    <div className="relative">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="appearance-none bg-transparent border rounded-lg px-3 py-2 pl-10 pr-8 dark:bg-gray-700 dark:text-white cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="flex items-center gap-2">
            {`${lang.flag} ${lang.name}`}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        {languages.find(l => l.code === i18n.language)?.flag}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}
