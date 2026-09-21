// Sammie Digital Studio - Clean Pure JavaScript Engine
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getFirestore, collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';

// 1. Firebase & Cloud Firestore Setup
const firebaseConfig = {
  projectId: "digital-wharf-4c9s2",
  appId: "1:519949529809:web:14b3168b20044703e30bf0",
  apiKey: "AIzaSyAieVLQaXaiglSwy-8ZMZYWsrgh90-oMRw",
  authDomain: "digital-wharf-4c9s2.firebaseapp.com",
  storageBucket: "digital-wharf-4c9s2.firebasestorage.app",
  messagingSenderId: "519949529809"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the studio database ID
const db = getFirestore(app, "ai-studio-sammiedigitalstu-d0267da7-ad4a-4e5d-b71b-6a0163321355");

// Firestore Error Handler & Operation Types
const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || false,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// 2. Multilingual Dictionary (7 Country-Level Languages)
const translations = {
  en: {
    langLabel: "English",
    flag: "🇺🇸",
    navAbout: "About",
    navServices: "Services",
    navPortfolio: "Portfolio",
    navProcess: "Process",
    navFaq: "FAQ",
    navQuote: "Get Quote",
    heroBadge: "Sammie Digital Studio • Nigeria and worldwide",
    heroTitlePrefix: "We Build ",
    heroTitleHighlight: "Digital Experiences",
    heroTitleSuffix: " That Help Businesses Grow",
    heroSubtitle: "Modern websites, branding, and digital solutions designed to give businesses, organizations, and individuals a strong and credible online presence.",
    getStarted: "Get Started",
    requestQuote: "Request Quote",
    readyForProjects: "Ready for new projects",
    heroCardDesc: "Professional digital studio providing website development, graphic design, branding, and social media management.",
    lagosWorldwide: "Nigeria and worldwide",
    pillar1Title: "Precision Web Engineering",
    pillar1Desc: "Fully responsive, modern websites engineered to build credibility and perform seamlessly on phones, tablets, and desktop computers.",
    pillar2Title: "Distinctive Visual Design",
    pillar2Desc: "Striking promotional flyers, memorable logo marks, and cohesive branding guidelines crafted to capture audience attention.",
    pillar3Title: "Direct Client Collaboration",
    pillar3Desc: "Personalized attention from our studio team with quick communication via WhatsApp, reliable revisions, and prompt delivery.",
    aboutTitle: "About Sammie Digital Studio",
    aboutSub: "Dedicated to Elevating Businesses & Organizations Online",
    servicesTitle: "Our Core Services",
    servicesSub: "Tailored creative and technical solutions designed to help your brand stand out.",
    webDevTitle: "Website Development",
    webDevDesc: "High-converting, responsive websites engineered with clean architecture to build immediate credibility on any screen.",
    graphicDesignTitle: "Graphic Design & Flyers",
    graphicDesignDesc: "Eye-catching church flyers, event announcements, and corporate marketing materials delivered in print-ready and digital formats.",
    logoDesignTitle: "Logo Design",
    logoDesignDesc: "Distinctive and memorable logo marks tailored to encapsulate your company's mission and unique value proposition.",
    brandingTitle: "Branding & Identity",
    brandingDesc: "Comprehensive brand identity design, encompassing typography pairings, custom color systems, and usage guidelines.",
    socialMediaTitle: "Social Media Management",
    socialMediaDesc: "Strategic content planning, graphic asset creation, post scheduling, and brand consistency across Instagram and TikTok.",
    processTitle: "How We Work",
    processSub: "A seamless, collaborative process from initial concept to final delivery.",
    portfolioTitle: "Our Works",
    portfolioSub: "Explore our curated selection of high-impact websites, brand designs, and creative flyers.",
    allProjects: "All Works",
    websitesFilter: "Websites",
    flyersFilter: "Flyers",
    brandingFilter: "Logos & Brands",
    socialFilter: "Social Media",
    ctaReadyTitle: "Ready to Build Your Website or Flyer Design?",
    ctaReadySub: "Contact Sammie Digital Studio today for professional website development, branding, graphic design, and social media management services.",
    requestQuoteBtn: "Request Quote",
    directLineNote: "Direct Line & WhatsApp: 08168874826 • Nigeria and worldwide"
  },
  fr: {
    langLabel: "Français",
    flag: "🇫🇷",
    navAbout: "À Propos",
    navServices: "Services",
    navPortfolio: "Portfolio",
    navProcess: "Processus",
    navFaq: "FAQ",
    navQuote: "Devis",
    heroBadge: "Sammie Digital Studio • Nigeria and worldwide",
    heroTitlePrefix: "Nous Créons des ",
    heroTitleHighlight: "Expériences Numériques",
    heroTitleSuffix: " qui Font Grandir les Entreprises",
    heroSubtitle: "Sites web modernes, identités de marque et solutions numériques conçus pour offrir aux entreprises et églises une visibilité crédible et puissante.",
    getStarted: "Commencer",
    requestQuote: "Demander un Devis",
    readyForProjects: "Disponible pour nouveaux projets",
    heroCardDesc: "Studio numérique professionnel spécialisé en création de sites internet, design graphique, logos et réseaux sociaux.",
    lagosWorldwide: "Nigeria and worldwide",
    pillar1Title: "Ingénierie Web Précise",
    pillar1Desc: "Des sites web fluides et responsives créés pour inspirer confiance sur tous les écrans.",
    pillar2Title: "Design Visuel Distinctif",
    pillar2Desc: "Affiches percutantes, flyers d'église et identités de marque captivantes.",
    pillar3Title: "Collaboration Directe",
    pillar3Desc: "Accompagnement personnalisé par WhatsApp, révisions réactives et livraisons rapides.",
    aboutTitle: "À Propos de Sammie Digital Studio",
    aboutSub: "Dédié au Rayonnement Numérique des Entreprises",
    servicesTitle: "Nos Services Principaux",
    servicesSub: "Des solutions créatives et technologiques pour vous démarquer.",
    webDevTitle: "Développement Web",
    webDevDesc: "Sites vitrines et professionnels fluides, modernes et sécurisés.",
    graphicDesignTitle: "Design Graphique & Affiches",
    graphicDesignDesc: "Flyers d'église, bannières d'événements et supports promotionnels.",
    logoDesignTitle: "Création de Logos",
    logoDesignDesc: "Logos uniques et mémorables pour ancrer votre image de marque.",
    brandingTitle: "Identité de Marque",
    brandingDesc: "Typographies, palettes de couleurs et chartes graphiques complètes.",
    socialMediaTitle: "Gestion Réseaux Sociaux",
    socialMediaDesc: "Création de publications, stratégie de marque et gestion de communauté.",
    processTitle: "Notre Méthode",
    processSub: "Un processus collaboratif fluide du concept initial à la livraison finale.",
    portfolioTitle: "Nos Réalisations",
    portfolioSub: "Découvrez notre sélection de sites web, identités de marque et affiches créatives.",
    allProjects: "Tous les Projets",
    websitesFilter: "Sites Web",
    flyersFilter: "Affiches",
    brandingFilter: "Logos & Marques",
    socialFilter: "Réseaux Sociaux",
    ctaReadyTitle: "Prêt à Créer Votre Site Web ou Vos Affiches ?",
    ctaReadySub: "Contactez Sammie Digital Studio dès aujourd'hui pour des services professionnels de création web et de design graphique.",
    requestQuoteBtn: "Demander un Devis",
    directLineNote: "Ligne directe et WhatsApp : 08168874826 • Nigeria and worldwide"
  },
  es: {
    langLabel: "Español",
    flag: "🇪🇸",
    navAbout: "Nosotros",
    navServices: "Servicios",
    navPortfolio: "Portafolio",
    navProcess: "Proceso",
    navFaq: "FAQ",
    navQuote: "Cotizar",
    heroBadge: "Sammie Digital Studio • Nigeria and worldwide",
    heroTitlePrefix: "Construimos ",
    heroTitleHighlight: "Experiencias Digitales",
    heroTitleSuffix: " que Impulsan tu Negocio",
    heroSubtitle: "Sitios web modernos, identidad de marca y soluciones digitales diseñadas para dar a empresas y organizaciones una presencia sólida y creíble.",
    getStarted: "Comenzar Ahora",
    requestQuote: "Solicitar Cotización",
    readyForProjects: "Disponible para nuevos proyectos",
    heroCardDesc: "Estudio digital profesional especializado en desarrollo web, diseño gráfico de flyers, logotipos y redes sociales.",
    lagosWorldwide: "Nigeria and worldwide",
    pillar1Title: "Ingeniería Web de Precisión",
    pillar1Desc: "Sitios web modernos y rápidos diseñados para generar confianza y funcionar en cualquier dispositivo.",
    pillar2Title: "Diseño Visual Distintivo",
    pillar2Desc: "Flyers para eventos e iglesias y logotipos inolvidables.",
    pillar3Title: "Colaboración Directa",
    pillar3Desc: "Atención personalizada con comunicación ágil vía WhatsApp y entregas confiables.",
    aboutTitle: "Sobre Sammie Digital Studio",
    aboutSub: "Dedicados a Elevar Empresas y Organizaciones en Internet",
    servicesTitle: "Nuestros Servicios",
    servicesSub: "Soluciones creativas y técnicas hechas a la medida de tu marca.",
    webDevTitle: "Desarrollo de Páginas Web",
    webDevDesc: "Sitios web responsivos de alto impacto para potenciar tus ventas.",
    graphicDesignTitle: "Diseño Gráfico & Flyers",
    graphicDesignDesc: "Flyers de alta calidad para iglesias, eventos y empresas.",
    logoDesignTitle: "Diseño de Logotipos",
    logoDesignDesc: "Identidades visuales memorables que diferencian tu negocio.",
    brandingTitle: "Identidad de Marca",
    brandingDesc: "Sistemas de color, tipografía y manuales de marca completos.",
    socialMediaTitle: "Gestión de Redes Sociales",
    socialMediaDesc: "Estrategia de contenidos, creatividades y publicaciones periódicas.",
    processTitle: "Cómo Trabajamos",
    processSub: "Un proceso colaborativo paso a paso desde la idea hasta la entrega.",
    portfolioTitle: "Nuestros Trabajos",
    portfolioSub: "Explora nuestra selección de sitios web modernos, identidades de marca y diseños gráficos.",
    allProjects: "Todos",
    websitesFilter: "Sitios Web",
    flyersFilter: "Flyers",
    brandingFilter: "Logos & Marcas",
    socialFilter: "Redes Sociales",
    ctaReadyTitle: "¿Listo para Crear tu Sitio Web o Flyer?",
    ctaReadySub: "Contacta hoy con Sammie Digital Studio para desarrollo web profesional y diseño gráfico de primer nivel.",
    requestQuoteBtn: "Solicitar Cotización",
    directLineNote: "Línea directa y WhatsApp: 08168874826 • Nigeria and worldwide"
  },
  de: {
    langLabel: "Deutsch",
    flag: "🇩🇪",
    navAbout: "Über uns",
    navServices: "Leistungen",
    navPortfolio: "Portfolio",
    navProcess: "Ablauf",
    navFaq: "FAQ",
    navQuote: "Angebot",
    heroBadge: "Sammie Digital Studio • Nigeria and worldwide",
    heroTitlePrefix: "Wir Erschaffen ",
    heroTitleHighlight: "Digitale Erlebnisse",
    heroTitleSuffix: " für Nachhaltiges Wachstum",
    heroSubtitle: "Moderne Websites, Markenidentitäten und digitale Lösungen, die Unternehmen und Organisationen einen überzeugenden Online-Auftritt verleihen.",
    getStarted: "Jetzt Starten",
    requestQuote: "Angebot Anfragen",
    readyForProjects: "Bereit für neue Projekte",
    heroCardDesc: "Professionelles Digitalstudio für Webentwicklung, Flyer-Design, Logos und Social-Media-Betreuung.",
    lagosWorldwide: "Nigeria and worldwide",
    pillar1Title: "Präzise Webentwicklung",
    pillar1Desc: "Reaktionsschnelle Websites, die Vertrauen schaffen und auf allen Endgeräten blitzschnell laden.",
    pillar2Title: "Unverwechselbares Design",
    pillar2Desc: "Auffällige Flyer, markante Logos und professionelle Markenrichtlinien.",
    pillar3Title: "Direkte Zusammenarbeit",
    pillar3Desc: "Persönlicher Service mit schneller WhatsApp-Kommunikation und verlässlicher Lieferung.",
    aboutTitle: "Über Sammie Digital Studio",
    aboutSub: "Ihr Partner für erfolgreiche digitale Markenführung",
    servicesTitle: "Unsere Kernleistungen",
    servicesSub: "Maßgeschneiderte digitale Lösungen für Ihr Unternehmen.",
    webDevTitle: "Webentwicklung",
    webDevDesc: "Moderne, responsive Unternehmens-Websites mit hoher Konversion.",
    graphicDesignTitle: "Grafikdesign & Flyer",
    graphicDesignDesc: "Hochwertige Flyer für Events, Kirchen und Unternehmen.",
    logoDesignTitle: "Logo-Entwicklung",
    logoDesignDesc: "Einzigartige Logos mit hohem Wiedererkennungswert.",
    brandingTitle: "Markenidentität",
    brandingDesc: "Farbsysteme, Typografie und professionelle Markenführung.",
    socialMediaTitle: "Social-Media-Management",
    socialMediaDesc: "Gezielter Content-Aufbau und Betreuung Ihrer Kanäle.",
    processTitle: "Unser Arbeitsprozess",
    processSub: "Von der ersten Idee bis zum fertigen Projekt zuverlässig an Ihrer Seite.",
    portfolioTitle: "Unsere Arbeiten",
    portfolioSub: "Entdecken Sie unsere ausgewählten Webseiten, Markenidentitäten und kreativen Flyer.",
    allProjects: "Alle Arbeiten",
    websitesFilter: "Websites",
    flyersFilter: "Flyer",
    brandingFilter: "Logos & Marken",
    socialFilter: "Social Media",
    ctaReadyTitle: "Bereit für Ihre neue Website oder Grafik?",
    ctaReadySub: "Kontaktieren Sie Sammie Digital Studio noch heute für erstklassige Web- und Design-Dienstleistungen.",
    requestQuoteBtn: "Angebot Anfragen",
    directLineNote: "Direktkontakt & WhatsApp: 08168874826 • Nigeria and worldwide"
  },
  pt: {
    langLabel: "Português",
    flag: "🇧🇷",
    navAbout: "Sobre",
    navServices: "Serviços",
    navPortfolio: "Portfólio",
    navProcess: "Processo",
    navFaq: "FAQ",
    navQuote: "Orçamento",
    heroBadge: "Sammie Digital Studio • Nigeria and worldwide",
    heroTitlePrefix: "Criamos ",
    heroTitleHighlight: "Experiências Digitais",
    heroTitleSuffix: " que Fazem Seu Negócio Crescer",
    heroSubtitle: "Websites modernos, identidade de marca e soluções digitais criadas para dar a empresas e organizações uma presença online confiável e impactante.",
    getStarted: "Começar Agora",
    requestQuote: "Solicitar Orçamento",
    readyForProjects: "Disponível para novos projetos",
    heroCardDesc: "Estúdio digital especializado em desenvolvimento web, design de flyers, logotipos e mídias sociais.",
    lagosWorldwide: "Nigeria and worldwide",
    pillar1Title: "Engenharia Web de Precisão",
    pillar1Desc: "Sites modernos e fluidos projetados para construir credibilidade em celulares e computadores.",
    pillar2Title: "Design Visual Marcante",
    pillar2Desc: "Flyers para eventos e igrejas e logomarcas inesquecíveis.",
    pillar3Title: "Colaboração Direta",
    pillar3Desc: "Atenção personalizada com comunicação rápida via WhatsApp e entregas pontuais.",
    aboutTitle: "Sobre o Sammie Digital Studio",
    aboutSub: "Dedicados a Elevar Negócios e Organizações na Internet",
    servicesTitle: "Nossos Serviços",
    servicesSub: "Soluções criativas e tecnológicas feitas sob medida.",
    webDevTitle: "Desenvolvimento de Websites",
    webDevDesc: "Sites modernos, rápidos e adaptados para impulsionar seus resultados.",
    graphicDesignTitle: "Design Gráfico & Flyers",
    graphicDesignDesc: "Flyers para igrejas, eventos e marcas corporativas.",
    logoDesignTitle: "Criação de Logotipos",
    logoDesignDesc: "Logotipos marcantes e exclusivos para a sua empresa.",
    brandingTitle: "Identidade de Marca",
    brandingDesc: "Manuais de marca completos com tipografias e paletas de cores.",
    socialMediaTitle: "Gestão de Redes Sociais",
    socialMediaDesc: "Criação de conteúdos, artes visuais e estratégias de engajamento.",
    processTitle: "Como Trabalhamos",
    processSub: "Um processo transparente e ágil do planejamento à entrega final.",
    portfolioTitle: "Nosso Portfólio",
    portfolioSub: "Explore nossa seleção de websites, identidades de marca e designs exclusivos.",
    allProjects: "Todos",
    websitesFilter: "Websites",
    flyersFilter: "Flyers",
    brandingFilter: "Logos & Marcas",
    socialFilter: "Redes Sociais",
    ctaReadyTitle: "Pronto para Criar seu Site ou Flyer?",
    ctaReadySub: "Fale com o Sammie Digital Studio hoje mesmo para serviços profissionais de web design e criação visual.",
    requestQuoteBtn: "Solicitar Orçamento",
    directLineNote: "Linha direta e WhatsApp: 08168874826 • Nigeria and worldwide"
  },
  ar: {
    langLabel: "العربية",
    flag: "🇸🇦",
    navAbout: "عن الاستوديو",
    navServices: "الخدمات",
    navPortfolio: "الأعمال",
    navProcess: "خطوات العمل",
    navFaq: "الأسئلة",
    navQuote: "طلب سعر",
    heroBadge: "استوديو سامي الرقمي • Nigeria and worldwide",
    heroTitlePrefix: "نحن نصنع ",
    heroTitleHighlight: "تجارب رقمية استثنائية",
    heroTitleSuffix: " تساعد الشركات على النمو والازدهار",
    heroSubtitle: "مواقع إلكترونية حديثة، هويات بصرية وحلول رقمية مصممة لتعزيز حضور الشركات والمؤسسات بثقة ومصداقية عبر الإنترنت.",
    getStarted: "ابدأ الآن",
    requestQuote: "طلب عرض سعر",
    readyForProjects: "جاهزون لاستقبال مشاريع جديدة",
    heroCardDesc: "استوديو رقمي محترف متخصص في برمجة المواقع الإلكترونية، تصميم المنشورات الإعلانية، الشعارات وإدارة حسابات التواصل.",
    lagosWorldwide: "Nigeria and worldwide",
    pillar1Title: "هندسة ويب احترافية",
    pillar1Desc: "مواقع عصرية فائقة السرعة ومتوافقة مع الهواتف الذكية والأجهزة اللوحية والكمبيوتر.",
    pillar2Title: "تصاميم بصرية فريدة",
    pillar2Desc: "منشورات إعلانية لافتة وشعارات متميزة وهوية متكاملة تخلد في الأذهان.",
    pillar3Title: "تواصل مباشر وموثوق",
    pillar3Desc: "خدمة شخصية متفانية مع تواصل سريع ومباشر عبر واتساب وتسليم دقيق.",
    aboutTitle: "عن استوديو سامي الرقمي",
    aboutSub: "ملتزمون بالارتقاء بالشركات والمؤسسات إلى الصدارة الرقمية",
    servicesTitle: "خدماتنا الأساسية",
    servicesSub: "حلول تقنية وإبداعية مصممة خصيصاً لنمو أعمالك.",
    webDevTitle: "تطوير وبرمجة المواقع",
    webDevDesc: "مواقع احترافية متجاوبة وعالية السرعة لتحقيق أفضل معدلات التحويل.",
    graphicDesignTitle: "التصميم الجرافيكي والإعلانات",
    graphicDesignDesc: "تصاميم فلاير للمناسبات، الكنائس والمؤسسات بصيغ جاهزة للطباعة والنشر.",
    logoDesignTitle: "تصميم الشعارات",
    logoDesignDesc: "شعارات معبرة ومميزة تلخص رؤية علامتك التجارية.",
    brandingTitle: "الهوية البصرية المتكاملة",
    brandingDesc: "أدلة الهوية واختيار الألوان والخطوط المتناسقة.",
    socialMediaTitle: "إدارة وسائل التواصل الاجتماعي",
    socialMediaDesc: "تخطيط المحتوى وتصميم المنشورات وإدارة التفاعل.",
    processTitle: "كيف نعمل",
    processSub: "خطوات واضحة تبدأ من الفكرة وتصل إلى الإطلاق الناجح.",
    portfolioTitle: "معرض أعمالنا",
    portfolioSub: "استعرض مجموعة مختارة من أفضل مواقعنا الإلكترونية وهوياتنا البصرية وتصاميمنا المميزة.",
    allProjects: "كافة الأعمال",
    websitesFilter: "المواقع",
    flyersFilter: "الفلايرات",
    brandingFilter: "الشعارات",
    socialFilter: "التواصل",
    ctaReadyTitle: "جاهز لتنفيذ موقعك أو تصميمك القادم؟",
    ctaReadySub: "تواصل مع استوديو سامي الرقمي اليوم للحصول على أفضل الخدمات الرقمية.",
    requestQuoteBtn: "طلب عرض سعر",
    directLineNote: "الاتصال المباشر وواتساب: 08168874826 • Nigeria and worldwide"
  },
  pcm: {
    langLabel: "Pidgin",
    flag: "🇳🇬",
    navAbout: "About Us",
    navServices: "Services",
    navPortfolio: "Works",
    navProcess: "How We Dey Work",
    navFaq: "FAQ",
    navQuote: "Ask Price",
    heroBadge: "Sammie Digital Studio • Nigeria and worldwide",
    heroTitlePrefix: "We Dey Build ",
    heroTitleHighlight: "Solid Digital Experiences",
    heroTitleSuffix: " Wey Dey Help Business Blow",
    heroSubtitle: "Modern websites, clean branding, and sharp flyers wey dey make businesses, churches, schools, and organizations get solid respect for internet.",
    getStarted: "Start Now",
    requestQuote: "Ask for Price",
    readyForProjects: "Ready to take new projects now",
    heroCardDesc: "Solid digital studio wey dey build responsive websites, sharp flyers, clean logos, and manage social media pages.",
    lagosWorldwide: "Nigeria and worldwide",
    pillar1Title: "Solid Website Engineering",
    pillar1Desc: "Clean, fast-loading websites wey dey show well for any phone, tablet, or laptop computer.",
    pillar2Title: "Sharp Graphic Flyer & Logo Design",
    pillar2Desc: "Flyers for church programs, businesses, and clean logos wey go make people take you serious.",
    pillar3Title: "Direct WhatsApp Communication",
    pillar3Desc: "Direct chat with our studio team on WhatsApp. Fast response, quick updates, and clean delivery.",
    aboutTitle: "About Sammie Digital Studio",
    aboutSub: "We Dey Help Businesses and Churches Stand Strong Online",
    servicesTitle: "Wetin We Dey Do",
    servicesSub: "Proper creative and technical solutions wey go push your brand forward.",
    webDevTitle: "Website Development",
    webDevDesc: "Clean and fast responsive websites wey dey show sharp for any phone.",
    graphicDesignTitle: "Graphic Design & Church Flyers",
    graphicDesignDesc: "Sharp flyers for Sunday services, conferences, crusades, and corporate events.",
    logoDesignTitle: "Logo Design",
    logoDesignDesc: "Solid logos wey dey show the real value of your business.",
    brandingTitle: "Full Brand Identity",
    brandingDesc: "Color guide, clean typography, and full branding system.",
    socialMediaTitle: "Social Media Handling",
    socialMediaDesc: "Daily posting, flyer designs, and managing your Instagram and TikTok pages.",
    processTitle: "How We Dey Do Am",
    processSub: "Clear 4-step work from the first discussion till we deliver your project sharp.",
    portfolioTitle: "Our Previous Works",
    portfolioSub: "See sample of the clean websites, sharp flyers, and solid brand designs wey we don build.",
    allProjects: "All Works",
    websitesFilter: "Websites",
    flyersFilter: "Flyers",
    brandingFilter: "Logos & Brands",
    socialFilter: "Social Media",
    ctaReadyTitle: "Ready Make We Build Your Website or Design Your Flyer?",
    ctaReadySub: "Holla Sammie Digital Studio today for proper website development, branding, graphic design, and social media handling.",
    requestQuoteBtn: "Ask for Price",
    directLineNote: "Direct Line & WhatsApp: 08168874826 • Nigeria and worldwide"
  }
};

// Language State
let currentLang = localStorage.getItem('sammie_lang') || 'en';
if (!translations[currentLang]) currentLang = 'en';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('sammie_lang', lang);
  const data = translations[lang] || translations['en'];

  const flagEl = document.getElementById('currentFlag');
  if (flagEl) flagEl.textContent = data.flag;
  const langLabelEl = document.getElementById('currentLangLabel');
  if (langLabelEl) langLabelEl.textContent = data.langLabel;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (data[key]) {
      el.textContent = data[key];
    }
  });

  document.querySelectorAll('.lang-item').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

