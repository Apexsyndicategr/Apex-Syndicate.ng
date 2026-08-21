import React, { useState, useEffect } from 'react';
import { Product, LaunchPricingInfo, OwnerSettings, CustomTab, UserAccount, SecurityAlert } from './types';
import { fetchProducts, fetchLaunchPricing, fetchPaymentSettings, fetchPublicSettings, trackVisitApi, getSecurityAlertsApi } from './lib/api';
import { loadClientData } from './lib/clientStore';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ApexEditor } from './pages/ApexEditor';
import { ApexEditorDemo } from './pages/ApexEditorDemo';
import { GangsterRevolution } from './pages/GangsterRevolution';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { CustomerNotifications } from './components/CustomerNotifications';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLoginModal } from './pages/AdminLoginModal';
import { AuthModal } from './components/AuthModal';
import { SecurityAlertModal } from './components/SecurityAlertModal';
import { DownloadModal } from './components/DownloadModal';
import { IntroCinematic } from './components/IntroCinematic';
import { AnimatedBackground } from './components/AnimatedBackground';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, FileText } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [launchPricing, setLaunchPricing] = useState<LaunchPricingInfo | null>(null);
  const [ownerSettings, setOwnerSettings] = useState<OwnerSettings | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<{
    bankName: string;
    accountName: string;
    accountNumber: string;
    bankInstructions: string;
  } | null>(null);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem('apex_current_user') || sessionStorage.getItem('apex_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEntryPrompt, setIsEntryPrompt] = useState(false);
  const [activeSecurityAlert, setActiveSecurityAlert] = useState<SecurityAlert | null>(null);

  // Check for active unread security alerts (multi-device login)
  useEffect(() => {
    if (currentUser?.email) {
      getSecurityAlertsApi(currentUser.email)
        .then((res) => {
          const unread = res.alerts?.find((a: SecurityAlert) => !a.isRead);
          if (unread) {
            setActiveSecurityAlert(unread);
          }
        })
        .catch(() => {});
    }
  }, [currentUser?.email]);

  // Admin Auth State (sessionStorage so closing tab auto logs out)
  const [adminToken, setAdminToken] = useState<string | null>(
    sessionStorage.getItem('apex_admin_token')
  );
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Download Request Modal State
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch Public Data with Resilient Real-Time Global Synchronization
  const fetchPublicData = async () => {
    try {
      const [prods, pricing, pay, pubSettings] = await Promise.all([
        fetchProducts(),
        fetchLaunchPricing('apex-editor'),
        fetchPaymentSettings(),
        fetchPublicSettings(),
      ]);

      const clientData = loadClientData();
      const mergedSettings: OwnerSettings = {
        ...clientData.settings,
        ...pubSettings,
      };

      setOwnerSettings(mergedSettings);
      setProducts(prods);
      setLaunchPricing(pricing);
      setPaymentSettings(pay);
    } catch (err) {
      console.error('Error loading public Apex Syndicate data:', err);
    }
  };

  useEffect(() => {
    // Increment visitor counter on new visit session (if not owner)
    if (!sessionStorage.getItem('apex_visited_session')) {
      sessionStorage.setItem('apex_visited_session', 'true');
      trackVisitApi().catch((e) => console.warn('Could not track visit:', e));
    }

    // On initial site entry, prompt user to sign up or log in, with option to continue as guest
    const hasUser = !!localStorage.getItem('apex_current_user') || !!sessionStorage.getItem('apex_current_user');
    const hasDismissed = !!sessionStorage.getItem('apex_entry_prompt_dismissed');

    if (!hasUser && !hasDismissed) {
      const timer = setTimeout(() => {
        setIsEntryPrompt(true);
        setIsAuthModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }

    fetchPublicData();

    // Global real-time sync across all connected visitor devices
    const interval = setInterval(() => {
      fetchPublicData();
    }, 4000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchPublicData();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', fetchPublicData);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', fetchPublicData);
    };
  }, []);

  // Secret Hotkey Sequence ('6872' or '5') Handler for Owner Portal Password Login
  useEffect(() => {
    let keyBuffer = '';
    let resetTimer: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          (activeEl as HTMLElement).isContentEditable);

      if (isInput) return;

      // Handle single hotkey '5'
      if (e.key === '5') {
        e.preventDefault();
        setIsAdminModalOpen(true);
        return;
      }

      // Handle key sequence buffer (typing '6872' anywhere on page)
      if (e.key.length === 1) {
        keyBuffer = (keyBuffer + e.key).slice(-10);

        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          keyBuffer = '';
        }, 3000);

        if (keyBuffer.endsWith('6872')) {
          keyBuffer = '';
          setIsAdminModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [adminToken]);

  const handleOpenDownloadModal = (product: Product) => {
    setSelectedProduct(product);
    setDownloadModalOpen(true);
  };

  const handleOpenAdminPortal = () => {
    if (adminToken) {
      setActiveTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('apex_admin_token');
    localStorage.removeItem('apex_admin_token');
    setAdminToken(null);
    setIsAdminModalOpen(false);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Modal Handlers
  const handleOpenAuthModal = () => {
    setIsEntryPrompt(false);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: UserAccount, token: string, securityAlert?: SecurityAlert) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('apex_current_user', JSON.stringify(user));
      sessionStorage.setItem('apex_current_user', JSON.stringify(user));
      sessionStorage.setItem('apex_entry_prompt_dismissed', 'true');
    } catch (e) {
      console.warn('Storage save warning:', e);
    }

    // Auto grant owner session if signed in as apexsyndicategr@gmail.com
    if (user.role === 'owner' || user.email?.toLowerCase().trim() === 'apexsyndicategr@gmail.com') {
      const ownerToken = token || 'apex-owner-session';
      setAdminToken(ownerToken);
      sessionStorage.setItem('apex_admin_token', ownerToken);
    }

    // Trigger multi-device security alert modal if another active device exists
    if (securityAlert) {
      setActiveSecurityAlert(securityAlert);
    }

    setIsAuthModalOpen(false);
    setIsEntryPrompt(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('apex_current_user');
    sessionStorage.removeItem('apex_current_user');
    handleAdminLogout();
  };

  const handleContinueAsGuest = () => {
    sessionStorage.setItem('apex_entry_prompt_dismissed', 'true');
    setIsAuthModalOpen(false);
    setIsEntryPrompt(false);
  };

  const apexEditorProduct = products.find((p) => p.id === 'apex-editor') || products[0] || null;
  const gangsterRevolutionProduct = products.find((p) => p.id === 'gangster-revolution') || null;

  // Selected Custom Tab Content
  const selectedCustomTabId = activeTab.startsWith('custom-')
    ? activeTab.replace('custom-', '')
    : null;
  const currentCustomTab = ownerSettings?.customTabs?.find(
    (t) => t.id === selectedCustomTabId
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#FF6321] selection:text-black relative overflow-x-hidden">
      {/* High-Performance Dynamic Animated Background Mesh, Floating Particles & Cyber Grid */}
      <AnimatedBackground />

      {/* Owner Custom Announcement Banner */}
      {ownerSettings?.showAnnouncement && ownerSettings.announcementText && activeTab !== 'admin' && (
        <div className="bg-gradient-to-r from-[#FF6321] via-amber-400 to-[#FF6321] text-black font-extrabold text-xs py-2 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2 relative z-50 animate-shimmer-text shadow-[0_4px_20px_rgba(255,99,33,0.4)]">
          <Sparkles className="w-4 h-4 fill-black animate-spin" style={{ animationDuration: '4s' }} />
          <span className="font-mono tracking-widest">{ownerSettings.announcementText}</span>
        </div>
      )}

      {/* Hide Navbar & Footer when inside full Admin Dashboard view */}
      {activeTab !== 'admin' && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openAdminModal={handleOpenAdminPortal}
          isAdminLoggedIn={!!adminToken}
          customTabs={ownerSettings?.customTabs}
          currentUser={currentUser}
          onOpenAuthModal={handleOpenAuthModal}
        />
      )}

      {/* Main Page Content Body with Smooth Page Transitions */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'home' && (
              <Home
                setActiveTab={setActiveTab}
                openDownloadModal={handleOpenDownloadModal}
                launchPricing={launchPricing}
                products={products}
              />
            )}

            {activeTab === 'products' && (
              <Products
                products={products}
                openDownloadModal={handleOpenDownloadModal}
                launchPricing={launchPricing}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'apex-editor' && (
              <ApexEditor
                product={apexEditorProduct}
                launchPricing={launchPricing}
                openDownloadModal={handleOpenDownloadModal}
                onRefreshPricing={fetchPublicData}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'apex-editor-demo' && (
              <ApexEditorDemo
                product={apexEditorProduct}
                settings={ownerSettings || undefined}
                openDownloadModal={handleOpenDownloadModal}
              />
            )}

            {activeTab === 'gangster-revolution' && (
              <GangsterRevolution
                product={gangsterRevolutionProduct}
                settings={ownerSettings || undefined}
                openDownloadModal={handleOpenDownloadModal}
              />
            )}

            {activeTab === 'about' && <About />}

            {activeTab === 'contact' && <Contact />}

            {activeTab === 'notifications' && <CustomerNotifications />}

            {/* Dynamic Custom Tab View */}
            {currentCustomTab && (
              <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="p-8 md:p-12 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide uppercase">
                      {currentCustomTab.label}
                    </h1>
                  </div>
                  <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line leading-relaxed text-base">
                    {currentCustomTab.content}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'admin' && adminToken && (
              <AdminDashboard
                token={adminToken}
                onLogout={handleAdminLogout}
                onDataChanged={fetchPublicData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {activeTab !== 'admin' && (
        <Footer setActiveTab={setActiveTab} openAdminModal={handleOpenAdminPortal} />
      )}

      {/* Customer Download Modal */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        product={selectedProduct}
        launchPricing={launchPricing}
        paymentSettings={paymentSettings}
      />

      {/* Owner Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Syndicate User Account Auth & Entry Prompt Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setIsEntryPrompt(false);
        }}
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
        onLogout={handleLogout}
        onOpenAdminPortal={handleOpenAdminPortal}
        onContinueAsGuest={handleContinueAsGuest}
        isEntryPrompt={isEntryPrompt}
      />

      {/* Google-Style Multi-Device Concurrent Login Security Alert Modal */}
      <SecurityAlertModal
        alert={activeSecurityAlert}
        onClose={() => setActiveSecurityAlert(null)}
      />

      {/* Fullscreen Game-Style Cinematic Intro Overlay */}
      <IntroCinematic />
    </div>
  );
}
