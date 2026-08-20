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
} from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

export interface StoreData {
  products: Product[];
  requests: DownloadRequest[];
  notifications: AdminNotification[];
  settings: OwnerSettings;
  contacts: ContactMessage[];
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
        if (!loadedSettings.apexEditorDemoUrl || loadedSettings.apexEditorDemoUrl.trim() === '') {
          loadedSettings.apexEditorDemoUrl = 'https://apex-editor-demo.vercel.app/';
        }
        return {
          products: parsed.products || defaultState.products,
          requests: parsed.requests || defaultState.requests,
          notifications: parsed.notifications || defaultState.notifications,
          settings: loadedSettings,
          contacts: parsed.contacts || defaultState.contacts,
        };
      }
    } catch (err) {
      console.error('Error reading store file, using default seed:', err);
    }

    const initial = getDefaultData();
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

  // --- VISITOR ANALYTICS ---
  public getVisitorCount(): number {
    return this.data.settings.visitorCount || 0;
  }

  public incrementVisitorCount(): number {
    const current = this.data.settings.visitorCount || 0;
    this.data.settings.visitorCount = current + 1;
    this.saveData();
    return this.data.settings.visitorCount;
  }

  public resetVisitorCount(): number {
    this.data.settings.visitorCount = 0;
    this.saveData();
    return 0;
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

    return {
      totalRequests,
      pendingApprovals,
      approvedCount,
      totalRevenueNgn,
      totalProducts,
      unreadNotifications,
      totalVisitors,
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
}

export const store = new Store();
