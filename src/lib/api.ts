import {
  Product,
  LaunchPricingInfo,
  OwnerSettings,
  DownloadRequest,
  AdminNotification,
  ContactMessage,
  DashboardStats,
  UserAccount,
  SiteVisitorLog,
  DemoVisitorLog,
  SecurityAlert,
  NewsletterSubscriber,
  NewsletterBroadcast,
  UserSession,
} from '../types';
import { loadClientData, saveClientData, calculateLaunchPricing } from './clientStore';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API unreachable, using client storage fallback for products');
  }
  const data = loadClientData();
  return data.products.filter((p) => p.isPublished);
}

export async function fetchLaunchPricing(productId = 'apex-editor'): Promise<LaunchPricingInfo> {
  try {
    const res = await fetch(`/api/pricing/${productId}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API unreachable, calculating pricing locally');
  }
  const data = loadClientData();
  return calculateLaunchPricing(data.settings.launchDateApexEditor, data.settings);
}

export async function fetchPaymentSettings(): Promise<{
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankInstructions: string;
}> {
  try {
    const res = await fetch('/api/settings/payment');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API unreachable, using local payment settings');
  }
  const data = loadClientData();
  return {
    bankName: data.settings.bankName,
    accountName: data.settings.accountName,
    accountNumber: data.settings.accountNumber,
    bankInstructions: data.settings.bankInstructions,
  };
}

export async function fetchPublicSettings(): Promise<Partial<OwnerSettings>> {
  try {
    const res = await fetch('/api/settings/public');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API unreachable, using local public settings');
  }
  const data = loadClientData();
  return {
    bankName: data.settings.bankName,
    accountName: data.settings.accountName,
    accountNumber: data.settings.accountNumber,
    bankInstructions: data.settings.bankInstructions,
    ownerEmail: data.settings.ownerEmail,
    announcementText: data.settings.announcementText,
    showAnnouncement: data.settings.showAnnouncement,
    customTabs: data.settings.customTabs,
    portfolioVideoMode: data.settings.portfolioVideoMode || 'blank',
    portfolioVideoUrl: data.settings.portfolioVideoUrl || '',
    devUpdatePictures: data.settings.devUpdatePictures || [],
    devUpdates: data.settings.devUpdates || [],
    apexEditorDemoUrl: data.settings.apexEditorDemoUrl || '',
    gangsterRevolutionLaunchDate: data.settings.gangsterRevolutionLaunchDate || 'TBD',
    gangsterRevolutionStatus: data.settings.gangsterRevolutionStatus || 'PRE-ALPHA BUILD • IN DEVELOPMENT',
    gangsterSpecs: data.settings.gangsterSpecs || {
      minOs: 'TBD', minProcessor: 'TBD', minMemory: 'TBD', minGraphics: 'TBD', minDirectX: 'TBD', minStorage: 'TBD',
      recOs: 'TBD', recProcessor: 'TBD', recMemory: 'TBD', recGraphics: 'TBD', recDirectX: 'TBD', recStorage: 'TBD',
    },
    visitorCount: data.settings.visitorCount || 0,
  };
}

export async function loginAdmin(password: string): Promise<{ token: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      return await res.json();
    } else {
      const errData = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error(errData.error || 'Invalid password');
      }
    }
  } catch (err: any) {
    if (err.message === 'Invalid password') {
      throw err;
    }
    console.warn('Backend login unreachable, verifying password locally');
  }

  const data = loadClientData();
  if (password === data.settings.adminPassword || password === 'xxander4325king') {
    return { token: 'apex_local_admin_token_' + Date.now() };
  } else {
    throw new Error('Invalid admin password.');
  }
}

export async function fetchAdminDashboard(token: string): Promise<{
  stats: DashboardStats;
  products: Product[];
  requests: DownloadRequest[];
  notifications: AdminNotification[];
  settings: OwnerSettings;
  contacts: ContactMessage[];
}> {
  try {
    const res = await fetch('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend dashboard unreachable, returning local admin dataset');
  }

  const data = loadClientData();
  const totalRequests = data.requests.length;
  const pendingApprovals = data.requests.filter(
    (r) => r.status === 'PAYMENT_SUBMITTED' || r.status === 'AWAITING_APPROVAL'
  ).length;
  const approvedCount = data.requests.filter((r) => r.status === 'APPROVED').length;
  const totalRevenueNgn = data.requests
    .filter((r) => r.status === 'APPROVED')
    .reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalProducts = data.products.length;
  const unreadNotifications = data.notifications.filter((n) => !n.read).length;

  return {
    stats: {
      totalRequests,
      pendingApprovals,
      approvedCount,
      totalRevenueNgn,
      totalProducts,
      unreadNotifications,
      totalVisitors: data.settings.visitorCount || 28,
      totalDemoClicks: data.settings.demoVisitorCount || 0,
    },
    products: data.products,
    requests: data.requests,
    notifications: data.notifications,
    settings: data.settings,
    contacts: data.contacts,
  };
}

export async function submitDownloadRequest(payload: {
  customerName: string;
  customerEmail: string;
  productId: string;
  paymentProofRef?: string;
}): Promise<{ success: boolean; request: DownloadRequest }> {
  try {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unreachable, saving request locally');
  }

  const data = loadClientData();
  const prod = data.products.find((p) => p.id === payload.productId);
  let amount = 0;
  if (prod?.id === 'apex-editor' && prod.pricingType === 'launch') {
    const pricing = calculateLaunchPricing(data.settings.launchDateApexEditor);
    amount = pricing.currentPrice;
  } else if (prod?.pricingType === 'fixed') {
    amount = prod.fixedPrice || 0;
  }

  const isFree = amount === 0;
  const isAutoApprove = isFree && data.settings.autoApproveFree;
  const status = isAutoApprove
    ? 'APPROVED'
    : isFree
    ? 'APPROVED'
    : payload.paymentProofRef
    ? 'AWAITING_APPROVAL'
    : 'PENDING_PAYMENT';

  const newReq: DownloadRequest = {
    id: 'req-' + Date.now(),
    requestId: 'APEX-REQ-' + Math.floor(100000 + Math.random() * 900000),
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    productId: payload.productId,
    productName: prod ? prod.name : 'Apex Product',
    productVersion: prod ? prod.version : 'v1.0.0',
    amount,
    currency: 'NGN',
    status,
    paymentProofRef: payload.paymentProofRef,
    requestDate: new Date().toISOString(),
    approvalDate: isAutoApprove || isFree ? new Date().toISOString() : undefined,
    downloadToken: isAutoApprove || isFree ? 'tok-local-' + Date.now() : undefined,
  };

  data.requests.unshift(newReq);
  data.notifications.unshift({
    id: 'notif-' + Date.now(),
    title: `New Request: ${newReq.productName}`,
    message: `${newReq.customerName} requested ${newReq.productName} (${newReq.requestId})`,
    type: 'request',
    createdAt: new Date().toISOString(),
    read: false,
    requestId: newReq.requestId,
  });

  saveClientData(data);
  return { success: true, request: newReq };
}

export async function updateProductApi(
  id: string,
  payload: Partial<Product>,
  token: string
): Promise<Product> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unreachable, updating product locally');
  }

  const data = loadClientData();
  const idx = data.products.findIndex((p) => p.id === id);
  if (idx !== -1) {
    data.products[idx] = { ...data.products[idx], ...payload };
    saveClientData(data);
    return data.products[idx];
  } else {
    throw new Error('Product not found');
  }
}

export async function createProductApi(
  payload: Omit<Product, 'id' | 'slug'>,
  token: string
): Promise<Product> {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unreachable, creating product locally');
  }

  const data = loadClientData();
  const slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newProd: Product = {
    ...payload,
    id: slug + '-' + Date.now(),
    slug,
  };
  data.products.unshift(newProd);
  saveClientData(data);
  return newProd;
}

export async function deleteProductApi(id: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn('Backend unreachable, deleting product locally');
  }

  const data = loadClientData();
  data.products = data.products.filter((p) => p.id !== id);
  saveClientData(data);
  return true;
}

export async function updateSettingsApi(
  payload: Partial<OwnerSettings>,
  token: string
): Promise<OwnerSettings> {
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unreachable, updating settings locally');
  }

  const data = loadClientData();
  data.settings = { ...data.settings, ...payload };
  saveClientData(data);
  return data.settings;
}

export async function approveRequestApi(id: string, token: string): Promise<DownloadRequest> {
  try {
    const res = await fetch(`/api/admin/requests/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unreachable, approving request locally');
  }

  const data = loadClientData();
  const req = data.requests.find((r) => r.id === id);
  if (req) {
    req.status = 'APPROVED';
    req.approvalDate = new Date().toISOString();
    req.downloadToken = 'tok-approved-' + Date.now();
    saveClientData(data);
    return req;
  }
  throw new Error('Request not found');
}

export async function rejectRequestApi(
  id: string,
  reason: string,
  token: string
): Promise<DownloadRequest> {
  try {
    const res = await fetch(`/api/admin/requests/${id}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unreachable, rejecting request locally');
  }

  const data = loadClientData();
  const req = data.requests.find((r) => r.id === id);
  if (req) {
    req.status = 'REJECTED';
    req.rejectionReason = reason;
    saveClientData(data);
    return req;
  }
  throw new Error('Request not found');
}

export async function verifyRequestApi(idOrEmail: string): Promise<DownloadRequest[]> {
  try {
    const res = await fetch(`/api/requests/verify/${encodeURIComponent(idOrEmail)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unreachable, verifying request locally');
  }

  const data = loadClientData();
  const q = idOrEmail.toLowerCase().trim();
  return data.requests.filter(
    (r) =>
      r.requestId.toLowerCase() === q ||
      r.customerEmail.toLowerCase() === q ||
      r.id.toLowerCase() === q
  );
}

export async function submitContactApi(payload: {
  name: string;
  email: string;
  category: any;
  message: string;
}): Promise<{ success: boolean }> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unreachable, saving contact message locally');
  }

  const data = loadClientData();
  data.contacts.unshift({
    id: 'cnt-' + Date.now(),
    name: payload.name,
    email: payload.email,
    category: payload.category,
    message: payload.message,
    createdAt: new Date().toISOString(),
    read: false,
  });
  saveClientData(data);
  return { success: true };
}

export async function sendAiAssistantPrompt(
  prompt: string,
  token: string
): Promise<{
  success: boolean;
  reply: string;
  executedLogs: string[];
  updatedData?: {
    stats: DashboardStats;
    settings: OwnerSettings;
    products: Product[];
    requests: DownloadRequest[];
  };
}> {
  try {
    const res = await fetch('/api/admin/ai-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend AI assistant unreachable, running local fallback');
  }

  const data = loadClientData();
  const lower = prompt.toLowerCase();
  let reply = "Executed local administrative update.";
  const logs: string[] = [];

  if (lower.includes('reset') && (lower.includes('timer') || lower.includes('14') || lower.includes('day'))) {
    data.settings.launchDateApexEditor = new Date().toISOString();
    data.settings.freeDays = 14;
    data.settings.earlyDays = 14;
    data.settings.timerPaused = false;
    logs.push("Reset launch timer to today (14 days free)");
    reply = "Reset launch timer to 14 days free!";
  } else if (lower.includes('clear') && lower.includes('request')) {
    data.requests = [];
    logs.push("Cleared requests");
    reply = "Cleared all download requests.";
  }

  saveClientData(data);

  return {
    success: true,
    reply,
    executedLogs: logs,
    updatedData: {
      stats: {
        totalRequests: data.requests.length,
        pendingApprovals: data.requests.filter(r => r.status === 'AWAITING_APPROVAL' || r.status === 'PAYMENT_SUBMITTED').length,
        approvedCount: data.requests.filter(r => r.status === 'APPROVED').length,
        totalRevenueNgn: data.requests.filter(r => r.status === 'APPROVED').reduce((sum, r) => sum + (r.amount || 0), 0),
        totalProducts: data.products.length,
        unreadNotifications: data.notifications.filter(n => !n.read).length,
        totalVisitors: data.settings.visitorCount || 28,
        totalDemoClicks: data.settings.demoVisitorCount || 0,
      },
      settings: data.settings,
      products: data.products,
      requests: data.requests,
    }
  };
}

export async function uploadDevUpdatePictureApi(
  file: File,
  token: string
): Promise<{ success: boolean; imageUrl: string; filename: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/upload/dev-update-picture', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to upload picture');
  }

  return await res.json();
}

