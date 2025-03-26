import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  common: {
    tools: 'Tools',
    pricing: 'Pricing',
    about: 'About',
    dashboard: 'Dashboard',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    comingSoon: 'Coming Soon',
    followUs: 'Follow Us'
  },
  home: {
    title: 'Transform Your PDFs with Ease',
    subtitle: 'Professional PDF tools for everyone. Convert, compress, merge and more.',
    aboutSection: 'Professional PDF processing tools to help you work more efficiently.',
    features: 'Features',
    getStarted: 'Get Started'
  },
  tools: {
    pageTitle: 'PDF Tools',
    pageDescription: 'Professional tools to work with your PDF files',
    active: 'Active',
    tryNow: 'Try Now',
    notifyMe: 'Notify me when available',
    unlockPremium: 'Unlock Premium Features',
    premiumDescription: 'Get access to all tools and advanced features with our premium plans',
    viewPlans: 'View Plans',
    merge: {
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into a single document'
    },
    split: {
      title: 'Split PDF',
      description: 'Split your PDF into separate documents'
    },
    compress: {
      title: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality'
    },
    convert: {
      title: 'Convert PDF',
      description: 'Convert between PDF and other formats'
    }
  },
  subscription: {
    choosePlan: 'Choose Your Plan',
    choosePlanDescription: 'Select the plan that best fits your needs',
    monthly: 'Monthly',
    yearly: 'Yearly',
    mo: 'mo',
    yr: 'yr',
    free: 'Free',
    premium: 'Premium',
    enterprise: 'Enterprise',
    popular: 'Most Popular',
    startFree: 'Start Free',
    subscribe: 'Subscribe Now',
    contactUs: 'Contact Us'
  },
  about: {
    title: 'About PDF Processor',
    description: 'Professional PDF processing tools to help you work more efficiently',
    trust: 'Trusted by Users Worldwide',
    trustDescription: 'Join thousands of satisfied users who trust our tools for their PDF needs',
    tools: 'Our Tools',
    monthlyUsers: 'Monthly Users',
    filesProcessed: 'Files Processed',
    uptime: 'Uptime'
  }
};

// Arabic translations
const arTranslations = {
  common: {
    tools: 'الأدوات',
    pricing: 'الأسعار',
    about: 'عن الموقع',
    dashboard: 'لوحة التحكم',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    signOut: 'تسجيل الخروج',
    comingSoon: 'قريباً',
    followUs: 'تابعنا'
  },
  home: {
    title: 'حول ملفات PDF بسهولة',
    subtitle: 'أدوات PDF احترافية للجميع. حول، اضغط، ادمج والمزيد.',
    aboutSection: 'أدوات معالجة PDF احترافية لمساعدتك على العمل بكفاءة أكبر.',
    features: 'المميزات',
    getStarted: 'ابدأ الآن'
  },
  tools: {
    pageTitle: 'أدوات PDF',
    pageDescription: 'أدوات احترافية للعمل مع ملفات PDF',
    active: 'متاح',
    tryNow: 'جرب الآن',
    notifyMe: 'أخبرني عند التوفر',
    unlockPremium: 'احصل على المميزات المتقدمة',
    premiumDescription: 'احصل على وصول لجميع الأدوات والميزات المتقدمة مع خططنا المميزة',
    viewPlans: 'عرض الخطط',
    merge: {
      title: 'دمج ملفات PDF',
      description: 'دمج عدة ملفات PDF في مستند واحد'
    },
    split: {
      title: 'تقسيم PDF',
      description: 'تقسيم ملف PDF إلى مستندات منفصلة'
    },
    compress: {
      title: 'ضغط PDF',
      description: 'تقليل حجم ملف PDF مع الحفاظ على الجودة'
    },
    convert: {
      title: 'تحويل PDF',
      description: 'التحويل بين PDF والتنسيقات الأخرى'
    }
  },
  subscription: {
    choosePlan: 'اختر خطتك',
    choosePlanDescription: 'اختر الخطة التي تناسب احتياجاتك',
    monthly: 'شهري',
    yearly: 'سنوي',
    mo: 'شهر',
    yr: 'سنة',
    free: 'مجاني',
    premium: 'بريميوم',
    enterprise: 'للشركات',
    popular: 'الأكثر طلباً',
    startFree: 'ابدأ مجاناً',
    subscribe: 'اشترك الآن',
    contactUs: 'اتصل بنا'
  },
  about: {
    title: 'عن موقعنا',
    description: 'أدوات معالجة PDF احترافية لمساعدتك على العمل بكفاءة أكبر',
    trust: 'موثوق به عالمياً',
    trustDescription: 'انضم إلى آلاف المستخدمين الراضين الذين يثقون بأدواتنا لاحتياجات PDF',
    tools: 'أدواتنا',
    monthlyUsers: 'مستخدم شهرياً',
    filesProcessed: 'ملف تمت معالجته',
    uptime: 'وقت التشغيل'
  }
};