// Language Dropdown Handling
const langBtn = document.getElementById('langBtn');
const langMenu = document.getElementById('langMenu');

if (langBtn && langMenu) {
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langMenu.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    langMenu.classList.remove('open');
  });

  document.querySelectorAll('.lang-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyLanguage(btn.getAttribute('data-lang'));
      langMenu.classList.remove('open');
    });
  });
}

// ============================================================================
// 3. Official Portfolio Gallery (Exclusively Populates #portfolioGrid via Cloud Firestore)
// ============================================================================
const portfolioGrid = document.getElementById('portfolioGrid');
let allPortfolioItems = [];
let currentPortfolioFilter = 'all';

// Default Starter Artworks using standardized vector assets
const starterItems = [
  {
    id: 'starter_1',
    title: 'Church Conference Flyer',
    category: 'flyers',
    description: 'Dynamic event publicity flyer designed for Sunday praise service.',
    image: '/assets/images/flyer-church.svg',
    link: 'https://wa.me/2348168874826?text=Hello%20Samuel,%20I%20saw%20your%20Church%20Conference%20Flyer'
  },
  {
    id: 'starter_2',
    title: 'Digital Studio Corporate Web',
    category: 'websites',
    description: 'High-speed business website with dark mode and WhatsApp bookings.',
    image: '/assets/images/web-portfolio.svg',
    link: 'https://github.com/samadeniran15'
  },
  {
    id: 'starter_3',
    title: 'Modern Brand Identity & Emblem',
    category: 'branding',
    description: 'Minimalist logo mark and typography system for technology studio.',
    image: '/assets/images/brand-identity.svg',
    link: 'https://instagram.com/sammiedigitalstudio'
  },
  {
    id: 'starter_4',
    title: 'Social Media Event Campaign',
    category: 'social',
    description: 'Instagram and WhatsApp status promotional flyers for annual youth conference.',
    image: '/assets/images/flyer-studio.svg',
    link: 'https://wa.me/2348168874826?text=Hello%20Samuel,%20I%20want%20a%20social%20media%20campaign%20design'
  }
];

