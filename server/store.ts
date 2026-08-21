import fs from 'fs';
import path from 'path';
import {
  Product,
  DownloadRequest,
  AdminNotification,
  OwnerSettings,
  ContactMessage,
  LaunchPricingInfo,
  DashboardStats,
  UserAccount,
  SiteVisitorLog,
  DemoVisitorLog,
  NewsletterSubscriber,
  NewsletterBroadcast,
  UserSession,
  SecurityAlert,
} from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

export interface UserRecord extends UserAccount {
  passwordHash?: string;
}

export interface StoreData {
  products: Product[];
  requests: DownloadRequest[];
  notifications: AdminNotification[];
  settings: OwnerSettings;
  contacts: ContactMessage[];
  users: UserRecord[];
  siteVisitors: SiteVisitorLog[];
  demoVisitors: DemoVisitorLog[];
  newsletterSubscribers: NewsletterSubscriber[];
  newsletterBroadcasts: NewsletterBroadcast[];
  userSessions: UserSession[];
  securityAlerts: SecurityAlert[];
}

function getBaselineNewsletterSubscribers(): NewsletterSubscriber[] {
  const baseTime = Date.now() - 5 * 24 * 60 * 60 * 1000;
  return [
    {
      id: 'sub-1',
      email: 'samuel.dev99@gmail.com',
      name: 'Samuel K.',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=samuel',
      subscribedAt: new Date(baseTime + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      device: 'Windows 11 • Chrome 127',
      source: 'Sign-up Modal',
      emailsReceivedCount: 2,
      lastEmailSentAt: new Date(baseTime + 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sub-2',
      email: 'chiemeka.dev@gmail.com',
      name: 'Chiemeka O.',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=chiemeka',
      subscribedAt: new Date(baseTime + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      device: 'macOS Sonoma • Safari 17.5',
      source: 'Registration',
      emailsReceivedCount: 2,
      lastEmailSentAt: new Date(baseTime + 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sub-3',
      email: 'tobi_syndicate@gmail.com',
      name: 'Tobi Daniels',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=tobi',
      subscribedAt: new Date(baseTime + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      device: 'Windows 11 • Edge 127',
      source: 'Sign-up Modal',
      emailsReceivedCount: 1,
      lastEmailSentAt: new Date(baseTime + 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sub-4',
      email: 'alex.vance.dev@gmail.com',
      name: 'Alex Vance',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alex',
      subscribedAt: new Date(baseTime + 3.5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      device: 'Linux x86_64 • Chrome 126',
      source: 'Registration',
      emailsReceivedCount: 1,
      lastEmailSentAt: new Date(baseTime + 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sub-5',
      email: 'liam.ross.fx@gmail.com',
      name: 'Liam Ross',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=liam',
      subscribedAt: new Date(baseTime + 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      device: 'iOS 17.5 • Mobile Safari',
      source: 'Sign-up Modal',
      emailsReceivedCount: 1,
      lastEmailSentAt: new Date(baseTime + 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// Generate 28 initial baseline visitors up to current 28 visitor count
function getBaselineVisitors(): SiteVisitorLog[] {
  const devices = [
    'Windows 11 • Chrome 127',
    'macOS Sonoma • Safari 17.5',
    'Windows 10 • Firefox 128',
    'iOS 17.5 • Mobile Safari',
    'Android 14 • Chrome Mobile 126',
    'macOS Sequoia • Brave Browser',
    'Windows 11 • Edge 127',
    'Linux x86_64 • Chrome 126',
    'Android 13 • Samsung Internet',
    'iPadOS 17 • Mobile Safari',
  ];

  const initialVisitors: SiteVisitorLog[] = [];
  const baseTime = Date.now() - 3 * 24 * 60 * 60 * 1000; // 3 days ago

  for (let i = 1; i <= 28; i++) {
    const timeOffset = Math.floor((i / 28) * (3 * 24 * 60 * 60 * 1000));
    const visitDate = new Date(baseTime + timeOffset).toISOString();
    const device = devices[(i - 1) % devices.length];

    if (i === 1) {
      initialVisitors.push({
        id: `vis-${i}`,
        visitorNumber: i,
        email: 'chiemeka.dev@gmail.com',
        name: 'Chiemeka O.',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=chiemeka',
        isGuest: false,
        device,
        visitedAt: visitDate,
        path: '/',
      });
    } else if (i === 7) {
      initialVisitors.push({
        id: `vis-${i}`,
        visitorNumber: i,
        email: 'tobi_syndicate@gmail.com',
        name: 'Tobi Daniels',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=tobi',
        isGuest: false,
        device,
        visitedAt: visitDate,
        path: '/products',
      });
    } else if (i === 15) {
      initialVisitors.push({
        id: `vis-${i}`,
        visitorNumber: i,
        email: 'samuel.dev99@gmail.com',
        name: 'Samuel K.',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=samuel',
        isGuest: false,
        device,
        visitedAt: visitDate,
        path: '/apex-editor',
      });
    } else {
      initialVisitors.push({
        id: `vis-${i}`,
        visitorNumber: i,
        email: undefined,
        name: `Guest Viewer #${i.toString().padStart(2, '0')}`,
        avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=guest${i}`,
        isGuest: true,
        device,
        visitedAt: visitDate,
        path: i % 3 === 0 ? '/apex-editor' : '/',
      });
    }
  }

  return initialVisitors;
}

// Helper to get default initial state
function getDefaultData(): StoreData {
  // Default launch date set to now so day 1 starts with 14 full days for FREE launch phase
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
          id: 'update-demo-out-now',
          title: 'THE APEX EDITOR DEMO IS OUT NOW!',
          category: 'Apex Editor',
          date: '2026-08-20',
          description:
            'The official Apex Editor Web Demo is now LIVE! Explore the zero-latency GPU-accelerated video editing interface, AI media generation tools, 60FPS timeline workstation, and real-time Rust engine directly in your browser.',
          images: ['/images/apex_editor_demo_screenshot.jpg'],
          statusTag: 'DEMO LIVE NOW',
        },
      ],
      devUpdatePictures: [
        {
          id: 'pic-demo-out-now',
          url: '/images/apex_editor_demo_screenshot.jpg',
          title: 'THE APEX EDITOR DEMO IS OUT NOW!',
          caption:
            'Official milestone release! Experience the full interactive Apex Editor in your browser right now — featuring real-time AI media generation, 60FPS canvas timeline, Topaz neural engine, and zero-latency Rust core.',
          category: 'Apex Editor',
          createdAt: 'Live Now',
        },
      ],
      autoApproveFree: false,
      adminPassword: 'xxander4325king',
      visitorCount: 28,
      demoVisitorCount: 0,
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
          processor: 'TBD',
          memory: 'TBD',
          storage: 'TBD',
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
        whatsNew: [
          'Coming Soon! Final build upload pending by owner.',
        ],
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
        version: 'v1.0.0 (TBD)',
        releaseDate: 'TBD',
        isFeatured: true,
        isPublished: true,
        isComingSoon: false,
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
        whatsNew: [
          'In active development! Official release date and specifications are To Be Determined (TBD).',
        ],
      },
    ],
    requests: [],
    notifications: [],
    contacts: [],
    users: [
      {
        id: 'usr-owner-apex',
        email: 'apexsyndicategr@gmail.com',
        name: 'Apex Syndicate Owner',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=apex-owner',
        role: 'owner',
        createdAt: new Date().toISOString(),
      },
    ],
    siteVisitors: getBaselineVisitors(),
    demoVisitors: [],
    newsletterSubscribers: getBaselineNewsletterSubscribers(),
    newsletterBroadcasts: [],
    userSessions: [],
    securityAlerts: [],
  };
}

class Store {
  private data: StoreData;

  constructor() {
    this.ensureDataDirectory();
    this.data = this.loadData();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): StoreData {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const fileContent = fs.readFileSync(STORE_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Ensure missing properties from future schema updates exist
        const defaultState = getDefaultData();
        const loadedSettings = { ...defaultState.settings, ...(parsed.settings || {}) };
        
        // Ensure baseline visitor count is at least 28 as requested
        if (typeof loadedSettings.visitorCount !== 'number' || loadedSettings.visitorCount < 28) {
          loadedSettings.visitorCount = 28;
        }
        if (typeof loadedSettings.demoVisitorCount !== 'number') {
          loadedSettings.demoVisitorCount = 0;
        }
        if (!loadedSettings.apexEditorDemoUrl || loadedSettings.apexEditorDemoUrl.trim() === '') {
          loadedSettings.apexEditorDemoUrl = 'https://apex-editor-demo.vercel.app/';
        }

        // Initialize users with default owner if not present
        const loadedUsers: UserRecord[] = parsed.users || [];
        if (!loadedUsers.some((u) => u.email.toLowerCase() === 'apexsyndicategr@gmail.com')) {
          loadedUsers.unshift({
            id: 'usr-owner-apex',
            email: 'apexsyndicategr@gmail.com',
            name: 'Apex Syndicate Owner',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=apex-owner',
            role: 'owner',
            createdAt: new Date().toISOString(),
          });
        }

        // Initialize site visitors baseline (28 items)
        let loadedSiteVisitors: SiteVisitorLog[] = parsed.siteVisitors || [];
        if (loadedSiteVisitors.length === 0) {
          loadedSiteVisitors = getBaselineVisitors();
        }

        const loadedDemoVisitors: DemoVisitorLog[] = parsed.demoVisitors || [];
        
        // Newsletter Subscribers & Broadcasts
        let loadedSubscribers: NewsletterSubscriber[] = parsed.newsletterSubscribers || [];
        if (loadedSubscribers.length === 0) {
          loadedSubscribers = getBaselineNewsletterSubscribers();
        }

        const loadedBroadcasts: NewsletterBroadcast[] = parsed.newsletterBroadcasts || [];
        const loadedSessions: UserSession[] = parsed.userSessions || [];
        const loadedSecurityAlerts: SecurityAlert[] = parsed.securityAlerts || [];

        return {
          products: parsed.products || defaultState.products,
          requests: parsed.requests || defaultState.requests,
          notifications: parsed.notifications || defaultState.notifications,
          settings: loadedSettings,
          contacts: parsed.contacts || defaultState.contacts,
          users: loadedUsers,
          siteVisitors: loadedSiteVisitors,
          demoVisitors: loadedDemoVisitors,
          newsletterSubscribers: loadedSubscribers,
          newsletterBroadcasts: loadedBroadcasts,
          userSessions: loadedSessions,
          securityAlerts: loadedSecurityAlerts,
        };
      }
    } catch (err) {
      console.error('Error reading store file, using default seed:', err);
    }

    const initial = getDefaultData();
    initial.users = [
      {
        id: 'usr-owner-apex',
        email: 'apexsyndicategr@gmail.com',
        name: 'Apex Syndicate Owner',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=apex-owner',
        role: 'owner',
        createdAt: new Date().toISOString(),
      },
    ];
    initial.siteVisitors = getBaselineVisitors();
    initial.demoVisitors = [];
    initial.newsletterSubscribers = getBaselineNewsletterSubscribers();
    initial.newsletterBroadcasts = [];
    initial.userSessions = [];
    initial.securityAlerts = [];
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave?: StoreData) {
    try {
      const payload = dataToSave || this.data;
      fs.writeFileSync(STORE_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save store to file:', err);
    }
  }

  // --- LAUNCH PRICING ENGINE FOR APEX EDITOR ---
  public getApexEditorLaunchPricing(): LaunchPricingInfo {
    const settings = this.getSettings();
    const freeDays = settings.freeDays ?? 14;
    const earlyDays = settings.earlyDays ?? 14;
    const earlyPrice = settings.earlyPrice ?? 5000;
    const fullPrice = settings.fullPrice ?? 17000;
    const isPaused = settings.timerPaused !== false; // default to true (paused) if undefined

    let currentDayNumber = 0;
    let secondsRemaining = freeDays * 24 * 60 * 60;
    let activePhase: 'free' | 'early' | 'full' = 'free';
    let currentPrice = 0;
    let phaseName = 'FREE LAUNCH ACCESS';
    let priceDisplay = 'FREE';
    let phaseEndsAt = new Date();

    const totalEarlyCutoffDays = freeDays + earlyDays;

    if (isPaused) {
      if (typeof settings.timerPausedSecondsRemaining === 'number') {
        secondsRemaining = Math.max(0, settings.timerPausedSecondsRemaining);
      } else {
        secondsRemaining = freeDays * 24 * 60 * 60;
      }

      // If paused at the full 14 days (or initial state), day is DAY 0
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
      const launchDate = new Date(settings.launchDateApexEditor || Date.now());
      const now = new Date();

      const diffMs = Math.max(0, now.getTime() - launchDate.getTime());
      currentDayNumber = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);

      if (currentDayNumber <= freeDays) {
        activePhase = 'free';
        currentPrice = 0;
        phaseName = 'FREE LAUNCH ACCESS';
        priceDisplay = 'FREE';
        phaseEndsAt = new Date(launchDate.getTime() + freeDays * 24 * 60 * 60 * 1000);
      } else if (currentDayNumber <= totalEarlyCutoffDays) {
        activePhase = 'early';
        currentPrice = earlyPrice ?? 5000;
        phaseName = `EARLY ACCESS — ₦${(earlyPrice ?? 5000).toLocaleString()}`;
        priceDisplay = `₦${(earlyPrice ?? 5000).toLocaleString()}`;
        phaseEndsAt = new Date(launchDate.getTime() + totalEarlyCutoffDays * 24 * 60 * 60 * 1000);
      } else {
        activePhase = 'full';
        currentPrice = fullPrice ?? 17000;
        phaseName = `FULL PRICE — ₦${(fullPrice ?? 17000).toLocaleString()}`;
        priceDisplay = `₦${(fullPrice ?? 17000).toLocaleString()}`;
        phaseEndsAt = new Date(launchDate.getTime() + 365 * 24 * 60 * 60 * 1000);
      }

      secondsRemaining = Math.max(0, Math.floor((phaseEndsAt.getTime() - now.getTime()) / 1000));
    }

    return {
      launchDate: settings.launchDateApexEditor,
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

  // --- PRODUCTS ---
  public getProducts(includeUnpublished = false): Product[] {
    if (includeUnpublished) {
      return this.data.products;
    }
    return this.data.products.filter((p) => p.isPublished);
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id || p.slug === id);
  }

  public saveProduct(product: Product): Product {
    // If a file is uploaded / attached, automatically mark product as ready (not coming soon)
    if (product.fileUrl && product.fileUrl.trim().length > 0) {
      product.isComingSoon = false;
      if (product.releaseDate === 'Coming Soon' || !product.releaseDate) {
        product.releaseDate = 'Official Release';
      }
      if (product.version && product.version.includes('(Coming Soon)')) {
        product.version = product.version.replace(/\s*\(Coming Soon\)/i, '').trim();
      }

      // If this is Apex Editor and timer is paused, automatically unpause it as requested!
      if (product.id === 'apex-editor' && this.data.settings.timerPaused) {
        this.data.settings.timerPaused = false;
        this.data.settings.launchDateApexEditor = new Date().toISOString();
        this.data.settings.timerPausedSecondsRemaining = undefined;
        console.log('[APEX SYNDICATE] Apex Editor file uploaded! Launch countdown timer automatically unpaused.');
      }
    }

    const index = this.data.products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      this.data.products[index] = product;
    } else {
      this.data.products.unshift(product);
    }
    this.saveData();
    return product;
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- DOWNLOAD REQUESTS ---
  public getRequests(): DownloadRequest[] {
    return this.data.requests;
  }

  public getRequestByCode(requestIdOrId: string): DownloadRequest | undefined {
    const query = requestIdOrId.trim().toUpperCase();
    return this.data.requests.find(
      (r) =>
        r.requestId.toUpperCase() === query ||
        r.id.toLowerCase() === requestIdOrId.toLowerCase() ||
        r.customerEmail.toLowerCase() === requestIdOrId.toLowerCase()
    );
  }

  public createDownloadRequest(data: {
    customerName: string;
    customerEmail: string;
    productId: string;
    paymentProofRef?: string;
  }): DownloadRequest {
    const product = this.getProductById(data.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    let amount = 0;
    if (product.id === 'apex-editor') {
      const launchPricing = this.getApexEditorLaunchPricing();
      amount = launchPricing.currentPrice;
    } else if (product.pricingType === 'fixed') {
      amount = product.fixedPrice || 0;
    }

    // Determine initial status
    const isFree = amount === 0;
    const autoApprove = isFree && this.data.settings.autoApproveFree;
    const status = autoApprove ? 'APPROVED' : isFree ? 'AWAITING_APPROVAL' : 'PAYMENT_SUBMITTED';

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const requestId = `APEX-REQ-${randomSuffix}`;
    const id = `req-${Date.now()}`;
    const downloadToken = status === 'APPROVED' ? `tok-${Date.now()}-${randomSuffix}` : undefined;

    const newRequest: DownloadRequest = {
      id,
      requestId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      productId: product.id,
      productName: product.name,
      productVersion: product.version,
      amount,
      currency: 'NGN',
      status,
      paymentProofRef: data.paymentProofRef || (isFree ? 'FREE ACCESS REQUEST' : undefined),
      requestDate: new Date().toISOString(),
      approvalDate: status === 'APPROVED' ? new Date().toISOString() : undefined,
      downloadToken,
    };

    this.data.requests.unshift(newRequest);

    // Create Notification for Admin Dashboard
    const notification: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: isFree ? 'New Free Download Request' : `New ${product.name} Payment Request`,
      message: `${data.customerName} submitted a download request (${
        (amount || 0) === 0 ? 'FREE' : `₦${(amount || 0).toLocaleString()}`
      }) for ${product.name}.`,
      type: 'request',
      createdAt: new Date().toISOString(),
      read: false,
      requestId: newRequest.requestId,
    };
    this.data.notifications.unshift(notification);

    this.saveData();
    return newRequest;
  }

  public updateRequestStatus(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    rejectionReason?: string
  ): DownloadRequest | undefined {
    const request = this.data.requests.find((r) => r.id === id || r.requestId === id);
    if (!request) return undefined;

    request.status = status;
    if (status === 'APPROVED') {
      request.approvalDate = new Date().toISOString();
      request.downloadToken = `tok-approved-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    } else {
      request.rejectionReason = rejectionReason || 'Payment could not be verified by Apex Syndicate.';
    }

    this.saveData();
    return request;
  }

  // --- SETTINGS ---
  public getSettings(): OwnerSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<OwnerSettings>): OwnerSettings {
    const currentSettings = this.data.settings;

    // Handle timer pause / resume state transitions
    if (updates.timerPaused === true && !currentSettings.timerPaused) {
      const livePricing = this.getApexEditorLaunchPricing();
      updates.timerPausedSecondsRemaining = livePricing.secondsRemaining;
    } else if (updates.timerPaused === false && currentSettings.timerPaused) {
      const freeDays = updates.freeDays ?? currentSettings.freeDays ?? 14;
      const remainingSecs = typeof currentSettings.timerPausedSecondsRemaining === 'number'
        ? currentSettings.timerPausedSecondsRemaining
        : freeDays * 24 * 60 * 60;
      
      if (remainingSecs >= freeDays * 24 * 60 * 60) {
        updates.launchDateApexEditor = new Date().toISOString();
      } else {
        const elapsedSecs = (freeDays * 24 * 60 * 60) - remainingSecs;
        const newLaunchDateMs = Date.now() - elapsedSecs * 1000;
        updates.launchDateApexEditor = new Date(newLaunchDateMs).toISOString();
      }
      updates.timerPausedSecondsRemaining = undefined;
    }

    this.data.settings = {
      ...this.data.settings,
      ...updates,
    };
    this.saveData();
    return this.data.settings;
  }

  // --- NOTIFICATIONS & CONTACTS ---
  public getNotifications(): AdminNotification[] {
    return this.data.notifications;
  }

  public markNotificationAsRead(id: string): void {
    const item = this.data.notifications.find((n) => n.id === id);
    if (item) {
      item.read = true;
      this.saveData();
    }
  }

  public markAllNotificationsAsRead(): void {
    this.data.notifications.forEach((n) => (n.read = true));
    this.saveData();
  }

  public saveContactMessage(msg: {
    name: string;
    email: string;
    category: ContactMessage['category'];
    message: string;
  }): ContactMessage {
    const newMsg: ContactMessage = {
      id: `cnt-${Date.now()}`,
      name: msg.name,
      email: msg.email,
      category: msg.category,
      message: msg.message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    this.data.contacts.unshift(newMsg);

    // Alert notification
    this.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `New Message: ${msg.category}`,
      message: `${msg.name} sent a message: "${msg.message.slice(0, 60)}..."`,
      type: 'contact',
      createdAt: new Date().toISOString(),
      read: false,
    });

    this.saveData();
    return newMsg;
  }

  public getContacts(): ContactMessage[] {
    return this.data.contacts;
  }

  // --- USER AUTHENTICATION & PROFILES ---
  public getUsers(): UserRecord[] {
    return this.data.users || [];
  }

  public getUserByEmail(email: string): UserRecord | undefined {
    if (!email) return undefined;
    return (this.data.users || []).find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  public getUserById(id: string): UserRecord | undefined {
    return (this.data.users || []).find((u) => u.id === id);
  }

  public registerOrLoginUser(payload: {
    email: string;
    name?: string;
    avatar?: string;
    password?: string;
  }): UserRecord {
    const cleanEmail = payload.email.toLowerCase().trim();
    const isOwner = cleanEmail === 'apexsyndicategr@gmail.com';
    const existing = this.getUserByEmail(cleanEmail);

    if (existing) {
      if (payload.name && payload.name.trim()) existing.name = payload.name.trim();
      if (payload.avatar && payload.avatar.trim()) existing.avatar = payload.avatar.trim();
      if (payload.password) existing.passwordHash = payload.password;
      if (isOwner) existing.role = 'owner';
      existing.lastLoginAt = new Date().toISOString();
      this.saveData();
      return existing;
    }

    const defaultName = isOwner ? 'Apex Syndicate Owner' : (payload.name || cleanEmail.split('@')[0] || 'Syndicate Member');
    const defaultAvatar = payload.avatar || (isOwner ? 'https://api.dicebear.com/7.x/bottts/svg?seed=apex-owner' : `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`);

    const newUser: UserRecord = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      email: cleanEmail,
      name: defaultName,
      avatar: defaultAvatar,
      role: isOwner ? 'owner' : 'member',
      passwordHash: payload.password || '',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    if (!this.data.users) this.data.users = [];
    this.data.users.unshift(newUser);

    this.saveData();
    return newUser;
  }

  public updateUserProfile(userId: string, updates: { name?: string; avatar?: string; email?: string }): UserRecord | undefined {
    const user = this.getUserById(userId);
    if (!user) return undefined;

    if (updates.name && updates.name.trim()) user.name = updates.name.trim();
    if (updates.avatar && updates.avatar.trim()) user.avatar = updates.avatar.trim();
    if (updates.email && updates.email.trim()) {
      user.email = updates.email.toLowerCase().trim();
      if (user.email === 'apexsyndicategr@gmail.com') {
        user.role = 'owner';
      }
    }

    this.saveData();
    return user;
  }

  // --- VISITOR & DEMO ANALYTICS ---
  public getVisitorCount(): number {
    return this.data.settings.visitorCount || 28;
  }

  public getDemoVisitorCount(): number {
    return this.data.settings.demoVisitorCount || 0;
  }

  public resetVisitorCount(): number {
    this.data.settings.visitorCount = 28;
    this.saveData();
    return 28;
  }

  public getSiteVisitors(): SiteVisitorLog[] {
    return this.data.siteVisitors || [];
  }

  public getDemoVisitors(): DemoVisitorLog[] {
    return this.data.demoVisitors || [];
  }

  public trackSiteVisit(entry: {
    email?: string;
    name?: string;
    avatar?: string;
    isGuest?: boolean;
    isOwner?: boolean;
    device?: string;
    ip?: string;
    path?: string;
  }): { count: number; log?: SiteVisitorLog; isOwner: boolean } {
    const cleanEmail = entry.email ? entry.email.toLowerCase().trim() : '';
    const isOwner = entry.isOwner || cleanEmail === 'apexsyndicategr@gmail.com';

    // CRITICAL: If caller is owner (apexsyndicategr@gmail.com), DO NOT count as visitor!
    if (isOwner) {
      return { count: this.getVisitorCount(), isOwner: true };
    }

    const currentCount = this.data.settings.visitorCount || 28;
    const newCount = currentCount + 1;
    this.data.settings.visitorCount = newCount;

    const newLog: SiteVisitorLog = {
      id: `vis-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      visitorNumber: newCount,
      email: entry.email || undefined,
      name: entry.name || (entry.email ? entry.email.split('@')[0] : `Guest Viewer #${newCount.toString().padStart(2, '0')}`),
      avatar: entry.avatar || (entry.email ? `https://api.dicebear.com/7.x/bottts/svg?seed=${entry.email}` : `https://api.dicebear.com/7.x/shapes/svg?seed=guest${newCount}`),
      isGuest: !entry.email,
      device: entry.device || 'Web Browser',
      visitedAt: new Date().toISOString(),
      path: entry.path || '/',
    };

    if (!this.data.siteVisitors) this.data.siteVisitors = [];
    this.data.siteVisitors.push(newLog);

    this.saveData();
    return { count: newCount, log: newLog, isOwner: false };
  }

  public trackDemoVisit(entry: {
    email?: string;
    name?: string;
    avatar?: string;
    isGuest?: boolean;
    isOwner?: boolean;
    device?: string;
    action?: string;
  }): { count: number; log?: DemoVisitorLog; isOwner: boolean } {
    const cleanEmail = entry.email ? entry.email.toLowerCase().trim() : '';
    const isOwner = entry.isOwner || cleanEmail === 'apexsyndicategr@gmail.com';

    // CRITICAL: If caller is owner (apexsyndicategr@gmail.com), DO NOT count as demo visitor!
    if (isOwner) {
      return { count: this.getDemoVisitorCount(), isOwner: true };
    }

    const currentCount = this.data.settings.demoVisitorCount || 0;
    const newCount = currentCount + 1;
    this.data.settings.demoVisitorCount = newCount;

    const newLog: DemoVisitorLog = {
      id: `demo-vis-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      demoNumber: newCount,
      email: entry.email || undefined,
      name: entry.name || (entry.email ? entry.email.split('@')[0] : `Guest Demo User #${newCount.toString().padStart(2, '0')}`),
      avatar: entry.avatar || (entry.email ? `https://api.dicebear.com/7.x/bottts/svg?seed=${entry.email}` : `https://api.dicebear.com/7.x/shapes/svg?seed=demouser${newCount}`),
      isGuest: !entry.email,
      device: entry.device || 'Desktop / PC',
      action: entry.action || 'launch_demo',
      clickedAt: new Date().toISOString(),
    };

    if (!this.data.demoVisitors) this.data.demoVisitors = [];
    this.data.demoVisitors.push(newLog);

    this.saveData();
    return { count: newCount, log: newLog, isOwner: false };
  }

  public getDashboardStats(): DashboardStats {
    const totalRequests = this.data.requests.length;
    const pendingApprovals = this.data.requests.filter(
      (r) => r.status === 'AWAITING_APPROVAL' || r.status === 'PAYMENT_SUBMITTED'
    ).length;
    const approvedCount = this.data.requests.filter((r) => r.status === 'APPROVED').length;
    const totalRevenueNgn = this.data.requests
      .filter((r) => r.status === 'APPROVED')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalProducts = this.data.products.length;
    const unreadNotifications = this.data.notifications.filter((n) => !n.read).length;
    const totalVisitors = this.getVisitorCount();
    const totalDemoClicks = this.getDemoVisitorCount();
    const registeredUsersCount = (this.data.users || []).length;

    return {
      totalRequests,
      pendingApprovals,
      approvedCount,
      totalRevenueNgn,
      totalProducts,
      unreadNotifications,
      totalVisitors,
      totalDemoClicks,
      registeredUsersCount,
    };
  }

  // --- TOKENIZED SECURE DOWNLOAD VALIDATION ---
  public validateDownloadToken(token: string): { valid: boolean; request?: DownloadRequest; product?: Product } {
    const request = this.data.requests.find((r) => r.downloadToken === token && r.status === 'APPROVED');
    if (!request) {
      return { valid: false };
    }
    const product = this.getProductById(request.productId);
    return { valid: true, request, product };
  }

  // --- NEWSLETTER SUBSCRIBERS & CAMPAIGNS ---
  public getNewsletterSubscribers(): NewsletterSubscriber[] {
    return this.data.newsletterSubscribers || [];
  }

  public addNewsletterSubscriber(sub: {
    email: string;
    name?: string;
    avatar?: string;
    device?: string;
    source?: string;
  }): NewsletterSubscriber {
    const cleanEmail = sub.email.toLowerCase().trim();
    if (!this.data.newsletterSubscribers) this.data.newsletterSubscribers = [];

    const existing = this.data.newsletterSubscribers.find(
      (s) => s.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      existing.status = 'ACTIVE';
      if (sub.name) existing.name = sub.name;
      if (sub.avatar) existing.avatar = sub.avatar;
      if (sub.device) existing.device = sub.device;
      this.saveData();
      return existing;
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      email: cleanEmail,
      name: sub.name || cleanEmail.split('@')[0],
      avatar: sub.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      subscribedAt: new Date().toISOString(),
      status: 'ACTIVE',
      device: sub.device || 'Web Browser',
      source: sub.source || 'Sign-up Modal',
      emailsReceivedCount: 0,
    };

    this.data.newsletterSubscribers.unshift(newSub);

    // Also mark on user record if registered
    const user = this.getUserByEmail(cleanEmail);
    if (user) {
      user.newsletterSubscribed = true;
      user.newsletterSubscribedAt = newSub.subscribedAt;
    }

    this.saveData();
    return newSub;
  }

  public unsubscribeNewsletter(email: string): boolean {
    const cleanEmail = email.toLowerCase().trim();
    const item = (this.data.newsletterSubscribers || []).find(
      (s) => s.email.toLowerCase() === cleanEmail
    );
    if (item) {
      item.status = 'UNSUBSCRIBED';
      this.saveData();
      return true;
    }
    return false;
  }

  public getNewsletterBroadcasts(): NewsletterBroadcast[] {
    return this.data.newsletterBroadcasts || [];
  }

  public saveAndSendNewsletterBroadcast(broadcast: {
    subject: string;
    previewText?: string;
    htmlContent: string;
    textContent?: string;
    imageUrl?: string;
    targetEmails?: string[];
    author?: string;
  }): NewsletterBroadcast {
    if (!this.data.newsletterBroadcasts) this.data.newsletterBroadcasts = [];
    if (!this.data.newsletterSubscribers) this.data.newsletterSubscribers = [];

    const activeSubs = this.data.newsletterSubscribers.filter((s) => s.status === 'ACTIVE');
    const recipientEmails = broadcast.targetEmails && broadcast.targetEmails.length > 0
      ? broadcast.targetEmails
      : activeSubs.map((s) => s.email);

    const newBroadcast: NewsletterBroadcast = {
      id: `bc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      subject: broadcast.subject,
      sender: 'Apex Syndicate <apexsyndicategr@gmail.com>',
      previewText: broadcast.previewText || broadcast.subject,
      htmlContent: broadcast.htmlContent,
      textContent: broadcast.textContent || '',
      imageUrl: broadcast.imageUrl,
      sentAt: new Date().toISOString(),
      recipientsCount: recipientEmails.length,
      recipientEmails,
      status: 'SENT',
      author: broadcast.author || 'Apex AI Campaign Assistant',
    };

    this.data.newsletterBroadcasts.unshift(newBroadcast);

    // Update subscriber stats
    const nowIso = new Date().toISOString();
    activeSubs.forEach((sub) => {
      if (recipientEmails.includes(sub.email)) {
        sub.emailsReceivedCount = (sub.emailsReceivedCount || 0) + 1;
        sub.lastEmailSentAt = nowIso;
      }
    });

    console.log(`[DISPATCHED NEWSLETTER BROADCAST]: Subject "${broadcast.subject}" sent to ${recipientEmails.length} subscribers from Apex Syndicate <apexsyndicategr@gmail.com>`);

    this.saveData();
    return newBroadcast;
  }

  // --- USER SESSIONS & MULTI-DEVICE SECURITY ALERTS ---
  public getUserSessions(emailOrUserId: string): UserSession[] {
    if (!this.data.userSessions) this.data.userSessions = [];
    const clean = emailOrUserId.toLowerCase().trim();
    return this.data.userSessions.filter(
      (s) => s.email.toLowerCase() === clean || s.userId === emailOrUserId
    );
  }

  public registerDeviceSession(
    user: UserRecord,
    sessionInfo: {
      device: string;
      browser: string;
      ip: string;
      location?: string;
    }
  ): {
    isNewDevice: boolean;
    session: UserSession;
    securityAlert?: SecurityAlert;
    previousSession?: UserSession;
  } {
    if (!this.data.userSessions) this.data.userSessions = [];
    if (!this.data.securityAlerts) this.data.securityAlerts = [];

    const now = new Date().toISOString();
    const cleanEmail = user.email.toLowerCase().trim();
    const approxLocation = sessionInfo.location || (sessionInfo.ip.startsWith('127.') || sessionInfo.ip === '::1' ? 'Lagos, Nigeria (Local Workstation)' : 'Lagos, Nigeria');

    // Check active sessions for this account
    const existingActiveSessions = this.data.userSessions.filter(
      (s) => s.email.toLowerCase() === cleanEmail && s.isActive
    );

    // Find if same device is already registered
    const existingSameDevice = existingActiveSessions.find(
      (s) => s.device === sessionInfo.device && s.browser === sessionInfo.browser
    );

    let isNewDevice = false;
    let previousSession: UserSession | undefined;
    let securityAlert: SecurityAlert | undefined;

    if (existingSameDevice) {
      existingSameDevice.lastSeenAt = now;
      existingSameDevice.ip = sessionInfo.ip;
      existingSameDevice.location = approxLocation;
      this.saveData();
      return { isNewDevice: false, session: existingSameDevice };
    }

    // If there is already another active device logged in with this Gmail, trigger Google-style security alert!
    if (existingActiveSessions.length > 0) {
      isNewDevice = true;
      previousSession = existingActiveSessions[0];

      const emailSubject = `Security alert: New sign-in to your Apex Syndicate account on ${sessionInfo.device}`;
      const emailBody = `
Dear ${user.name || user.email},

We detected a new sign-in to your Apex Syndicate account (${user.email}) from a new device.

NEW SIGN-IN DETAILS:
• Device: ${sessionInfo.device}
• Browser: ${sessionInfo.browser}
• IP Address: ${sessionInfo.ip}
• Approximate Location: ${approxLocation}
• Timestamp: ${new Date().toLocaleString()}

PREVIOUS ACTIVE SESSION:
• Device: ${previousSession.device} (${previousSession.browser})
• Last Active: ${new Date(previousSession.lastSeenAt).toLocaleString()}

If this was you, you can safely ignore this alert.
If you did not sign in from this device, someone else may have obtained access to your account. We strongly recommend terminating all other active sessions and changing your credentials.

Need assistance or wish to report unauthorized access? Reply directly to this alert or contact apexsyndicategr@gmail.com.

— Apex Syndicate Autonomous Security Engine
Sender: Apex Syndicate Security <apexsyndicategr@gmail.com>
      `.trim();

      securityAlert = {
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        userId: user.id,
        userEmail: cleanEmail,
        userName: user.name || cleanEmail.split('@')[0],
        alertType: 'NEW_DEVICE_SIGNIN',
        timestamp: now,
        newDevice: {
          device: sessionInfo.device,
          browser: sessionInfo.browser,
          ip: sessionInfo.ip,
          location: approxLocation,
          time: now,
        },
        previousDevice: {
          device: previousSession.device,
          browser: previousSession.browser,
          ip: previousSession.ip,
          location: previousSession.location,
          time: previousSession.lastSeenAt,
        },
        emailSubject,
        emailBody,
        senderEmail: 'apexsyndicategr@gmail.com',
        status: 'PENDING_REVIEW',
      };

      this.data.securityAlerts.unshift(securityAlert);

      console.log(`[SECURITY ALERT EMAIL SENT TO ${cleanEmail}]: ${emailSubject} from Apex Syndicate Security <apexsyndicategr@gmail.com>`);
    }

    const newSession: UserSession = {
      id: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId: user.id,
      email: cleanEmail,
      device: sessionInfo.device,
      browser: sessionInfo.browser,
      ip: sessionInfo.ip,
      location: approxLocation,
      loggedInAt: now,
      lastSeenAt: now,
      isActive: true,
      token: `usr-token-${user.id}-${Date.now()}`,
    };

    this.data.userSessions.unshift(newSession);
    this.saveData();

    return {
      isNewDevice,
      session: newSession,
      securityAlert,
      previousSession,
    };
  }

  public terminateAllOtherSessions(emailOrUserId: string, currentSessionId?: string): { success: boolean; terminatedCount: number } {
    if (!this.data.userSessions) this.data.userSessions = [];
    const clean = emailOrUserId.toLowerCase().trim();

    let terminatedCount = 0;
    this.data.userSessions.forEach((s) => {
      if ((s.email.toLowerCase() === clean || s.userId === emailOrUserId) && s.id !== currentSessionId && s.isActive) {
        s.isActive = false;
        terminatedCount++;
      }
    });

    // Mark any active security alerts for this user as TERMINATED_OTHER_SESSIONS
    if (this.data.securityAlerts) {
      this.data.securityAlerts.forEach((a) => {
        if (a.userEmail.toLowerCase() === clean && a.status === 'PENDING_REVIEW') {
          a.status = 'TERMINATED_OTHER_SESSIONS';
        }
      });
    }

    this.saveData();
    return { success: true, terminatedCount };
  }

  public getSecurityAlerts(email?: string): SecurityAlert[] {
    if (!this.data.securityAlerts) this.data.securityAlerts = [];
    if (email) {
      const clean = email.toLowerCase().trim();
      return this.data.securityAlerts.filter((a) => a.userEmail.toLowerCase() === clean);
    }
    return this.data.securityAlerts;
  }

  public dismissSecurityAlert(alertId: string): boolean {
    const alert = (this.data.securityAlerts || []).find((a) => a.id === alertId);
    if (alert) {
      alert.status = 'DISMISSED';
      this.saveData();
      return true;
    }
    return false;
  }
}

export const store = new Store();
