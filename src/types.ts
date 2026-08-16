export type ProductCategory = 'Editor' | 'Tools' | 'Games' | 'Plugins' | 'Utilities';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  fullDescription: string;
  version: string;
  releaseDate: string;
  isFeatured: boolean;
  isPublished: boolean;
  isComingSoon?: boolean;
  pricingType: 'launch' | 'free' | 'fixed' | 'tbd';
  fixedPrice?: number; // In NGN ₦ if fixed
  iconName?: string;
  logoUrl?: string;
  fileUrl?: string;
  fileSize?: string;
  externalUrl?: string; // Optional external Web Application URL (e.g. ChatGPT, web app, or external site)
  systemRequirements?: {
    os: string;
    processor: string;
    memory: string;
    storage: string;
  };
  features: string[];
  screenshots: string[];
  whatsNew?: string[];
}

export type LaunchPhase = 'free' | 'early' | 'full';

export interface LaunchPricingInfo {
  launchDate: string; // ISO date string
  currentDayNumber: number; // 1-indexed
  activePhase: LaunchPhase;
  currentPrice: number; // 0, 5000, 17000
  phaseName: string; // "FREE LAUNCH ACCESS", "EARLY ACCESS — ₦5,000", "FULL PRICE — ₦17,000"
  priceDisplay: string; // "FREE" or "₦5,000" or "₦17,000"
  phaseEndsAt: string; // ISO date string when current phase ends
  secondsRemaining: number;
  isPaused?: boolean;
}

export type RequestStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_SUBMITTED'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED';

export interface DownloadRequest {
  id: string;
  requestId: string; // e.g. APEX-REQ-892014
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  productVersion: string;
  amount: number;
  currency: string; // 'NGN'
  status: RequestStatus;
  paymentProofRef?: string;
  requestDate: string; // ISO string
  approvalDate?: string;
  downloadToken?: string;
  rejectionReason?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'request' | 'contact' | 'system';
  createdAt: string;
  read: boolean;
  requestId?: string;
}

export interface CustomTab {
  id: string;
  label: string;
  iconName?: string;
  content: string; // Markdown or HTML text content
  isActive: boolean;
}

export interface OwnerSettings {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankInstructions: string;
  ownerEmail: string;
  launchDateApexEditor: string; // ISO date string e.g. "2026-08-01T00:00:00.000Z"
  timerPaused?: boolean;
  timerPausedSecondsRemaining?: number;
  freeDays?: number; // Default 14
  earlyDays?: number; // Default 14
  earlyPrice?: number; // Default 5000
  fullPrice?: number; // Default 17000
  autoApproveFree: boolean;
  adminPassword: string;
  // Custom Site Customization
  heroTitle?: string;
  heroSubtitle?: string;
  announcementText?: string;
  showAnnouncement?: boolean;
  customTabs?: CustomTab[];
  portfolioVideoMode?: 'default' | 'custom' | 'blank';
  portfolioVideoUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  category: 'General Question' | 'Bug Report' | 'Business Request' | 'Product Support' | 'Complaint' | 'Feature Request';
  message: string;
  createdAt: string;
  read: boolean;
}

export interface DashboardStats {
  totalRequests: number;
  pendingApprovals: number;
  approvedCount: number;
  totalRevenueNgn: number;
  totalProducts: number;
  unreadNotifications: number;
}