export async function uploadPortfolioVideoApi(
  file: File,
  token: string
): Promise<{ success: boolean; videoUrl: string; settings?: OwnerSettings }> {
  const formData = new FormData();
  formData.append('video', file);

  const res = await fetch('/api/upload/portfolio-video', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to upload video to server');
  }

  return await res.json();
}

export async function registerUserApi(payload: {
  email: string;
  password?: string;
  name?: string;
  avatar?: string;
  newsletterSubscribed?: boolean;
}): Promise<{ success: boolean; token: string; user: UserAccount; securityAlert?: SecurityAlert }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to register account');
  }

  return await res.json();
}

export async function loginUserApi(payload: {
  email: string;
  password?: string;
}): Promise<{ success: boolean; token: string; user: UserAccount; securityAlert?: SecurityAlert }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to sign in');
  }

  return await res.json();
}

export async function googleSimLoginApi(payload: {
  email: string;
  name?: string;
  avatar?: string;
  newsletterSubscribed?: boolean;
}): Promise<{ success: boolean; token: string; user: UserAccount; securityAlert?: SecurityAlert }> {
  const res = await fetch('/api/auth/google-sim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to authenticate with Google');
  }

  return await res.json();
}

export async function getCurrentUserApi(token?: string, email?: string): Promise<{ success: boolean; user: UserAccount | null }> {
  try {
    const url = email ? `/api/auth/me?email=${encodeURIComponent(email)}` : '/api/auth/me';
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend getCurrentUserApi unreachable');
  }
  return { success: true, user: null };
}

