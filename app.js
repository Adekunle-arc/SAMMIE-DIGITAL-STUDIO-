// Sammie Digital Studio - Clean Pure JavaScript Engine
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js';

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

// Initialize Firebase Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

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
    image: '/assets/images/flyer-church.svg'
  },
  {
    id: 'starter_2',
    title: 'Digital Studio Corporate Web',
    category: 'websites',
    description: 'High-speed business website with dark mode and WhatsApp bookings.',
    image: '/assets/images/web-portfolio.svg'
  },
  {
    id: 'starter_3',
    title: 'Modern Brand Identity & Emblem',
    category: 'branding',
    description: 'Minimalist logo mark and typography system for technology studio.',
    image: '/assets/images/brand-identity.svg'
  },
  {
    id: 'starter_4',
    title: 'Social Media Event Campaign',
    category: 'social',
    description: 'Instagram and WhatsApp status promotional flyers for annual youth conference.',
    image: '/assets/images/flyer-studio.svg'
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
    const imgSrc = item.image || '/assets/images/flyer-studio.svg';
    const catLabel = getCategoryLabel(item.category);
    const safeTitle = escapeHtml(item.title);
    const safeDesc = escapeHtml(item.description || 'Crafted with precision by Sammie Digital Studio.');

    card.innerHTML = `
      <div class="portfolio-img-wrap">
        <img src="${imgSrc}" alt="${safeTitle}" class="portfolio-img" loading="lazy" />
        <div class="portfolio-overlay">
          <span class="portfolio-zoom-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <span>View Project</span>
          </span>
        </div>
      </div>
      <div class="portfolio-info">
        <div class="portfolio-category-badge">${catLabel}</div>
        <h4 class="portfolio-title">${safeTitle}</h4>
        <p class="portfolio-desc">${safeDesc}</p>
      </div>
    `;

    // Click to enlarge in lightbox
    card.addEventListener('click', () => {
      openLightbox(imgSrc, item.title, item.description, item.category);
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

// 5. Lightbox Modal
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightboxBtn = document.getElementById('closeLightboxBtn');
const lightboxWaBtn = document.getElementById('lightboxWaBtn');
const lightboxQuoteBtn = document.getElementById('lightboxQuoteBtn');

let currentLightboxItem = null;

function openLightbox(src, title, desc, category) {
  if (!lightboxModal) return;
  currentLightboxItem = { src, title, desc, category };
  lightboxImg.src = src;
  lightboxCaption.innerHTML = `<h3 class="lightbox-title">${title}</h3><p class="lightbox-sub">${desc || ''}</p>`;
  
  if (lightboxWaBtn) {
    const waText = `Hello Sammie Digital Studio! I saw your portfolio work "${title}" (${category || 'design'}) on your website and I'd like to get something similar done for my business/organization.`;
    lightboxWaBtn.href = `https://wa.me/2348168874826?text=${encodeURIComponent(waText)}`;
  }

  lightboxModal.classList.add('open');
}

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

// 11. Studio Admin Portal (#admin) & Firebase Auth/Firestore Management
const adminModal = document.getElementById('adminModal');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const footerAdminLink = document.getElementById('footerAdminLink');
const adminAuthSection = document.getElementById('adminAuthSection');
const adminDashboardSection = document.getElementById('adminDashboardSection');
const adminGoogleSignInBtn = document.getElementById('adminGoogleSignInBtn');
const adminSignOutBtn = document.getElementById('adminSignOutBtn');
const adminUserEmail = document.getElementById('adminUserEmail');
const adminAuthStatus = document.getElementById('adminAuthStatus');
const adminAddWorkForm = document.getElementById('adminAddWorkForm');
const adminFormStatus = document.getElementById('adminFormStatus');
const adminWorksList = document.getElementById('adminWorksList');
const adminWorksCount = document.getElementById('adminWorksCount');

const AUTHORIZED_ADMIN_EMAIL = 'samadeniran15@gmail.com';
let currentUser = null;

function showAdminModal() {
  if (adminModal) {
    adminModal.classList.add('open');
    if (window.location.hash !== '#admin') {
      history.pushState(null, '', '#admin');
    }
    renderAdminWorksList();
  }
}

function hideAdminModal() {
  if (adminModal) {
    adminModal.classList.remove('open');
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

if (adminModal) {
  adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) {
      hideAdminModal();
    }
  });
}

// Escape key closes modals
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideAdminModal();
    if (lightboxModal) lightboxModal.classList.remove('open');
    if (quoteModal) quoteModal.classList.remove('open');
  }
});

// Update Admin UI according to Auth State
function updateAdminAuthState(user) {
  currentUser = user;
  if (!user) {
    if (adminAuthSection) adminAuthSection.style.display = 'block';
    if (adminDashboardSection) adminDashboardSection.style.display = 'none';
    if (adminAuthStatus) {
      adminAuthStatus.className = 'admin-status-msg';
      adminAuthStatus.textContent = '';
      adminAuthStatus.style.display = 'none';
    }
  } else {
    const isOwner = user.email && user.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
    if (adminUserEmail) adminUserEmail.textContent = user.email;

    if (adminAuthSection) adminAuthSection.style.display = 'none';
    if (adminDashboardSection) adminDashboardSection.style.display = 'block';

    if (!isOwner) {
      if (adminFormStatus) {
        adminFormStatus.className = 'admin-status-msg error';
        adminFormStatus.textContent = `Signed in as ${user.email}. Notice: Only ${AUTHORIZED_ADMIN_EMAIL} has Firestore write authorization.`;
      }
    } else {
      if (adminFormStatus) {
        adminFormStatus.className = 'admin-status-msg success';
        adminFormStatus.textContent = 'Welcome Samuel! You are authorized to manage portfolio items.';
      }
    }
    renderAdminWorksList();
  }
}

