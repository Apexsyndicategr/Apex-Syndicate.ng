import {
  Product,
  DownloadRequest,
  AdminNotification,
  OwnerSettings,
  ContactMessage,
  LaunchPricingInfo,
  DashboardStats,
  LaunchPhase,
} from '../types';

const STORE_KEY = 'apex_syndicate_store_data_v3';

export interface StoreData {
  products: Product[];
  requests: DownloadRequest[];
  notifications: AdminNotification[];
  settings: OwnerSettings;
  contacts: ContactMessage[];
}

export function calculateLaunchPricing(
  launchDateIso: string,
  settings?: Partial<OwnerSettings>
): LaunchPricingInfo {
  const freeDays = settings?.freeDays ?? 14;
  const earlyDays = settings?.earlyDays ?? 14;
  const earlyPrice = settings?.earlyPrice ?? 5000;
  const fullPrice = settings?.fullPrice ?? 17000;
  const isPaused = settings?.timerPaused !== false; // default true if unset

  let currentDayNumber = 0;
  let secondsRemaining = freeDays * 24 * 60 * 60;
  let activePhase: LaunchPhase = 'free';
  let currentPrice = 0;
  let phaseName = 'FREE LAUNCH ACCESS';
  let priceDisplay = 'FREE';
  let phaseEndsAt = new Date();

  const totalEarlyCutoffDays = freeDays + earlyDays;

  if (isPaused) {
    if (typeof settings?.timerPausedSecondsRemaining === 'number') {
      secondsRemaining = Math.max(0, settings.timerPausedSecondsRemaining);
    } else {
      secondsRemaining = freeDays * 24 * 60 * 60;
    }

    if (secondsRemaining >= freeDays * 24 * 60 * 60) {
      currentDayNumber = 0;
      activePhase = 'free';
      currentPrice = 0;
      phaseName = 'FREE LAUNCH ACCESS';
      priceDisplay = 'FREE';
    } else {
      const elapsedSecs = (freeDays * 24 * 60 * 60) - secondsRemaining;
      currentDayNumber = Math.max(1, Math.floor(elapsedSecs / (24 * 60 * 60)) + 1);
      if (currentDayNumber <= freeDays) {
        activePhase = 'free';
        currentPrice = 0;
        phaseName = 'FREE LAUNCH ACCESS';
        priceDisplay = 'FREE';
      } else if (currentDayNumber <= totalEarlyCutoffDays) {
        activePhase = 'early';
        currentPrice = earlyPrice ?? 5000;
        phaseName = `EARLY ACCESS — ₦${(earlyPrice ?? 5000).toLocaleString()}`;
        priceDisplay = `₦${(earlyPrice ?? 5000).toLocaleString()}`;
      } else {
        activePhase = 'full';
        currentPrice = fullPrice ?? 17000;
        phaseName = `FULL PRICE — ₦${(fullPrice ?? 17000).toLocaleString()}`;
        priceDisplay = `₦${(fullPrice ?? 17000).toLocaleString()}`;
      }
    }

    phaseEndsAt = new Date(Date.now() + secondsRemaining * 1000);
  } else {
    const launchTime = new Date(launchDateIso || Date.now()).getTime();
    const now = Date.now();
    const elapsedMs = Math.max(0, now - launchTime);
    const elapsedDays = elapsedMs / (24 * 60 * 60 * 1000);
    currentDayNumber = Math.max(1, Math.floor(elapsedDays) + 1);

    if (currentDayNumber <= freeDays) {
      activePhase = 'free';
      currentPrice = 0;
      phaseName = 'FREE LAUNCH ACCESS';
      priceDisplay = 'FREE';
      phaseEndsAt = new Date(launchTime + freeDays * 24 * 60 * 60 * 1000);
    } else if (currentDayNumber <= totalEarlyCutoffDays) {
      activePhase = 'early';
      currentPrice = earlyPrice ?? 5000;
      phaseName = `EARLY ACCESS — ₦${(earlyPrice ?? 5000).toLocaleString()}`;
      priceDisplay = `₦${(earlyPrice ?? 5000).toLocaleString()}`;
      phaseEndsAt = new Date(launchTime + totalEarlyCutoffDays * 24 * 60 * 60 * 1000);
    } else {
      activePhase = 'full';
      currentPrice = fullPrice ?? 17000;
      phaseName = `FULL PRICE — ₦${(fullPrice ?? 17000).toLocaleString()}`;
      priceDisplay = `₦${(fullPrice ?? 17000).toLocaleString()}`;
      phaseEndsAt = new Date(launchTime + 365 * 24 * 60 * 60 * 1000);
    }

    secondsRemaining = Math.max(0, Math.floor((phaseEndsAt.getTime() - now) / 1000));
  }

  return {
    launchDate: launchDateIso,
    currentDayNumber,
    activePhase,
    currentPrice,
    phaseName,
    priceDisplay,
    phaseEndsAt: phaseEndsAt.toISOString(),
    secondsRemaining,
    isPaused,
  };
}