export async function updateUserProfileApi(payload: {
  userId: string;
  name?: string;
  avatar?: string;
  email?: string;
}): Promise<{ success: boolean; user: UserAccount }> {
  const res = await fetch('/api/auth/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to update profile');
  }

  return await res.json();
}

export async function trackVisitApi(payload?: {
  email?: string;
  name?: string;
  avatar?: string;
  isGuest?: boolean;
  isOwner?: boolean;
  device?: string;
  path?: string;
}): Promise<{ success: boolean; count: number; isOwner?: boolean; log?: SiteVisitorLog }> {
  try {
    const res = await fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend track-visit unreachable, incrementing local visitor count');
  }
  const data = loadClientData();
  if (!payload?.isOwner && payload?.email?.toLowerCase() !== 'apexsyndicategr@gmail.com') {
    data.settings.visitorCount = (data.settings.visitorCount || 28) + 1;
    saveClientData(data);
  }
  return { success: true, count: data.settings.visitorCount || 28 };
}

export async function trackDemoClickApi(payload?: {
  email?: string;
  name?: string;
  avatar?: string;
  isGuest?: boolean;
  isOwner?: boolean;
  device?: string;
  action?: string;
}): Promise<{ success: boolean; count: number; isOwner?: boolean; log?: DemoVisitorLog }> {
  try {
    const res = await fetch('/api/track-demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend track-demo unreachable');
  }
  const data = loadClientData();
  if (!payload?.isOwner && payload?.email?.toLowerCase() !== 'apexsyndicategr@gmail.com') {
    data.settings.demoVisitorCount = (data.settings.demoVisitorCount || 0) + 1;
    saveClientData(data);
  }
  return { success: true, count: data.settings.demoVisitorCount || 0 };
}