function getCategoryLabel(category) {
  switch (category) {
    case 'websites': return 'Websites & Apps';
    case 'flyers': return 'Graphic Design & Flyers';
    case 'branding': return 'Logos & Brand Identity';
    case 'social': return 'Social Media Design';
    default: return 'Studio Work';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders portfolio cards strictly into the intended #portfolioGrid container.
 * Guaranteed not to inject, alter, or manipulate any other page sections.
 */
function renderPortfolio(items, filter = currentPortfolioFilter) {
  if (!portfolioGrid) {
    console.error('Target portfolio gallery element (#portfolioGrid) is missing from DOM.');
    return;
  }

  currentPortfolioFilter = filter;
  portfolioGrid.innerHTML = '';

  const activeItems = Array.isArray(items) && items.length > 0 ? items : starterItems;
  const filtered = filter === 'all' 
    ? activeItems 
    : activeItems.filter((item) => item.category === filter);

  if (filtered.length === 0) {
    portfolioGrid.innerHTML = `
      <div class="loading-spinner">
        <p>No artworks found in this category.</p>
        <button class="btn btn-outline btn-sm" style="margin-top: 1rem;" id="resetFilterBtn">View All Works</button>
      </div>
    `;
    const resetBtn = document.getElementById('resetFilterBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) allBtn.classList.add('active');
        renderPortfolio(activeItems, 'all');
      });
    }
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    const allImages = Array.isArray(item.images) && item.images.length > 0 
      ? item.images 
      : (item.image ? [item.image] : ['/assets/images/flyer-studio.svg']);
    const imgSrc = allImages[0] || item.image || '/assets/images/flyer-studio.svg';
    const catLabel = getCategoryLabel(item.category);
    const safeTitle = escapeHtml(item.title);
    const safeDesc = escapeHtml(item.description || 'Crafted with precision by Sammie Digital Studio.');
    const projectLink = item.link || item.externalUrl || '';

    card.innerHTML = `
      <div class="portfolio-img-wrap">
        <img src="${imgSrc}" alt="${safeTitle}" class="portfolio-img" loading="lazy" />
        ${allImages.length > 1 ? `
          <div class="portfolio-photo-count-pill">
            <span>📷</span>
            <span>${allImages.length} Photos</span>
          </div>
        ` : ''}
        <div class="portfolio-overlay">
          <span class="portfolio-zoom-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <span>View Artwork</span>
          </span>
        </div>
      </div>
      <div class="portfolio-info">
        <div class="portfolio-category-badge">${catLabel}</div>
        <h4 class="portfolio-title">${safeTitle}</h4>
        <p class="portfolio-desc">${safeDesc}</p>
        ${projectLink ? `
          <a href="${escapeHtml(projectLink)}" target="_blank" rel="noopener noreferrer" class="portfolio-external-pill" onclick="event.stopPropagation();">
            <span>🌐</span>
            <span>Visit Live Project &rarr;</span>
          </a>
        ` : ''}
      </div>
    `;

    // Click to enlarge in lightbox (passes all photos for carousel)
    card.addEventListener('click', () => {
      openLightbox(allImages, item.title, item.description, item.category, projectLink);
    });

    portfolioGrid.appendChild(card);
  });
}