export function getDefaultData(): StoreData {
  const defaultLaunchDate = new Date().toISOString();

  return {
    settings: {
      bankName: 'OPay',
      accountName: 'APEX SYNDICATE SOFTWARE LTD',
      accountNumber: '8082961817',
      bankInstructions:
        'Transfer the exact amount to OPay (8082961817 - APEX SYNDICATE SOFTWARE LTD). Enter your Payment Reference / Transaction ID below so the owner can verify and approve your download.',
      ownerEmail: 'apexsyndicategr@gmail.com',
      launchDateApexEditor: defaultLaunchDate,
      timerPaused: true,
      timerPausedSecondsRemaining: 14 * 24 * 60 * 60,
      portfolioVideoMode: 'blank',
      portfolioVideoUrl: '',
      devUpdates: [
        {
          id: 'update-1',
          title: 'Apex Editor GPU Canvas & Rust Kernel Optimization',
          category: 'Apex Editor',
          date: '2026-08-18',
          description: 'Refactored internal syntax highlighting pipeline down to 0.4ms latency. New custom shader glowing theme engine with real-time ast parsing and memory footprint reduced by 60%.',
          images: [
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80',
          ],
          statusTag: 'GPU KERNEL ACTIVE',
        },
        {
          id: 'update-2',
          title: 'Gangster Revolution Open-World Downtown Turf & Vehicle Shaders',
          category: 'Gangster Revolution',
          date: '2026-08-15',
          description: 'Testing night neon lighting reflections and wet pavement ray-tracing in the downtown metropolis district. High-octane vehicle handling physics passed 60FPS stress tests.',
          images: [
            'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
          ],
          statusTag: 'RAY-TRACING PASS',
        },
        {
          id: 'update-3',
          title: 'Syndicate Launcher Architecture & Cryptographic Licensing',
          category: 'Syndicate Studio',
          date: '2026-08-10',
          description: 'Built SHA-256 automated binary verification with instant zero-tamper token generation for authorized commercial downloads.',
          images: [
            'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&q=80',
          ],
          statusTag: 'SECURITY VERIFIED',
        },
      ],
      devUpdatePictures: [
        {
          id: 'pic-1',
          url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
          title: 'Apex Editor GPU Viewport Architecture',
          caption: 'Live snapshot of the zero-latency multi-cursor Rust parsing canvas.',
          category: 'Apex Editor',
          createdAt: '2026-08-18',
        },
        {
          id: 'pic-2',
          url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
          title: 'Gangster Revolution Metropolis Turf Rendering',
          caption: 'Neon ray-traced reflections in downtown syndicate territory.',
          category: 'Gangster Revolution',
          createdAt: '2026-08-15',
        },
        {
          id: 'pic-3',
          url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80',
          title: 'Apex Kernel AST Parser Benchmark',
          caption: 'Sub-millisecond tokenization stress tests across 50,000 lines of code.',
          category: 'Apex Editor',
          createdAt: '2026-08-12',
        },
        {
          id: 'pic-4',
          url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
          title: 'Vehicular Combat Physics Mesh',
          caption: 'High-speed drift calculations and collision telemetry.',
          category: 'Gangster Revolution',
          createdAt: '2026-08-10',
        },
      ],
      autoApproveFree: false,
      adminPassword: 'xxander4325king',
      visitorCount: 0,
      apexEditorDemoUrl: 'https://apex-editor-demo.vercel.app/',
      gangsterRevolutionLaunchDate: 'TBD',
      gangsterRevolutionStatus: 'PRE-ALPHA BUILD • IN DEVELOPMENT',
      gangsterSpecs: {
        minOs: 'TBD',
        minProcessor: 'TBD',
        minMemory: 'TBD',
        minGraphics: 'TBD',
        minDirectX: 'TBD',
        minStorage: 'TBD',
        recOs: 'TBD',
        recProcessor: 'TBD',
        recMemory: 'TBD',
        recGraphics: 'TBD',
        recDirectX: 'TBD',
        recStorage: 'TBD',
      },
    },
    products: [
      {
        id: 'apex-editor',
        slug: 'apex-editor',
        name: 'Apex Editor',
        category: 'Editor',
        description:
          'Powerful editing built for high-performance software development, creative media, and advanced scripting.',
        fullDescription:
          'Apex Editor is the flagship software creation suite engineered by Apex Syndicate. Featuring GPU-accelerated canvas rendering, a zero-latency Rust processing core, built-in intelligent code assistance, customizable glassmorphic themes, multi-tab split workspaces, and native extension support.',
        version: 'v2.4.0 (Coming Soon)',
        releaseDate: 'Coming Soon',
        isFeatured: true,
        isPublished: true,
        isComingSoon: true,
        pricingType: 'launch',
        iconName: 'Terminal',
        fileUrl: '',
        fileSize: 'Pending Build',
        systemRequirements: {
          os: 'Windows 10/11, macOS 12+, Ubuntu 22.04+',
          processor: '64-bit Quad-Core Intel / AMD or Apple M1/M2/M3',
          memory: '8 GB RAM minimum (16 GB recommended)',
          storage: '500 MB available NVMe SSD space',
        },
        features: [
          'GPU-Accelerated 60FPS Editor Core',
          'Multi-Cursor & Dual Split Workspaces',
          'Rust-Powered AST Parsing Engine',
          'Syndicate Dark Glass Cyber Architecture',
          'Native Git & Project Telemetry Integration',
          'Custom Hotkey & Extension Marketplace',
        ],
        screenshots: [
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&q=80',
        ],
        whatsNew: ['Coming Soon! Final build upload pending by owner.'],
      },
      {
        id: 'gangster-revolution',
        slug: 'gangster-revolution',
        name: 'Gangster Revolution',
        category: 'Games',
        description:
          'Next-generation open-world action game featuring intense storylines, syndicate warfare, and high-octane gameplay.',
        fullDescription:
          'Gangster Revolution is the explosive new game from Apex Syndicate. Dive into an immersive open-world city filled with syndicate turf wars, customizable vehicles, story missions, and realistic physics powered by Apex Games Engine.',
        version: 'v1.0.0 (Coming Soon)',
        releaseDate: 'Coming Soon',
        isFeatured: true,
        isPublished: true,
        isComingSoon: true,
        pricingType: 'tbd',
        fixedPrice: 0,
        iconName: 'Gamepad',
        fileUrl: '',
        fileSize: 'Pending Build',
        systemRequirements: {
          os: 'TBD',
          processor: 'TBD',
          memory: 'TBD',
          storage: 'TBD',
        },
        features: [
          'Expansive Open-World Metropolis',
          'Syndicate Turf Wars & Territory Control',
          'Custom Vehicle Tuning & High-Octane Physics',
          'Immersive Story Campaign & Online Syndicate Co-op',
          'GPU Ray-Tracing & Hyper-Realistic Graphics',
        ],
        screenshots: [
          'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
        ],
        whatsNew: ['In active development! Official release build coming soon.'],
      },
    ],
    requests: [],
    notifications: [],
    contacts: [],
  };
}

export function loadClientData(): StoreData {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const def = getDefaultData();
      localStorage.setItem(STORE_KEY, JSON.stringify(def));
      return def;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.products || !parsed.settings) {
      const def = getDefaultData();
      localStorage.setItem(STORE_KEY, JSON.stringify(def));
      return def;
    }
    if (!parsed.settings.apexEditorDemoUrl || parsed.settings.apexEditorDemoUrl.trim() === '') {
      parsed.settings.apexEditorDemoUrl = 'https://apex-editor-demo.vercel.app/';
    }
    return parsed;
  } catch (e) {
    const def = getDefaultData();
    localStorage.setItem(STORE_KEY, JSON.stringify(def));
    return def;
  }
}

export function saveClientData(data: StoreData) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save client store data', e);
  }
}