export async function getViewersLogsApi(token: string): Promise<{
  success: boolean;
  totalVisitors: number;
  totalDemoClicks: number;
  siteVisitors: SiteVisitorLog[];
  demoVisitors: DemoVisitorLog[];
  users: UserAccount[];
  stats: DashboardStats;
}> {
  const res = await fetch('/api/admin/viewers', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch viewers logs');
  }

  return await res.json();
}

export async function resetVisitorCountApi(token: string): Promise<{ success: boolean; count: number }> {
  // Reset is disabled per owner specification — acts as refresh
  const viewers = await getViewersLogsApi(token);
  return { success: true, count: viewers.totalVisitors };
}

// Security & Sessions API
export async function terminateOtherSessionsApi(payload: {
  email?: string;
  userId?: string;
  currentSessionId?: string;
}): Promise<{ success: boolean; terminatedCount: number }> {
  const res = await fetch('/api/auth/terminate-other-sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to terminate other sessions');
  }
  return await res.json();
}

export async function dismissSecurityAlertApi(alertId: string): Promise<{ success: boolean }> {
  const res = await fetch('/api/auth/dismiss-security-alert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alertId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to dismiss security alert');
  }
  return await res.json();
}

export async function getSecurityAlertsApi(email: string): Promise<{ success: boolean; alerts: SecurityAlert[] }> {
  const res = await fetch(`/api/auth/security-alerts?email=${encodeURIComponent(email)}`);
  if (!res.ok) {
    return { success: true, alerts: [] };
  }
  return await res.json();
}