// Portfolio Loading Animation Controller
let portfolioLoadingTimeout = null;

/**
 * Renders an animated loading spinner state inside #portfolioGrid.
 */
function showPortfolioLoading(customText = 'Loading studio portfolio...') {
  if (!portfolioGrid) return;
  if (portfolioLoadingTimeout) {
    clearTimeout(portfolioLoadingTimeout);
    portfolioLoadingTimeout = null;
  }
  portfolioGrid.innerHTML = `
    <div class="loading-spinner" role="status" aria-live="polite">
      <div class="spinner-ring"></div>
      <p class="spinner-text">${escapeHtml(customText)}</p>
    </div>
  `;
}

/**
 * Triggers the loading state before rendering the portfolio items.
 * Ensures that clicking the portfolio link or filter displays the loader first.
 */
function loadAndRenderPortfolio(items, filter = currentPortfolioFilter, delay = 450, loadingMessage = 'Loading studio portfolio...') {
  if (!portfolioGrid) return;
  showPortfolioLoading(loadingMessage);

  if (portfolioLoadingTimeout) {
    clearTimeout(portfolioLoadingTimeout);
  }

  portfolioLoadingTimeout = setTimeout(() => {
    renderPortfolio(items, filter);
  }, delay);
}

// Initial render with realistic animated studio loading state
loadAndRenderPortfolio(starterItems, 'all', 500, 'Loading studio portfolio...');

// Listen for clicks on any Portfolio navigation links (desktop nav, mobile menu, footer)
// Fulfills: "if you click on the link, it has to load before the main portfolio appears"
document.querySelectorAll('a[href="#portfolio"]').forEach((link) => {
  link.addEventListener('click', () => {
    const items = allPortfolioItems.length > 0 ? allPortfolioItems : starterItems;
    loadAndRenderPortfolio(items, currentPortfolioFilter, 450, 'Loading studio portfolio...');
  });
});

let initialFirestoreSnapshotReceived = false;

// Real-time Cloud Firestore listener
// Scoped exclusively to the 'portfolio' collection and #portfolioGrid gallery
try {
  const portfolioCol = collection(db, 'portfolio');
  onSnapshot(portfolioCol, (snapshot) => {
    if (!snapshot.empty) {
      const items = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.title) {
          items.push({
            id: docSnap.id,
            title: data.title,
            category: data.category || 'flyers',
            description: data.description || '',
            image: data.image || '/assets/images/flyer-studio.svg',
            createdAt: data.createdAt || null
          });
        }
      });

      // Sort newest first
      items.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });

      allPortfolioItems = items.length > 0 ? items : starterItems;

      if (!initialFirestoreSnapshotReceived) {
        initialFirestoreSnapshotReceived = true;
        // Smoothly display after initial load
        loadAndRenderPortfolio(allPortfolioItems, currentPortfolioFilter, 400, 'Loading studio portfolio...');
      } else {
        renderPortfolio(allPortfolioItems, currentPortfolioFilter);
      }

      if (typeof renderAdminWorksList === 'function') {
        renderAdminWorksList();
      }
      console.log('✅ Real-time portfolio loaded from Cloud Firestore into #portfolioGrid:', items.length, 'artworks');
    } else {
      // Empty Firestore collection: use starter items
      allPortfolioItems = starterItems;
      initialFirestoreSnapshotReceived = true;
      renderPortfolio(starterItems, currentPortfolioFilter);
      if (typeof renderAdminWorksList === 'function') {
        renderAdminWorksList();
      }
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, 'portfolio');
    console.warn('Firestore live listener offline or using cache:', err.message);
  });
} catch (err) {
  console.warn('Firestore setup error:', err);
}

// Portfolio filter pills with tactile loading transitions
document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter') || 'all';
    currentPortfolioFilter = filter;
    const catLabel = filter === 'all' ? 'studio portfolio' : getCategoryLabel(filter);
    const items = allPortfolioItems.length > 0 ? allPortfolioItems : starterItems;
    loadAndRenderPortfolio(items, filter, 320, `Loading ${catLabel}...`);
  });
});

// 4. FAQ Accordion
document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));

    // Toggle current item
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

// 5. Lightbox Modal (Multi-Image Carousel Supported)
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightboxBtn = document.getElementById('closeLightboxBtn');
const lightboxWaBtn = document.getElementById('lightboxWaBtn');
const lightboxQuoteBtn = document.getElementById('lightboxQuoteBtn');
const lightboxProjectBtn = document.getElementById('lightboxProjectBtn');
const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
const lightboxNextBtn = document.getElementById('lightboxNextBtn');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxThumbs = document.getElementById('lightboxThumbs');