// Track Auth State changes
onAuthStateChanged(auth, (user) => {
  updateAdminAuthState(user);
});

// Google Sign-In button
if (adminGoogleSignInBtn) {
  adminGoogleSignInBtn.addEventListener('click', async () => {
    try {
      if (adminAuthStatus) {
        adminAuthStatus.className = 'admin-status-msg info';
        adminAuthStatus.textContent = 'Connecting to Google Authentication...';
      }
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Admin logged in:', result.user.email);
    } catch (err) {
      console.error('Sign in error:', err);
      if (adminAuthStatus) {
        adminAuthStatus.className = 'admin-status-msg error';
        adminAuthStatus.textContent = `Sign-in error: ${err.message || 'Popup closed or blocked'}`;
      }
    }
  });
}

// Sign-Out button
if (adminSignOutBtn) {
  adminSignOutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      updateAdminAuthState(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  });
}

// Render list of current works in Admin modal
function renderAdminWorksList() {
  if (!adminWorksList) return;
  const items = allPortfolioItems.length > 0 ? allPortfolioItems : starterItems;
  if (adminWorksCount) adminWorksCount.textContent = items.length;

  if (items.length === 0) {
    adminWorksList.innerHTML = '<p class="admin-empty">No portfolio items found.</p>';
    return;
  }

  adminWorksList.innerHTML = '';
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'admin-work-row';
    const imgSrc = item.image || '/assets/images/flyer-studio.svg';
    row.innerHTML = `
      <div class="admin-work-left">
        <img src="${imgSrc}" alt="${item.title}" class="admin-work-thumb" />
        <div class="admin-work-meta">
          <span class="admin-work-name">${item.title}</span>
          <span class="admin-work-tag">${item.category || 'work'}</span>
        </div>
      </div>
      <button class="admin-del-btn" data-id="${item.id}" title="Delete from Cloud Firestore">Delete</button>
    `;

    const delBtn = row.querySelector('.admin-del-btn');
    delBtn.addEventListener('click', async () => {
      const confirmDel = confirm(`Are you sure you want to remove "${item.title}"?`);
      if (!confirmDel) return;

      if (!currentUser) {
        alert('Please sign in as Studio Admin to delete items.');
        return;
      }

      try {
        delBtn.disabled = true;
        delBtn.textContent = '...';
        await deleteDoc(doc(db, 'portfolio', item.id));
        row.remove();
        console.log('Artwork deleted from Firestore:', item.id);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `portfolio/${item.id}`);
        console.error('Error deleting artwork:', err);
        if (adminFormStatus) {
          adminFormStatus.className = 'admin-status-msg error';
          adminFormStatus.textContent = `Could not delete: ${err.message || 'Permission denied. Verify you are signed in with samadeniran15@gmail.com'}`;
        }
        delBtn.disabled = false;
        delBtn.textContent = 'Delete';
      }
    });

    adminWorksList.appendChild(row);
  });
}

// Add New Portfolio Artwork Form Handler
if (adminAddWorkForm) {
  adminAddWorkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) {
      if (adminFormStatus) {
        adminFormStatus.className = 'admin-status-msg error';
        adminFormStatus.textContent = 'You must be signed in with samadeniran15@gmail.com to publish.';
      }
      return;
    }

    const title = document.getElementById('workTitle').value.trim();
    const category = document.getElementById('workCategory').value;
    const image = document.getElementById('workImage').value.trim();
    const description = document.getElementById('workDesc').value.trim();

    if (!title || !image) {
      if (adminFormStatus) {
        adminFormStatus.className = 'admin-status-msg error';
        adminFormStatus.textContent = 'Title and Image URL are required.';
      }
      return;
    }

    const submitBtn = document.getElementById('adminSubmitWorkBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving to Cloud Firestore...';

    if (adminFormStatus) {
      adminFormStatus.className = 'admin-status-msg info';
      adminFormStatus.textContent = 'Uploading artwork record to Firestore...';
    }

    try {
      const docId = 'item_' + Date.now();
      const newArtwork = {
        title,
        category,
        image,
        description,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'portfolio', docId), newArtwork);

      if (adminFormStatus) {
        adminFormStatus.className = 'admin-status-msg success';
        adminFormStatus.textContent = `✓ "${title}" added to live portfolio successfully!`;
      }

      adminAddWorkForm.reset();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `portfolio/${docId}`);
      console.error('Failed to write to Firestore:', err);
      if (adminFormStatus) {
        adminFormStatus.className = 'admin-status-msg error';
        adminFormStatus.textContent = `Error publishing: ${err.message || 'Check your permissions'}`;
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add to Live Portfolio';
    }
  });
}

// Initialize default language on load
applyLanguage(currentLang);