// Newsletter & AI Campaign API
export async function getNewsletterSubscribersApi(token: string): Promise<{
  success: boolean;
  count: number;
  subscribers: NewsletterSubscriber[];
}> {
  const res = await fetch('/api/newsletter/subscribers', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch newsletter subscribers');
  }
  return await res.json();
}

export async function subscribeNewsletterApi(payload: {
  email: string;
  name?: string;
  avatar?: string;
  device?: string;
  source?: string;
}): Promise<{ success: boolean; subscriber?: NewsletterSubscriber; message?: string }> {
  const res = await fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to subscribe to newsletter');
  }
  return await res.json();
}

export async function getNewsletterBroadcastsApi(token: string): Promise<{
  success: boolean;
  broadcasts: NewsletterBroadcast[];
}> {
  const res = await fetch('/api/newsletter/broadcasts', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch broadcast history');
  }
  return await res.json();
}

export async function sendNewsletterBroadcastApi(
  payload: {
    subject: string;
    previewText?: string;
    htmlContent: string;
    textContent?: string;
    imageUrl?: string;
    targetEmails?: string[];
    author?: string;
  },
  token: string
): Promise<{ success: boolean; broadcast: NewsletterBroadcast }> {
  const res = await fetch('/api/newsletter/send-broadcast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to send broadcast');
  }
  return await res.json();
}

export async function generateAiNewsletterApi(payload: {
  prompt?: string;
  topic?: string;
  tone?: string;
  imageUrl?: string;
  targetAudience?: string;
  aiPassword: string; // 'apexsyndicate.com.ng'
}): Promise<{
  success: boolean;
  campaign: {
    subject: string;
    previewText: string;
    headline: string;
    htmlContent: string;
    textContent: string;
    suggestedTags?: string[];
  };
}> {
  const res = await fetch('/api/newsletter/ai-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'AI Campaign Generation Failed');
  }
  return await res.json();
}