let currentLightboxItem = null;
let currentLightboxImages = [];
let currentLightboxIndex = 0;

function updateLightboxView() {
  if (!lightboxImg || currentLightboxImages.length === 0) return;
  const currentSrc = currentLightboxImages[currentLightboxIndex] || '/assets/images/flyer-studio.svg';
  lightboxImg.src = currentSrc;

  const total = currentLightboxImages.length;
  if (total > 1) {
    if (lightboxPrevBtn) lightboxPrevBtn.style.display = 'flex';
    if (lightboxNextBtn) lightboxNextBtn.style.display = 'flex';
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${total}`;
      lightboxCounter.style.display = 'block';
    }
    if (lightboxThumbs) {
      lightboxThumbs.style.display = 'flex';
      const thumbButtons = lightboxThumbs.querySelectorAll('.lightbox-thumb-btn');
      thumbButtons.forEach((btn, idx) => {
        if (idx === currentLightboxIndex) {
          btn.classList.add('active');
          btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
          btn.classList.remove('active');
        }
      });
    }
  } else {
    if (lightboxPrevBtn) lightboxPrevBtn.style.display = 'none';
    if (lightboxNextBtn) lightboxNextBtn.style.display = 'none';
    if (lightboxCounter) lightboxCounter.style.display = 'none';
    if (lightboxThumbs) lightboxThumbs.style.display = 'none';
  }
}

function prevLightboxImage() {
  if (currentLightboxImages.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
  updateLightboxView();
}

function nextLightboxImage() {
  if (currentLightboxImages.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
  updateLightboxView();
}

function openLightbox(imagesInput, title, desc, category, link = null) {
  if (!lightboxModal) return;
  
  const imgs = Array.isArray(imagesInput) 
    ? imagesInput.filter(Boolean) 
    : (imagesInput ? [imagesInput] : []);
  currentLightboxImages = imgs.length > 0 ? imgs : ['/assets/images/flyer-studio.svg'];
  currentLightboxIndex = 0;
  currentLightboxItem = { images: currentLightboxImages, title, desc, category, link };

  // Render thumbnail strip if multi-image
  if (lightboxThumbs) {
    lightboxThumbs.innerHTML = '';
    if (currentLightboxImages.length > 1) {
      currentLightboxImages.forEach((thumbSrc, idx) => {
        const thumbBtn = document.createElement('button');
        thumbBtn.type = 'button';
        thumbBtn.className = `lightbox-thumb-btn ${idx === 0 ? 'active' : ''}`;
        thumbBtn.setAttribute('aria-label', `View photo ${idx + 1}`);
        thumbBtn.innerHTML = `<img src="${thumbSrc}" alt="Thumbnail ${idx + 1}" loading="lazy" />`;
        thumbBtn.addEventListener('click', () => {
          currentLightboxIndex = idx;
          updateLightboxView();
        });
        lightboxThumbs.appendChild(thumbBtn);
      });
    }
  }

  updateLightboxView();

  lightboxCaption.innerHTML = `<h3 class="lightbox-title">${title}</h3><p class="lightbox-sub">${desc || ''}</p>`;

  if (lightboxProjectBtn) {
    if (link) {
      lightboxProjectBtn.href = link;
      lightboxProjectBtn.style.display = 'inline-flex';
    } else {
      lightboxProjectBtn.style.display = 'none';
    }
  }
  
  if (lightboxWaBtn) {
    const waText = `Hello Sammie Digital Studio! I saw your portfolio work "${title}" (${category || 'design'}) on your website and I'd like to get something similar done for my business/organization.`;
    lightboxWaBtn.href = `https://wa.me/2348168874826?text=${encodeURIComponent(waText)}`;
  }

  lightboxModal.classList.add('open');
}

if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightboxImage);
if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightboxImage);

function closeLightbox() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove('open');
}

if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
if (lightboxModal) {
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });
}

if (lightboxQuoteBtn) {
  lightboxQuoteBtn.addEventListener('click', () => {
    closeLightbox();
    if (currentLightboxItem) {
      const detailsField = document.getElementById('quoteDetails');
      const serviceField = document.getElementById('quoteService');
      if (detailsField) {
        detailsField.value = `I am interested in a project similar to "${currentLightboxItem.title}".`;
      }
      if (serviceField && currentLightboxItem.category) {
        if (currentLightboxItem.category === 'websites') serviceField.value = 'website';
        else if (currentLightboxItem.category === 'flyers') serviceField.value = 'flyer';
        else if (currentLightboxItem.category === 'branding') serviceField.value = 'logo';
        else if (currentLightboxItem.category === 'social') serviceField.value = 'social';
      }
    }
    openModal();
  });
}

// 6. Fast Quote Modal & WhatsApp Submission
const quoteModal = document.getElementById('quoteModal');
const closeQuoteBtn = document.getElementById('closeQuoteBtn');
const headerQuoteBtn = document.getElementById('headerQuoteBtn');
const openQuoteBtnHero = document.getElementById('openQuoteBtnHero');
const openQuoteBtnCta = document.getElementById('openQuoteBtnCta');
const quoteForm = document.getElementById('quoteForm');

function openModal() { if (quoteModal) quoteModal.classList.add('open'); }
function closeModal() { if (quoteModal) quoteModal.classList.remove('open'); }

if (headerQuoteBtn) headerQuoteBtn.addEventListener('click', openModal);
if (openQuoteBtnHero) openQuoteBtnHero.addEventListener('click', openModal);
if (openQuoteBtnCta) openQuoteBtnCta.addEventListener('click', openModal);
if (closeQuoteBtn) closeQuoteBtn.addEventListener('click', closeModal);

if (quoteModal) {
  quoteModal.addEventListener('click', (e) => {
    if (e.target === quoteModal) closeModal();
  });
}

if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const service = document.getElementById('quoteService').value;
    const name = document.getElementById('quoteName').value;
    const phone = document.getElementById('quotePhone').value;
    const details = document.getElementById('quoteDetails').value;

    const message = `Hello Sammie Digital Studio!%0A%0AI would like to request a quote:%0A- *Service:* ${encodeURIComponent(service)}%0A- *Client Name:* ${encodeURIComponent(name)}%0A- *Phone/WhatsApp:* ${encodeURIComponent(phone)}%0A- *Project Details:* ${encodeURIComponent(details)}%0A%0APlease let me know your rates and timeline.`;

    window.open(`https://wa.me/2348168874826?text=${message}`, '_blank');
    closeModal();
    quoteForm.reset();
  });
}

// 7. Mobile Navigation Drawer & Menu Controls
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const closeMobileNavBtn = document.getElementById('closeMobileNavBtn');
const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
const mobileQuoteBtn = document.getElementById('mobileQuoteBtn');

function openMobileNav() {
  if (mobileNav) {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
  }
  if (mobileMenuBtn) {
    mobileMenuBtn.classList.add('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  }
  document.body.classList.add('nav-open');
}

function closeMobileNav() {
  if (mobileNav) {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
  }
  if (mobileMenuBtn) {
    mobileMenuBtn.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }
  document.body.classList.remove('nav-open');
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    if (mobileNav && mobileNav.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });
}

if (closeMobileNavBtn) closeMobileNavBtn.addEventListener('click', closeMobileNav);
if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);

// Close mobile drawer when any link or mobile logo is clicked
const mobileLogoLink = document.getElementById('mobileLogoLink');
if (mobileLogoLink) {
  mobileLogoLink.addEventListener('click', closeMobileNav);
}

document.querySelectorAll('.mobile-nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    closeMobileNav();
  });
});

if (mobileQuoteBtn) {
  mobileQuoteBtn.addEventListener('click', () => {
    closeMobileNav();
    openModal();
  });
}