// Hindi translations
const hiTranslations = {
  common: {
    tools: 'टूल्स',
    pricing: 'कीमत',
    about: 'हमारे बारे में',
    dashboard: 'डैशबोर्ड',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    signOut: 'साइन आउट',
    comingSoon: 'जल्द आ रहा है',
    followUs: 'हमें फॉलो करें'
  },
  home: {
    title: 'आसानी से PDF फ़ाइलें बदलें',
    subtitle: 'सभी के लिए पेशेवर PDF टूल्स। कन्वर्ट, कंप्रेस, मर्ज और बहुत कुछ।',
    aboutSection: 'अधिक कुशलता से काम करने में आपकी मदद के लिए पेशेवर PDF प्रोसेसिंग टूल्स।',
    features: 'विशेषताएं',
    getStarted: 'शुरू करें'
  },
  tools: {
    pageTitle: 'PDF टूल्स',
    pageDescription: 'PDF फ़ाइलों के साथ काम करने के लिए पेशेवर टूल्स',
    active: 'सक्रिय',
    tryNow: 'अभी आज़माएं',
    notifyMe: 'उपलब्ध होने पर सूचित करें',
    unlockPremium: 'प्रीमियम सुविधाएं खोलें',
    premiumDescription: 'हमारी प्रीमियम योजनाओं के साथ सभी टूल्स और उन्नत सुविधाओं तक पहुंच प्राप्त करें',
    viewPlans: 'योजनाएं देखें',
    merge: {
      title: 'PDF मर्ज',
      description: 'कई PDF फ़ाइलों को एक दस्तावेज़ में मिलाएं'
    },
    split: {
      title: 'PDF विभाजन',
      description: 'PDF को अलग-अलग दस्तावेज़ों में विभाजित करें'
    },
    compress: {
      title: 'PDF कंप्रेस',
      description: 'गुणवत्ता बनाए रखते हुए PDF फ़ाइल का आकार कम करें'
    },
    convert: {
      title: 'PDF कन्वर्ट',
      description: 'PDF और अन्य फॉर्मेट के बीच कन्वर्ट करें'
    }
  },
  subscription: {
    choosePlan: 'अपनी योजना चुनें',
    choosePlanDescription: 'अपनी जरूरतों के अनुसार सबसे उपयुक्त योजना चुनें',
    monthly: 'मासिक',
    yearly: 'वार्षिक',
    mo: 'माह',
    yr: 'वर्ष',
    free: 'मुफ्त',
    premium: 'प्रीमियम',
    enterprise: 'एंटरप्राइज',
    popular: 'सबसे लोकप्रिय',
    startFree: 'मुफ्त शुरू करें',
    subscribe: 'अभी सब्सक्राइब करें',
    contactUs: 'संपर्क करें'
  },
  about: {
    title: 'PDF प्रोसेसर के बारे में',
    description: 'अधिक कुशलता से काम करने में आपकी मदद के लिए पेशेवर PDF प्रोसेसिंग टूल्स',
    trust: 'दुनिया भर में विश्वसनीय',
    trustDescription: 'हजारों संतुष्ट उपयोगकर्ताओं से जुड़ें जो अपनी PDF जरूरतों के लिए हमारे टूल्स पर भरोसा करते हैं',
    tools: 'हमारे टूल्स',
    monthlyUsers: 'मासिक उपयोगकर्ता',
    filesProcessed: 'प्रोसेस की गई फ़ाइलें',
    uptime: 'अपटाइम'
  }
};

// Chinese translations
const zhTranslations = {
  common: {
    tools: '工具',
    pricing: '价格',
    about: '关于',
    dashboard: '控制台',
    signIn: '登录',
    signUp: '注册',
    signOut: '退出',
    comingSoon: '即将推出',
    followUs: '关注我们'
  },
  home: {
    title: '轻松转换PDF文件',
    subtitle: '适合所有人的专业PDF工具。转换、压缩、合并等。',
    aboutSection: '专业的PDF处理工具，帮助您提高工作效率。',
    features: '功能特点',
    getStarted: '立即开始'
  },
  tools: {
    pageTitle: 'PDF工具',
    pageDescription: '专业的PDF文件处理工具',
    active: '可用',
    tryNow: '立即尝试',
    notifyMe: '开放时通知我',
    unlockPremium: '解锁高级功能',
    premiumDescription: '通过我们的高级计划获取所有工具和高级功能',
    viewPlans: '查看计划',
    merge: {
      title: '合并PDF',
      description: '将多个PDF文件合并为一个文档'
    },
    split: {
      title: '拆分PDF',
      description: '将PDF拆分为多个文档'
    },
    compress: {
      title: '压缩PDF',
      description: '在保持质量的同时减小PDF文件大小'
    },
    convert: {
      title: '转换PDF',
      description: 'PDF与其他格式之间的转换'
    }
  },
  subscription: {
    choosePlan: '选择您的计划',
    choosePlanDescription: '选择最适合您需求的计划',
    monthly: '月付',
    yearly: '年付',
    mo: '月',
    yr: '年',
    free: '免费',
    premium: '高级',
    enterprise: '企业版',
    popular: '最受欢迎',
    startFree: '免费开始',
    subscribe: '立即订阅',
    contactUs: '联系我们'
  },
  about: {
    title: '关于PDF处理器',
    description: '专业的PDF处理工具，帮助您提高工作效率',
    trust: '全球用户信赖',
    trustDescription: '加入数千名信任我们工具的满意用户',
    tools: '我们的工具',
    monthlyUsers: '月活用户',
    filesProcessed: '已处理文件',
    uptime: '运行时间'
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      ar: { translation: arTranslations },
      hi: { translation: hiTranslations },
      zh: { translation: zhTranslations }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