// 8. Active Nav Link on Scroll Spy
const sections = document.querySelectorAll('section[id]');
function updateActiveNavLink() {
  const scrollY = window.pageYOffset;
  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 120;
    const sectionId = current.getAttribute('id');
    const desktopLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
    const mobileLink = document.querySelector(`.mobile-nav-link[href*="${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      if (desktopLink) {
        document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
        desktopLink.classList.add('active');
      }
      if (mobileLink) {
        document.querySelectorAll('.mobile-nav-link').forEach((l) => l.classList.remove('active'));
        mobileLink.classList.add('active');
      }
    }
  });
}
window.addEventListener('scroll', updateActiveNavLink);

// 9. Back to Top Button
const backToTopBtn = document.getElementById('backToTopBtn');
window.addEventListener('scroll', () => {
  if (backToTopBtn) {
    backToTopBtn.style.display = window.scrollY > 400 ? 'inline-flex' : 'none';
  }
});
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 10. PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// 11. Full-Screen Studio Admin Portal (#admin) & Firebase Auth/Firestore Management
const adminModal = document.getElementById('adminModal');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const footerAdminLink = document.getElementById('footerAdminLink');
const adminAuthSection = document.getElementById('adminAuthSection');
const adminDashboardSection = document.getElementById('adminDashboardSection');
const adminPasscodeForm = document.getElementById('adminPasscodeForm');
const adminPasscodeInput = document.getElementById('adminPasscodeInput');
const togglePasscodeVisibility = document.getElementById('togglePasscodeVisibility');
const adminSignOutBtn = document.getElementById('adminSignOutBtn');
const adminAuthStatus = document.getElementById('adminAuthStatus');
const adminAddWorkForm = document.getElementById('adminAddWorkForm');
const adminFormStatus = document.getElementById('adminFormStatus');
const adminWorksList = document.getElementById('adminWorksList');
const adminWorksCount = document.getElementById('adminWorksCount');
const adminPortalStatusChip = document.getElementById('adminPortalStatusChip');

// Picture Upload & Admin Workspace Elements
const workFileInput = document.getElementById('workFileInput');
const workDropzone = document.getElementById('workDropzone');
const workImageInput = document.getElementById('workImage');
const addUrlImageBtn = document.getElementById('addUrlImageBtn');
const workLinkInput = document.getElementById('workLink');
const photosCountBadge = document.getElementById('photosCountBadge');
const workMultiImagePreviewBox = document.getElementById('workMultiImagePreviewBox');
const previewCountLabel = document.getElementById('previewCountLabel');
const addMoreImagesBtn = document.getElementById('addMoreImagesBtn');
const workMultiPreviewGrid = document.getElementById('workMultiPreviewGrid');
const editWorkIdInput = document.getElementById('editWorkId');
const adminFormCardTitle = document.getElementById('adminFormCardTitle');
const adminFormCardSub = document.getElementById('adminFormCardSub');
const adminSubmitWorkBtn = document.getElementById('adminSubmitWorkBtn');
const adminCancelEditBtn = document.getElementById('adminCancelEditBtn');
const adminFormContainer = document.getElementById('adminFormContainer');

const MASTER_PASSCODE = 'Adekunle2008';
const OWNER_EMAIL = 'samadeniran15@gmail.com';
let isMasterAuthenticated = false;
let selectedImages = []; // Array of Base64 or URL strings

// Render Multi-Image Preview Grid in Admin Form
function updateMultiImageUI() {
  const total = selectedImages.length;
  if (photosCountBadge) {
    photosCountBadge.textContent = total === 1 ? '1 picture added' : `${total} pictures added`;
  }
  if (previewCountLabel) {
    previewCountLabel.textContent = total;
  }

  if (total > 0) {
    if (workMultiImagePreviewBox) workMultiImagePreviewBox.style.display = 'block';
  } else {
    if (workMultiImagePreviewBox) workMultiImagePreviewBox.style.display = 'none';
  }

  if (workMultiPreviewGrid) {
    workMultiPreviewGrid.innerHTML = '';
    selectedImages.forEach((imgSrc, idx) => {
      const card = document.createElement('div');
      card.className = 'multi-preview-card';
      card.innerHTML = `
        <div class="multi-preview-img-wrap">
          <img src="${imgSrc}" alt="Photo ${idx + 1}" loading="lazy" />
          ${idx === 0 ? '<span class="multi-preview-cover-badge">COVER</span>' : ''}
          <button type="button" class="multi-preview-remove-btn" data-idx="${idx}" title="Remove this photo">&times;</button>
        </div>
      `;

      const removeBtn = card.querySelector('.multi-preview-remove-btn');
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          removeImageAt(idx);
        });
      }

      workMultiPreviewGrid.appendChild(card);
    });
  }
}

function removeImageAt(index) {
  if (index >= 0 && index < selectedImages.length) {
    selectedImages.splice(index, 1);
    updateMultiImageUI();
  }
}

function clearAllImages() {
  selectedImages = [];
  updateMultiImageUI();
  if (workFileInput) workFileInput.value = '';
  if (workImageInput) workImageInput.value = '';
}

// Picture compression helper (Processes single or multiple files)
function processImageFiles(fileList) {
  if (!fileList || fileList.length === 0) return;

  const files = Array.from(fileList);
  const remainingSlots = 10 - selectedImages.length;
  if (remainingSlots <= 0) {
    if (adminFormStatus) {
      adminFormStatus.className = 'admin-status-msg error';
      adminFormStatus.textContent = 'Maximum of 10 pictures per artwork reached.';
      adminFormStatus.style.display = 'block';
    }
    return;
  }

  const toProcess = files.slice(0, remainingSlots);

  toProcess.forEach((file) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target.result;

      // If SVG, push directly
      if (file.type === 'image/svg+xml') {
        selectedImages.push(rawDataUrl);
        updateMultiImageUI();
        return;
      }

      // Optimize raster images using Canvas
      const img = new Image();
      img.onload = () => {
        const maxDim = 1100;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedUrl = canvas.toDataURL('image/jpeg', 0.82);
        selectedImages.push(compressedUrl);
        updateMultiImageUI();
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

// Add direct URL image button handler
if (addUrlImageBtn && workImageInput) {
  addUrlImageBtn.addEventListener('click', () => {
    const url = workImageInput.value.trim();
    if (!url) return;
    if (selectedImages.length >= 10) {
      alert('Maximum of 10 pictures reached for this project.');
      return;
    }
    selectedImages.push(url);
    workImageInput.value = '';
    updateMultiImageUI();
  });
}

// Add More Images button handler
if (addMoreImagesBtn && workFileInput) {
  addMoreImagesBtn.addEventListener('click', () => {
    workFileInput.click();
  });
}

// Dropzone and file input handlers
if (workDropzone) {
  workDropzone.addEventListener('click', () => {
    if (workFileInput) workFileInput.click();
  });
  workDropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (workFileInput) workFileInput.click();
    }
  });

  ['dragenter', 'dragover'].forEach((eventName) => {
    workDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      workDropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    workDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      workDropzone.classList.remove('dragover');
    });
  });

  workDropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFiles(e.dataTransfer.files);
    }
  });
}

if (workFileInput) {
  workFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFiles(e.target.files);
    }
  });
}

// Cancel Editing Mode and restore Add New form
function resetAdminForm() {
  if (editWorkIdInput) editWorkIdInput.value = '';
  if (adminAddWorkForm) adminAddWorkForm.reset();
  clearAllImages();
  if (adminFormCardTitle) adminFormCardTitle.textContent = '✨ Add New Portfolio Artwork';
  if (adminFormCardSub) adminFormCardSub.textContent = 'Upload flyer graphics, web screenshots, and include direct project links.';
  if (adminSubmitWorkBtn) adminSubmitWorkBtn.textContent = '🚀 Publish to Live Portfolio';
  if (adminCancelEditBtn) adminCancelEditBtn.style.display = 'none';
  if (adminFormStatus) {
    adminFormStatus.style.display = 'none';
    adminFormStatus.textContent = '';
  }
}

if (adminCancelEditBtn) {
  adminCancelEditBtn.addEventListener('click', resetAdminForm);
}

function showAdminModal() {
  if (adminModal) {
    adminModal.classList.add('open');
    if (window.location.hash !== '#admin') {
      history.pushState(null, '', '#admin');
    }
    // Always prompt for password on open for security
    if (!isMasterAuthenticated) {
      if (adminAuthSection) adminAuthSection.style.display = 'block';
      if (adminDashboardSection) adminDashboardSection.style.display = 'none';
      if (adminPortalStatusChip) {
        adminPortalStatusChip.className = 'admin-status-chip locked';
        adminPortalStatusChip.textContent = '🔒 Passcode Protected';
      }
      if (adminPasscodeInput) {
        adminPasscodeInput.value = '';
        setTimeout(() => adminPasscodeInput.focus(), 150);
      }
    } else {
      if (adminPortalStatusChip) {
        adminPortalStatusChip.className = 'admin-status-chip unlocked';
        adminPortalStatusChip.textContent = '🔓 Studio Full Access';
      }
      renderAdminWorksList();
    }
  }
}

function hideAdminModal() {
  if (adminModal) {
    adminModal.classList.remove('open');
    // Lock the dashboard every time modal is closed so password is always required next time
    isMasterAuthenticated = false;
    clearSelectedImage();
    if (adminAuthSection) adminAuthSection.style.display = 'block';
    if (adminDashboardSection) adminDashboardSection.style.display = 'none';
    if (adminPortalStatusChip) {
      adminPortalStatusChip.className = 'admin-status-chip locked';
      adminPortalStatusChip.textContent = '🔒 Passcode Protected';
    }
    if (adminPasscodeInput) adminPasscodeInput.value = '';
    if (adminAuthStatus) {
      adminAuthStatus.style.display = 'none';
      adminAuthStatus.textContent = '';
    }

    if (window.location.hash === '#admin') {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
  }
}

// Check URL Hash for #admin
function checkHashRoute() {
  if (window.location.hash === '#admin') {
    showAdminModal();
  }
}

window.addEventListener('hashchange', checkHashRoute);
window.addEventListener('load', checkHashRoute);

if (footerAdminLink) {
  footerAdminLink.addEventListener('click', (e) => {
    e.preventDefault();
    showAdminModal();
  });
}

if (closeAdminBtn) {
  closeAdminBtn.addEventListener('click', hideAdminModal);
}

// Keyboard navigation for modals and lightbox
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideAdminModal();
    if (lightboxModal) lightboxModal.classList.remove('open');
    if (quoteModal) quoteModal.classList.remove('open');
  } else if (lightboxModal && lightboxModal.classList.contains('open')) {
    if (e.key === 'ArrowLeft') {
      prevLightboxImage();
    } else if (e.key === 'ArrowRight') {
      nextLightboxImage();
    }
  }
});

// Toggle password visibility
if (togglePasscodeVisibility && adminPasscodeInput) {
  togglePasscodeVisibility.addEventListener('click', () => {
    if (adminPasscodeInput.type === 'password') {
      adminPasscodeInput.type = 'text';
      togglePasscodeVisibility.textContent = '🔒';
    } else {
      adminPasscodeInput.type = 'password';
      togglePasscodeVisibility.textContent = '👁️';
    }
  });
}

// Handle Passcode Submission
if (adminPasscodeForm) {
  adminPasscodeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = adminPasscodeInput ? adminPasscodeInput.value.trim() : '';

    if (!adminAuthStatus) return;

    if (entered === MASTER_PASSCODE) {
      isMasterAuthenticated = true;
      adminAuthStatus.className = 'admin-status-msg success';
      adminAuthStatus.textContent = '✓ Passcode verified! Opening Studio Workspace...';
      adminAuthStatus.style.display = 'block';

      setTimeout(() => {
        if (adminAuthSection) adminAuthSection.style.display = 'none';
        if (adminDashboardSection) adminDashboardSection.style.display = 'block';
        if (adminPortalStatusChip) {
          adminPortalStatusChip.className = 'admin-status-chip unlocked';
          adminPortalStatusChip.textContent = '🔓 Studio Full Access';
        }
        if (adminFormStatus) {
          adminFormStatus.className = 'admin-status-msg success';
          adminFormStatus.textContent = 'Welcome Samuel! Master privileges active.';
          adminFormStatus.style.display = 'block';
        }
        renderAdminWorksList();
      }, 400);
    } else {
      adminAuthStatus.className = 'admin-status-msg error';
      adminAuthStatus.textContent = 'Incorrect passcode. Please verify and try again.';
      adminAuthStatus.style.display = 'block';
      if (adminPasscodeInput) {
        adminPasscodeInput.select();
      }
    }
  });
}

// Sign-Out button (Lock dashboard immediately)
if (adminSignOutBtn) {
  adminSignOutBtn.addEventListener('click', () => {
    isMasterAuthenticated = false;
    clearSelectedImage();
    if (adminDashboardSection) adminDashboardSection.style.display = 'none';
    if (adminAuthSection) adminAuthSection.style.display = 'block';
    if (adminPortalStatusChip) {
      adminPortalStatusChip.className = 'admin-status-chip locked';
      adminPortalStatusChip.textContent = '🔒 Passcode Protected';
    }
    if (adminPasscodeInput) adminPasscodeInput.value = '';
    if (adminAuthStatus) {
      adminAuthStatus.className = 'admin-status-msg info';
      adminAuthStatus.textContent = 'Workspace locked. Enter master passcode to access.';
      adminAuthStatus.style.display = 'block';
    }
  });
}

// Render list of current works in Admin modal
function renderAdminWorksList() {
  if (!adminWorksList) return;
  const items = allPortfolioItems.length > 0 ? allPortfolioItems : starterItems;
  if (adminWorksCount) adminWorksCount.textContent = items.length;

  if (items.length === 0) {
    adminWorksList.innerHTML = '<p class="admin-empty">No portfolio items found in Cloud Firestore.</p>';
    return;
  }

  adminWorksList.innerHTML = '';
  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'admin-work-card';
    const allImgs = Array.isArray(item.images) && item.images.length > 0 ? item.images : (item.image ? [item.image] : []);
    const imgSrc = allImgs[0] || '/assets/images/flyer-studio.svg';
    const linkUrl = item.link || item.externalUrl || '';

    card.innerHTML = `
      <div class="admin-work-card-info">
        <img src="${imgSrc}" alt="${escapeHtml(item.title)}" class="admin-work-card-thumb" />
        <div class="admin-work-card-details">
          <span class="admin-work-card-title">${escapeHtml(item.title)}</span>
          <div class="admin-work-card-meta">
            <span class="admin-work-badge">${escapeHtml(item.category || 'work')}</span>
            ${allImgs.length > 1 ? `<span class="admin-work-badge" style="background: rgba(255,255,255,0.08); color: #E2E8F0;">📷 ${allImgs.length} photos</span>` : ''}
            ${linkUrl ? `
              <a href="${escapeHtml(linkUrl)}" target="_blank" rel="noopener noreferrer" class="admin-work-test-link" title="Open and test live link">
                🌐 Test Link ↗
              </a>
            ` : ''}
          </div>
        </div>
      </div>
      <div class="admin-work-card-actions">
        <button type="button" class="admin-edit-btn" data-id="${item.id}" title="Edit this artwork">✏️ Edit</button>
        <button type="button" class="admin-del-btn" data-id="${item.id}" title="Delete from Cloud Firestore">🗑️ Delete</button>
      </div>
    `;

    // Edit button click handler
    const editBtn = card.querySelector('.admin-edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        if (!isMasterAuthenticated) {
          alert('Please unlock with your Master Secret Passcode to edit items.');
          return;
        }

        if (editWorkIdInput) editWorkIdInput.value = item.id;
        const titleField = document.getElementById('workTitle');
        const catField = document.getElementById('workCategory');
        const linkField = document.getElementById('workLink');
        const descField = document.getElementById('workDesc');

        if (titleField) titleField.value = item.title || '';
        if (catField) catField.value = item.category || 'flyers';
        if (linkField) linkField.value = item.link || item.externalUrl || '';
        if (descField) descField.value = item.description || '';

        // Populate images
        selectedImages = Array.isArray(item.images) && item.images.length > 0 
          ? [...item.images] 
          : (item.image ? [item.image] : []);
        updateMultiImageUI();

        // Update form headers and action buttons
        if (adminFormCardTitle) adminFormCardTitle.textContent = `✏️ Edit Artwork: ${item.title}`;
        if (adminFormCardSub) adminFormCardSub.textContent = 'Update pictures, live project links, category, or notes. Saved instantly.';
        if (adminSubmitWorkBtn) adminSubmitWorkBtn.textContent = '💾 Save Changes to Live Portfolio';
        if (adminCancelEditBtn) adminCancelEditBtn.style.display = 'block';

        if (adminFormStatus) {
          adminFormStatus.className = 'admin-status-msg info';
          adminFormStatus.textContent = `Now editing "${item.title}". Make changes above and click Save.`;
          adminFormStatus.style.display = 'block';
        }

        if (adminFormContainer) {
          adminFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // Delete button click handler
    const delBtn = card.querySelector('.admin-del-btn');
    if (delBtn) {
      delBtn.addEventListener('click', async () => {
        const confirmDel = confirm(`Are you sure you want to remove "${item.title}" from your live portfolio?`);
        if (!confirmDel) return;

        if (!isMasterAuthenticated) {
          alert('Please unlock with your Master Secret Passcode to delete items.');
          return;
        }

        try {
          delBtn.disabled = true;
          delBtn.textContent = '...';
          await deleteDoc(doc(db, 'portfolio', item.id));
          card.remove();
          console.log('Artwork deleted from Firestore:', item.id);
          // If currently editing this item, reset form
          if (editWorkIdInput && editWorkIdInput.value === item.id) {
            resetAdminForm();
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `portfolio/${item.id}`);
          console.error('Error deleting artwork:', err);
          if (adminFormStatus) {
            adminFormStatus.className = 'admin-status-msg error';
            adminFormStatus.textContent = `Could not delete: ${err.message || 'Permission denied'}`;
            adminFormStatus.style.display = 'block';
          }
          delBtn.disabled = false;
          delBtn.textContent = '🗑️ Delete';
        }
      });
    }

    adminWorksList.appendChild(card);
  });
}

// Add / Edit Portfolio Artwork Form Handler
if (adminAddWorkForm) {
  adminAddWorkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isMasterAuthenticated) {
      if (adminFormStatus) {
        adminFormStatus.className = 'admin-status-msg error';
        adminFormStatus.textContent = 'Passcode required. Please enter your secret passcode to publish.';
        adminFormStatus.style.display = 'block';
      }
      return;
    }

    const isEditMode = editWorkIdInput && editWorkIdInput.value.trim() !== '';
    const editId = isEditMode ? editWorkIdInput.value.trim() : null;

    const title = document.getElementById('workTitle').value.trim();
    const category = document.getElementById('workCategory').value;
    const description = document.getElementById('workDesc').value.trim();
    const rawUrlImage = workImageInput ? workImageInput.value.trim() : '';
    
    // Collect final images list
    const finalImagesList = [...selectedImages];
    if (rawUrlImage && !finalImagesList.includes(rawUrlImage)) {
      finalImagesList.push(rawUrlImage);
    }

    if (!title || finalImagesList.length === 0) {
      if (adminFormStatus) {
        adminFormStatus.className = 'admin-status-msg error';
        adminFormStatus.textContent = 'Please provide an artwork title and at least one picture (upload or image URL).';
        adminFormStatus.style.display = 'block';
      }
      return;
    }

    const primaryImage = finalImagesList[0];
    const projectLink = workLinkInput ? workLinkInput.value.trim() : '';

    const submitBtn = document.getElementById('adminSubmitWorkBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = isEditMode ? 'Saving Changes to Firestore...' : 'Publishing to Cloud Firestore...';

    if (adminFormStatus) {
      adminFormStatus.className = 'admin-status-msg info';
      adminFormStatus.textContent = isEditMode ? 'Updating artwork in Firestore...' : 'Uploading artwork record to Firestore...';
      adminFormStatus.style.display = 'block';
    }

    try {
      if (isEditMode) {
        // UPDATE EXISTING ITEM
        const updateData = {
          title,
          category,
          image: primaryImage,
          images: finalImagesList,
          description,
          link: projectLink || null,
          externalUrl: projectLink || null,
          updatedAt: new Date().toISOString()
        };

        await updateDoc(doc(db, 'portfolio', editId), updateData);

        if (adminFormStatus) {
          adminFormStatus.className = 'admin-status-msg success';
          adminFormStatus.textContent = `✓ "${title}" updated successfully in live portfolio!`;
          adminFormStatus.style.display = 'block';
        }

        resetAdminForm();
      } else {
        // CREATE NEW ITEM
        const docId = 'item_' + Date.now();
        const newArtwork = {
          title,
          category,
          image: primaryImage,
          images: finalImagesList,
          description,
          link: projectLink || null,
          externalUrl: projectLink || null,
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'portfolio', docId), newArtwork);

        if (adminFormStatus) {
          adminFormStatus.className = 'admin-status-msg success';
          adminFormStatus.textContent = `✓ "${title}" added to live portfolio successfully!`;
          adminFormStatus.style.display = 'block';
        }

        resetAdminForm();
      }
    } catch (err) {
      const opType = isEditMode ? OperationType.UPDATE : OperationType.WRITE;
      const targetPath = isEditMode ? `portfolio/${editId}` : 'portfolio/new';
      handleFirestoreError(err, opType, targetPath);
      console.error('Failed Firestore operation:', err);
      if (adminFormStatus) {
        adminFormStatus.className = 'admin-status-msg error';
        adminFormStatus.textContent = `Error: ${err.message || 'Check your permissions'}`;
        adminFormStatus.style.display = 'block';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = isEditMode ? '💾 Save Changes to Live Portfolio' : '🚀 Publish to Live Portfolio';
    }
  });
}

// ==========================================
// 12. Google Search Console & SEO Management
// ==========================================
const googleSiteVerificationMeta = document.getElementById('googleSiteVerificationMeta');
const adminGscForm = document.getElementById('adminGscForm');
const gscVerificationInput = document.getElementById('gscVerificationInput');
const saveGscBtn = document.getElementById('saveGscBtn');
const clearGscBtn = document.getElementById('clearGscBtn');
const gscActiveCodeDisplay = document.getElementById('gscActiveCodeDisplay');
const gscStatusBadge = document.getElementById('gscStatusBadge');
const gscFormStatus = document.getElementById('gscFormStatus');

let currentGscToken = localStorage.getItem('sammie_gsc_token') || '';

// Clean input: extracts content from <meta name="google-site-verification" content="..." /> or raw token
function extractGscToken(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  const metaMatch = trimmed.match(/content=["']([^"']+)["']/i);
  if (metaMatch && metaMatch[1]) {
    return metaMatch[1].trim();
  }
  return trimmed;
}

function updateGscUI(token) {
  currentGscToken = token || '';
  if (googleSiteVerificationMeta) {
    googleSiteVerificationMeta.setAttribute('content', currentGscToken);
  }

  if (currentGscToken) {
    if (gscActiveCodeDisplay) {
      gscActiveCodeDisplay.textContent = currentGscToken;
      gscActiveCodeDisplay.title = currentGscToken;
    }
    if (gscStatusBadge) {
      gscStatusBadge.className = 'admin-seo-badge';
      gscStatusBadge.innerHTML = '<span class="status-dot" style="background:#22C55E; display:inline-block; width:8px; height:8px; border-radius:50%;"></span> Active in HTML';
    }
    if (clearGscBtn) clearGscBtn.style.display = 'inline-block';
    if (gscVerificationInput) gscVerificationInput.value = currentGscToken;
  } else {
    if (gscActiveCodeDisplay) {
      gscActiveCodeDisplay.textContent = 'None set yet';
    }
    if (gscStatusBadge) {
      gscStatusBadge.className = 'admin-seo-badge pending';
      gscStatusBadge.innerHTML = '<span class="status-dot" style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#FACC15;"></span> Needs Verification Tag';
    }
    if (clearGscBtn) clearGscBtn.style.display = 'none';
    if (gscVerificationInput) gscVerificationInput.value = '';
  }
}

// Initial update from local storage if available
if (currentGscToken) {
  updateGscUI(currentGscToken);
}

// Real-time listener for settings/seo in Firestore
try {
  onSnapshot(doc(db, 'settings', 'seo'), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const token = data?.googleSiteVerification || '';
      localStorage.setItem('sammie_gsc_token', token);
      updateGscUI(token);
    }
  }, (err) => {
    console.warn('GSC settings listener using local cache:', err.message);
  });
} catch (err) {
  console.warn('GSC Firestore listener setup note:', err);
}

// GSC Form Submit
if (adminGscForm) {
  adminGscForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isMasterAuthenticated) {
      alert('Please unlock with your Master Secret Passcode first.');
      return;
    }

    const rawInput = gscVerificationInput ? gscVerificationInput.value : '';
    const cleanToken = extractGscToken(rawInput);

    if (!cleanToken) {
      if (gscFormStatus) {
        gscFormStatus.className = 'admin-status-msg error';
        gscFormStatus.textContent = 'Please enter your Google verification code or meta tag.';
        gscFormStatus.style.display = 'block';
      }
      return;
    }

    if (saveGscBtn) {
      saveGscBtn.disabled = true;
      saveGscBtn.textContent = 'Saving...';
    }

    try {
      await setDoc(doc(db, 'settings', 'seo'), {
        googleSiteVerification: cleanToken,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      localStorage.setItem('sammie_gsc_token', cleanToken);
      updateGscUI(cleanToken);

      if (gscFormStatus) {
        gscFormStatus.className = 'admin-status-msg success';
        gscFormStatus.textContent = '✓ Google Site Verification activated successfully! You can now click "Verify" in Google Search Console.';
        gscFormStatus.style.display = 'block';
      }
    } catch (err) {
      console.error('Failed to save GSC token:', err);
      handleFirestoreError(err, OperationType.WRITE, 'settings/seo');
      if (gscFormStatus) {
        gscFormStatus.className = 'admin-status-msg error';
        gscFormStatus.textContent = `Could not save to Cloud Firestore: ${err.message}`;
        gscFormStatus.style.display = 'block';
      }
    } finally {
      if (saveGscBtn) {
        saveGscBtn.disabled = false;
        saveGscBtn.textContent = '💾 Save & Activate';
      }
    }
  });
}

// Clear / Remove verification tag
if (clearGscBtn) {
  clearGscBtn.addEventListener('click', async () => {
    if (!confirm('Remove this Google Search Console verification token?')) return;
    if (!isMasterAuthenticated) {
      alert('Please unlock with your Master Secret Passcode first.');
      return;
    }

    try {
      await setDoc(doc(db, 'settings', 'seo'), {
        googleSiteVerification: '',
        updatedAt: new Date().toISOString()
      }, { merge: true });

      localStorage.removeItem('sammie_gsc_token');
      updateGscUI('');

      if (gscFormStatus) {
        gscFormStatus.className = 'admin-status-msg info';
        gscFormStatus.textContent = 'Google Site Verification tag removed.';
        gscFormStatus.style.display = 'block';
      }
    } catch (err) {
      console.error('Failed to clear GSC token:', err);
    }
  });
}

// Initialize default language on load
applyLanguage(currentLang);
