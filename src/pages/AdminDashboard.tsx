import React, { useState, useEffect } from 'react';
import {
  Product,
  DownloadRequest,
  AdminNotification,
  OwnerSettings,
  ContactMessage,
  DashboardStats,
  LaunchPricingInfo,
  ProductCategory,
  CustomTab,
  GangsterSpecs,
} from '../types';
import {
  fetchAdminDashboard,
  approveRequestApi,
  rejectRequestApi,
  updateProductApi,
  createProductApi,
  deleteProductApi,
  updateSettingsApi,
  fetchLaunchPricing,
  sendAiAssistantPrompt,
  uploadPortfolioVideoApi,
  resetVisitorCountApi,
} from '../lib/api';
import { exportPortfolioVideo } from '../lib/videoExporter';
import { AiChatMessageContent } from '../components/AiChatMessageContent';
import {
  LayoutDashboard,
  Package,
  Plus,
  Download,
  Users,
  Settings,
  Bell,
  Trash2,
  Eye,
  EyeOff,
  Building2,
  LogOut,
  RefreshCw,
  Flame,
  Pencil,
  UploadCloud,
  Film,
  Clock,
  X,
  Check,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Globe,
  FileText,
  Folder,
  FolderArchive,
  Archive,
  Upload,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  Send,
  Wand2,
  Lock,
  Key,
  Gamepad2,
} from 'lucide-react';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onDataChanged?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  onLogout,
  onDataChanged,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'ai-helper'
    | 'products'
    | 'add-product'
    | 'requests'
    | 'customers'
    | 'pricing'
    | 'portfolio'
    | 'site-customization'
    | 'settings'
    | 'notifications'
  >('overview');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<DownloadRequest[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [settings, setSettings] = useState<OwnerSettings | null>(null);
  const [launchPricing, setLaunchPricing] = useState<LaunchPricingInfo | null>(null);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Product Form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('Tools');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdVersion, setNewProdVersion] = useState('v1.0.0');
  const [newProdPricingType, setNewProdPricingType] = useState<'free' | 'fixed' | 'launch' | 'tbd'>('fixed');
  const [newProdPrice, setNewProdPrice] = useState<number>(5000);
  const [newProdIsComingSoon, setNewProdIsComingSoon] = useState(false);
  const [newProdFeatures, setNewProdFeatures] = useState('Feature 1\nFeature 2');
  const [newProdFileUrl, setNewProdFileUrl] = useState('');
  const [newProdFileSize, setNewProdFileSize] = useState('');
  const [newProdExternalUrl, setNewProdExternalUrl] = useState('');
  const [newUploadMode, setNewUploadMode] = useState<'folder' | 'file'>('folder');
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Edit Product Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdCategory, setEditProdCategory] = useState<ProductCategory>('Tools');
  const [editProdDesc, setEditProdDesc] = useState('');
  const [editProdFullDesc, setEditProdFullDesc] = useState('');
  const [editProdVersion, setEditProdVersion] = useState('');
  const [editProdReleaseDate, setEditProdReleaseDate] = useState('');
  const [editProdPricingType, setEditProdPricingType] = useState<'free' | 'fixed' | 'launch' | 'tbd'>('fixed');
  const [editProdPrice, setEditProdPrice] = useState<number>(0);
  const [editProdIsComingSoon, setEditProdIsComingSoon] = useState(false);
  const [editProdFileUrl, setEditProdFileUrl] = useState('');
  const [editProdFileSize, setEditProdFileSize] = useState('');
  const [editProdExternalUrl, setEditProdExternalUrl] = useState('');
  const [editUploadMode, setEditUploadMode] = useState<'folder' | 'file'>('folder');
  const [editProdFeatures, setEditProdFeatures] = useState('');
  const [editProdWhatsNew, setEditProdWhatsNew] = useState('');
  const [isEditingUploadingFile, setIsEditingUploadingFile] = useState(false);

  // Settings & Timer Control Form state
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankInstructions, setBankInstructions] = useState('');
  const [launchDateStr, setLaunchDateStr] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // Timer Control state
  const [timerPaused, setTimerPaused] = useState(false);
  const [freeDays, setFreeDays] = useState<number>(14);
  const [earlyDays, setEarlyDays] = useState<number>(14);
  const [earlyPrice, setEarlyPrice] = useState<number>(5000);
  const [fullPrice, setFullPrice] = useState<number>(17000);

  // Site Customization state
  const [announcementText, setAnnouncementText] = useState(
    '🔥 APEX EDITOR LAUNCH PROMOTION IS LIVE — GET FREE ACCESS NOW!'
  );
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [customTabsList, setCustomTabsList] = useState<CustomTab[]>([]);
  const [newTabLabel, setNewTabLabel] = useState('');
  const [newTabContent, setNewTabContent] = useState('');

  // Live Visitor Counter & Apex Demo & Gangster Revolution Settings
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [apexEditorDemoUrl, setApexEditorDemoUrl] = useState<string>('');
  const [gangsterRevolutionLaunchDate, setGangsterRevolutionLaunchDate] = useState<string>('TBD');
  const [gangsterRevolutionStatus, setGangsterRevolutionStatus] = useState<string>('PRE-ALPHA BUILD • IN DEVELOPMENT');
  const [gangsterSpecs, setGangsterSpecs] = useState<GangsterSpecs>({
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
  });

  // Owner Portfolio Showcase Video Controls State & Handlers
  const [portfolioVideoMode, setPortfolioVideoMode] = useState<'default' | 'custom' | 'blank'>('default');
  const [customVideoUploaded, setCustomVideoUploaded] = useState<boolean>(false);
  const [isUploadingCustomVideo, setIsUploadingCustomVideo] = useState(false);
  const [customVideoUrlInput, setCustomVideoUrlInput] = useState('');

  const handleUploadCustomVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCustomVideo(true);
      showToast('Uploading & publishing video to server...');

      const uploadRes = await uploadPortfolioVideoApi(file, token);
      const serverVideoUrl = uploadRes.videoUrl;

      // Update state & client cache
      localStorage.setItem('apex_custom_portfolio_video', serverVideoUrl);
      localStorage.setItem('apex_portfolio_video_mode', 'custom');
      setCustomVideoUploaded(true);
      setPortfolioVideoMode('custom');
      window.dispatchEvent(new Event('apex_video_updated'));

      showToast('Custom Showcase Video Uploaded & Published Live to All Visitors!');
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      console.error('Server video upload error:', err);
      // Fallback in case of server failure
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        try {
          localStorage.setItem('apex_custom_portfolio_video', result);
          localStorage.setItem('apex_portfolio_video_mode', 'custom');
          setCustomVideoUploaded(true);
          setPortfolioVideoMode('custom');
          window.dispatchEvent(new Event('apex_video_updated'));
          await updateSettingsApi({ portfolioVideoMode: 'custom', portfolioVideoUrl: result }, token);
          showToast('Custom Showcase Video Saved Locally!');
        } catch (e) {
          showToast('Upload error: ' + (err?.message || 'File too large for local fallback.'));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingCustomVideo(false);
    }
  };

  const handleSaveVideoUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVideoUrlInput.trim()) return;

    try {
      setIsUploadingCustomVideo(true);
      showToast('Publishing custom video link...');
      const url = customVideoUrlInput.trim();

      await updateSettingsApi({ portfolioVideoMode: 'custom', portfolioVideoUrl: url }, token);

      localStorage.setItem('apex_custom_portfolio_video', url);
      localStorage.setItem('apex_portfolio_video_mode', 'custom');
      setCustomVideoUploaded(true);
      setPortfolioVideoMode('custom');
      window.dispatchEvent(new Event('apex_video_updated'));

      showToast('Custom video URL published to all visitors!');
      setCustomVideoUrlInput('');
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      showToast('Failed to save video URL: ' + (err?.message || 'Error'));
    } finally {
      setIsUploadingCustomVideo(false);
    }
  };

  const handleRemoveVideoSetBlank = async () => {
    localStorage.removeItem('apex_custom_portfolio_video');
    localStorage.setItem('apex_portfolio_video_mode', 'blank');
    setCustomVideoUploaded(false);
    setPortfolioVideoMode('blank');
    window.dispatchEvent(new Event('apex_video_updated'));

    try {
      await updateSettingsApi({ portfolioVideoMode: 'blank', portfolioVideoUrl: '' }, token);
      showToast('Video removed — Site now displays "Portfolio Coming Soon" to all visitors!');
    } catch (err) {
      showToast('Portfolio set to Coming Soon mode!');
    }
    fetchDashboardData();
    if (onDataChanged) onDataChanged();
  };

  const handleResetCustomVideo = async () => {
    localStorage.removeItem('apex_custom_portfolio_video');
    localStorage.setItem('apex_portfolio_video_mode', 'default');
    setCustomVideoUploaded(false);
    setPortfolioVideoMode('default');
    window.dispatchEvent(new Event('apex_video_updated'));

    try {
      await updateSettingsApi({ portfolioVideoMode: 'default', portfolioVideoUrl: '' }, token);
      showToast('Reset to Default Animated Reel Successfully for all visitors!');
    } catch (err) {
      showToast('Reset to Default Animated Reel Successfully!');
    }
    fetchDashboardData();
    if (onDataChanged) onDataChanged();
  };

  // Video Export Progress state
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');

  const handleDownloadPortfolioVideo = async () => {
    const customVid = localStorage.getItem('apex_custom_portfolio_video');
    if (customVid) {
      try {
        showToast('Preparing custom video showcase download...');
        const response = await fetch(customVid);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Apex_Syndicate_Portfolio_Showcase.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Custom video showcase downloaded successfully (.mp4)!');
      } catch (err) {
        const a = document.createElement('a');
        a.href = customVid;
        a.download = 'Apex_Syndicate_Portfolio_Showcase.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Custom video showcase downloaded (.mp4)!');
      }
      return;
    }

    try {
      setIsExportingVideo(true);
      setExportProgress(0);
      setExportStatusText('Initializing high-definition video encoder for CapCut...');

      const mp4Blob = await exportPortfolioVideo((progress, status) => {
        setExportProgress(progress);
        setExportStatusText(status);
      });

      const url = URL.createObjectURL(mp4Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Apex_Syndicate_18s_Kinetic_Reel.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('100% Valid MP4 Downloaded! Ready to import and edit in CapCut.');
    } catch (err: any) {
      console.error('Video export error:', err);
      showToast('Error exporting video: ' + (err?.message || 'Please try again.'));
    } finally {
      setIsExportingVideo(false);
    }
  };

  // Request Filter state
  const [reqFilter, setReqFilter] = useState<string>('ALL');

  // Apex AI Helper Security Lock state
  const [isAiUnlocked, setIsAiUnlocked] = useState(false);
  const [aiPasswordInput, setAiPasswordInput] = useState('');
  const [aiPasswordError, setAiPasswordError] = useState(false);

  // Automatically lock AI Helper when switching tabs away from 'ai-helper' or leaving Owner Dashboard
  useEffect(() => {
    if (activeTab !== 'ai-helper') {
      setIsAiUnlocked(false);
    }
  }, [activeTab]);

  useEffect(() => {
    return () => {
      setIsAiUnlocked(false);
    };
  }, []);

  const handleUnlockAiHelper = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (aiPasswordInput.trim() === 'apexsyndicate.com.ng') {
      setIsAiUnlocked(true);
      setAiPasswordError(false);
      setAiPasswordInput('');
      showToast('Apex AI Helper Security Access Granted!');
    } else {
      setAiPasswordError(true);
      showToast('Incorrect AI Helper password!');
    }
  };

  // Apex AI Helper & Voice Mode state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiSpeechOutput, setAiSpeechOutput] = useState(false);
  const [aiHistory, setAiHistory] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; logs?: string[]; timestamp: string }>
  >([
    {
      sender: 'ai',
      text: 'Yooo boss! I am Apex AI Omniscient Intelligence — your supreme coding partner, software architect, and platform autonomous controller (powered by Gemini & ChatGPT combined intellect).\n\nYou can chat with me naturally, ask me for full-stack code or debugging, or command me to control any website setting (timer, demo link, bank info, products, announcements, requests). I will type everything directly back to you with no unwanted voice chatter!',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const handleStartListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setAiPrompt(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('Voice input error. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      showToast('Could not access microphone.');
    }
  };

  const handleSendAiPrompt = async (customPrompt?: string) => {
    const promptToSubmit = customPrompt || aiPrompt;
    if (!promptToSubmit.trim() || aiProcessing) return;

    const userMessage = promptToSubmit.trim();
    setAiPrompt('');
    setAiProcessing(true);

    setAiHistory((prev) => [
      ...prev,
      { sender: 'user', text: userMessage, timestamp: new Date().toLocaleTimeString() },
    ]);

    try {
      const result = await sendAiAssistantPrompt(userMessage, token);

      setAiHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: result.reply,
          logs: result.executedLogs,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      // Response is text-only (typed back directly with no voice audio synthesis)

      if (result.updatedData) {
        setStats(result.updatedData.stats);
        setSettings(result.updatedData.settings);
        setProducts(result.updatedData.products);
        setRequests(result.updatedData.requests);
        if (result.updatedData.settings) {
          setBankName(result.updatedData.settings.bankName);
          setAccountName(result.updatedData.settings.accountName);
          setAccountNumber(result.updatedData.settings.accountNumber);
          setBankInstructions(result.updatedData.settings.bankInstructions);
          setTimerPaused(Boolean(result.updatedData.settings.timerPaused));
          setFreeDays(result.updatedData.settings.freeDays ?? 14);
          setEarlyDays(result.updatedData.settings.earlyDays ?? 14);
          setEarlyPrice(result.updatedData.settings.earlyPrice ?? 5000);
          setFullPrice(result.updatedData.settings.fullPrice ?? 17000);
          setAnnouncementText(result.updatedData.settings.announcementText || '');
          setShowAnnouncement(Boolean(result.updatedData.settings.showAnnouncement));
        }
      }

      showToast('Apex AI Helper updated website!');
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      setAiHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sorry boss, I encountered an issue processing that command. Please try again.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setAiProcessing(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminDashboard(token);
      setStats(data.stats);
      setProducts(data.products);
      setRequests(data.requests);
      setNotifications(data.notifications);
      setContacts(data.contacts);

      const pricing = await fetchLaunchPricing('apex-editor');
      setLaunchPricing(pricing);

      if (data.settings) {
        setSettings(data.settings);
        setVisitorCount(data.stats?.totalVisitors ?? data.settings?.visitorCount ?? 0);
        setApexEditorDemoUrl(data.settings.apexEditorDemoUrl || '');
        setGangsterRevolutionLaunchDate(data.settings.gangsterRevolutionLaunchDate || 'TBD');
        setGangsterRevolutionStatus(data.settings.gangsterRevolutionStatus || 'PRE-ALPHA BUILD • IN DEVELOPMENT');
        if (data.settings.gangsterSpecs) {
          setGangsterSpecs({
            minOs: data.settings.gangsterSpecs.minOs || 'TBD',
            minProcessor: data.settings.gangsterSpecs.minProcessor || 'TBD',
            minMemory: data.settings.gangsterSpecs.minMemory || 'TBD',
            minGraphics: data.settings.gangsterSpecs.minGraphics || 'TBD',
            minDirectX: data.settings.gangsterSpecs.minDirectX || 'TBD',
            minStorage: data.settings.gangsterSpecs.minStorage || 'TBD',
            recOs: data.settings.gangsterSpecs.recOs || 'TBD',
            recProcessor: data.settings.gangsterSpecs.recProcessor || 'TBD',
            recMemory: data.settings.gangsterSpecs.recMemory || 'TBD',
            recGraphics: data.settings.gangsterSpecs.recGraphics || 'TBD',
            recDirectX: data.settings.gangsterSpecs.recDirectX || 'TBD',
            recStorage: data.settings.gangsterSpecs.recStorage || 'TBD',
          });
        }
        setBankName(data.settings.bankName);
        setAccountName(data.settings.accountName);
        setAccountNumber(data.settings.accountNumber);
        setBankInstructions(data.settings.bankInstructions);
        setAdminPass(data.settings.adminPassword);
        setTimerPaused(Boolean(data.settings.timerPaused));
        setFreeDays(data.settings.freeDays ?? 14);
        setEarlyDays(data.settings.earlyDays ?? 14);
        setEarlyPrice(data.settings.earlyPrice ?? 5000);
        setFullPrice(data.settings.fullPrice ?? 17000);
        setAnnouncementText(
          data.settings.announcementText ||
            '🔥 APEX EDITOR LAUNCH PROMOTION IS LIVE — GET FREE ACCESS NOW!'
        );
        setShowAnnouncement(Boolean(data.settings.showAnnouncement ?? true));
        setCustomTabsList(data.settings.customTabs || []);
        if (data.settings.portfolioVideoMode) {
          setPortfolioVideoMode(data.settings.portfolioVideoMode);
          if (data.settings.portfolioVideoMode === 'custom' && data.settings.portfolioVideoUrl) {
            setCustomVideoUploaded(true);
            localStorage.setItem('apex_custom_portfolio_video', data.settings.portfolioVideoUrl);
            localStorage.setItem('apex_portfolio_video_mode', 'custom');
          } else if (data.settings.portfolioVideoMode === 'blank') {
            setCustomVideoUploaded(false);
            localStorage.setItem('apex_portfolio_video_mode', 'blank');
          } else {
            setCustomVideoUploaded(false);
            localStorage.setItem('apex_portfolio_video_mode', 'default');
          }
        }
        if (data.settings.launchDateApexEditor) {
          setLaunchDateStr(new Date(data.settings.launchDateApexEditor).toISOString().split('T')[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // Handle Approve Download Request
  const handleApproveRequest = async (id: string) => {
    try {
      await approveRequestApi(id, token);
      showToast('Download request APPROVED! Customer download unlocked.');
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Error approving request.');
    }
  };

  // Handle Reject Download Request
  const handleRejectRequest = async (id: string) => {
    const reason = prompt('Enter rejection reason (optional):', 'Payment could not be verified.');
    if (reason === null) return;

    try {
      await rejectRequestApi(id, reason, token);
      showToast('Download request REJECTED.');
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Error rejecting request.');
    }
  };

  // Handle Toggle Product Coming Soon Status
  const handleToggleComingSoon = async (prod: Product) => {
    try {
      const newStatus = !prod.isComingSoon;
      await updateProductApi(
        prod.id,
        {
          isComingSoon: newStatus,
          releaseDate: newStatus ? 'Coming Soon' : 'Official Release',
        },
        token
      );
      showToast(
        `Product ${prod.name}: ${newStatus ? 'Set to COMING SOON' : 'COMING SOON TAG REMOVED'}`
      );
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Failed to update Coming Soon status.');
    }
  };

  // Handle Toggle Product Publish Status
  const handleTogglePublish = async (prod: Product) => {
    try {
      await updateProductApi(prod.id, { isPublished: !prod.isPublished }, token);
      showToast(`Product ${!prod.isPublished ? 'PUBLISHED' : 'UNPUBLISHED'}`);
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Failed to update product status.');
    }
  };

  // Populate Edit Modal
  const handleStartEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditProdName(prod.name);
    setEditProdCategory(prod.category);
    setEditProdDesc(prod.description);
    setEditProdFullDesc(prod.fullDescription || '');
    setEditProdVersion(prod.version);
    setEditProdReleaseDate(prod.releaseDate);
    setEditProdPricingType(prod.pricingType || 'fixed');
    setEditProdPrice(prod.fixedPrice || 0);
    setEditProdIsComingSoon(prod.isComingSoon || false);
    setEditProdFileUrl(prod.fileUrl || '');
    setEditProdFileSize(prod.fileSize || '');
    setEditProdExternalUrl(prod.externalUrl || '');
    setEditProdFeatures((prod.features || []).join('\n'));
    setEditProdWhatsNew((prod.whatsNew || []).join('\n'));
  };

  // Upload file for edit product
  const handleEditFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsEditingUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.fileUrl) {
        setEditProdFileUrl(data.fileUrl);
        setEditProdFileSize(data.size || '150 MB');
        setEditProdIsComingSoon(false);
        showToast(`File attached: ${data.filename} (${data.size}) — Product marked READY for download!`);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      showToast(err.message || 'File upload error');
    } finally {
      setIsEditingUploadingFile(false);
    }
  };

  // Submit Edit Product Updates
  const handleUpdateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editProdName || !editProdDesc) return;

    const featsArr = editProdFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const whatsNewArr = editProdWhatsNew
      .split('\n')
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    const payload = {
      name: editProdName,
      category: editProdCategory,
      description: editProdDesc,
      fullDescription: editProdFullDesc,
      version: editProdVersion,
      releaseDate: editProdIsComingSoon ? 'Coming Soon' : editProdReleaseDate || 'Official Release',
      pricingType: editProdPricingType,
      fixedPrice: editProdPricingType === 'fixed' ? editProdPrice : 0,
      isComingSoon: editProdIsComingSoon,
      fileUrl: editProdFileUrl,
      fileSize: editProdFileSize || (editProdFileUrl ? '150 MB' : 'Pending Build'),
      externalUrl: editProdExternalUrl.trim() || undefined,
      features: featsArr,
      whatsNew: whatsNewArr,
    };

    try {
      await updateProductApi(editingProduct.id, payload, token);
      showToast(`Product "${editProdName}" updated successfully!`);
      setEditingProduct(null);
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      showToast(err.message || 'Error updating product');
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProductApi(id, token);
      showToast('Product deleted.');
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Failed to delete product.');
    }
  };

  // Handle Create Product Submit
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdDesc) return;

    const featsArr = newProdFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      name: newProdName,
      category: newProdCategory,
      description: newProdDesc,
      version: newProdVersion,
      releaseDate: newProdIsComingSoon ? 'Coming Soon' : 'Official Release',
      pricingType: newProdPricingType,
      fixedPrice: newProdPricingType === 'fixed' ? Number(newProdPrice) : 0,
      isComingSoon: newProdIsComingSoon,
      fileUrl: newProdFileUrl,
      fileSize: newProdFileUrl ? '150 MB' : 'Pending Build',
      externalUrl: newProdExternalUrl.trim() || undefined,
      features: featsArr,
      fullDescription: newProdDesc,
      isFeatured: false,
      isPublished: true,
      screenshots: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      ],
    };

    try {
      await createProductApi(payload, token);
      showToast('New product created & published!');
      setNewProdName('');
      setNewProdDesc('');
      setNewProdFileUrl('');
      setNewProdExternalUrl('');
      setActiveTab('products');
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Error creating product.');
    }
  };

  // Handle Software Folder Upload (Compresses folder into .zip package on server)
  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;

    const targetProd = isEdit ? editingProduct : null;
    const prodName = isEdit ? editProdName : newProdName;
    const prodSlug = targetProd?.slug || (prodName ? prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'apex-software');

    if (isEdit) setIsEditingUploadingFile(true);
    else setIsUploadingFile(true);

    const formData = new FormData();
    formData.append('productName', prodName || 'Apex Software');
    formData.append('productSlug', prodSlug);

    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      const relativePath = (file as any).webkitRelativePath || file.name;
      formData.append('files', file, relativePath);
    }

    try {
      showToast(`Uploading & compressing folder (${filesList.length} files)...`);
      const res = await fetch('/api/upload-folder', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.fileUrl) {
        if (isEdit) {
          setEditProdFileUrl(data.fileUrl);
          setEditProdFileSize(data.size || 'ZIP Package');
        } else {
          setNewProdFileUrl(data.fileUrl);
          setNewProdFileSize(data.size || 'ZIP Package');
        }
        showToast(`Success! Folder compressed into ZIP package (${data.size}, ${data.fileCount} files)`);
      } else {
        throw new Error(data.error || 'Folder upload failed');
      }
    } catch (err: any) {
      showToast(err.message || 'Folder upload error');
    } finally {
      if (isEdit) setIsEditingUploadingFile(false);
      else setIsUploadingFile(false);
    }
  };

  // Handle Single Installer / Archive File Upload (.zip, .exe, .dmg, .rar, etc.)
  const handleSingleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isEdit) setIsEditingUploadingFile(true);
    else setIsUploadingFile(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      showToast(`Uploading package ${file.name}...`);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.fileUrl) {
        if (isEdit) {
          setEditProdFileUrl(data.fileUrl);
          setEditProdFileSize(data.size);
        } else {
          setNewProdFileUrl(data.fileUrl);
          setNewProdFileSize(data.size);
        }
        showToast(`Package attached: ${data.filename} (${data.size})`);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        if (isEdit) {
          setEditProdFileUrl(dataUrl);
          setEditProdFileSize(formattedSize);
        } else {
          setNewProdFileUrl(dataUrl);
          setNewProdFileSize(formattedSize);
        }
        showToast(`Package attached locally: ${file.name} (${formattedSize})`);
      };
      reader.readAsDataURL(file);
    } finally {
      if (isEdit) setIsEditingUploadingFile(false);
      else setIsUploadingFile(false);
    }
  };

  // Handle Save Settings & Launch Configuration Submit
  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<OwnerSettings> = {
      bankName,
      accountName,
      accountNumber,
      bankInstructions,
      adminPassword: adminPass,
      timerPaused,
      freeDays: Number(freeDays) || 14,
      earlyDays: Number(earlyDays) || 14,
      earlyPrice: Number(earlyPrice) || 5000,
      fullPrice: Number(fullPrice) || 17000,
      announcementText,
      showAnnouncement,
      customTabs: customTabsList,
      apexEditorDemoUrl,
      gangsterRevolutionLaunchDate,
      gangsterRevolutionStatus,
      gangsterSpecs,
    };

    if (launchDateStr) {
      payload.launchDateApexEditor = new Date(launchDateStr).toISOString();
    }

    try {
      await updateSettingsApi(payload, token);
      showToast('Owner settings, demo URL & specs updated successfully across all devices!');
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Error saving settings.');
    }
  };

  // Handle Reset Visitor Counter
  const handleResetVisitorCount = async () => {
    try {
      const res = await resetVisitorCountApi(token);
      setVisitorCount(0);
      if (stats) setStats({ ...stats, totalVisitors: 0 });
      showToast('Visitor traffic counter reset to 0!');
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Error resetting visitor count.');
    }
  };

  // Handle Reset Gangster Specs to TBD
  const handleResetGangsterSpecsToTbd = () => {
    const tbdSpecs: GangsterSpecs = {
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
    };
    setGangsterSpecs(tbdSpecs);
    setGangsterRevolutionLaunchDate('TBD');
    setGangsterRevolutionStatus('PRE-ALPHA BUILD • IN DEVELOPMENT');
    showToast('Gangster Revolution specifications & launch date set to TBD (click Save Settings to publish).');
  };

  // Handle Reset Timer to Today (Restart 14-Day Free Period)
  const handleResetTimerToToday = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayIso = new Date().toISOString();
    setLaunchDateStr(todayStr);
    setFreeDays(14);
    setEarlyDays(14);
    setTimerPaused(true);

    try {
      await updateSettingsApi(
        {
          launchDateApexEditor: todayIso,
          freeDays: 14,
          earlyDays: 14,
          timerPaused: true,
          timerPausedSecondsRemaining: 14 * 24 * 60 * 60,
        },
        token
      );
      showToast('🚀 Launch timer set to 14 days and paused! Unpause whenever you are ready.');
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Error resetting launch timer.');
    }
  };

  // Handle Pause / Resume Timer
  const handleToggleTimerPause = async () => {
    const newPaused = !timerPaused;
    setTimerPaused(newPaused);
    try {
      await updateSettingsApi({ timerPaused: newPaused }, token);
      showToast(`Launch timer ${newPaused ? 'PAUSED (FROZEN)' : 'RESUMED (ACTIVE)'}`);
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Error toggling launch timer pause state.');
    }
  };

  // Custom Tabs Management Handlers
  const handleAddCustomTab = async () => {
    if (!newTabLabel.trim() || !newTabContent.trim()) {
      showToast('Please enter both tab name and tab content.');
      return;
    }

    const newTab: CustomTab = {
      id: 'tab-' + Date.now(),
      label: newTabLabel.trim(),
      content: newTabContent.trim(),
      isActive: true,
    };

    const updatedTabs = [...customTabsList, newTab];
    setCustomTabsList(updatedTabs);
    setNewTabLabel('');
    setNewTabContent('');

    try {
      await updateSettingsApi({ customTabs: updatedTabs }, token);
      showToast(`Custom site tab "${newTab.label}" created & added to navbar!`);
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Error saving custom tab.');
    }
  };

  const handleToggleCustomTabActive = async (tabId: string) => {
    const updatedTabs = customTabsList.map((t) =>
      t.id === tabId ? { ...t, isActive: !t.isActive } : t
    );
    setCustomTabsList(updatedTabs);
    try {
      await updateSettingsApi({ customTabs: updatedTabs }, token);
      showToast('Custom tab visibility toggled.');
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Error updating custom tab.');
    }
  };

  const handleDeleteCustomTab = async (tabId: string) => {
    if (!confirm('Are you sure you want to delete this custom tab from the site?')) return;
    const updatedTabs = customTabsList.filter((t) => t.id !== tabId);
    setCustomTabsList(updatedTabs);
    try {
      await updateSettingsApi({ customTabs: updatedTabs }, token);
      showToast('Custom tab deleted.');
      fetchDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Error deleting custom tab.');
    }
  };

  const handleMarkNotificationsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('All notifications marked as read.');
        fetchDashboardData();
      }
    } catch (err) {
      showToast('Failed to update notifications.');
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (reqFilter === 'ALL') return true;
    return r.status === reqFilter;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">
      {/* Toast Notification Popup */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#FF6321] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(255,99,33,0.6)] animate-bounce border border-white/20">
          {toastMsg}
        </div>
      )}

      {/* Top Owner Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-black/40 border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-wider text-white">
                APEX SYNDICATE <span className="text-[#FF6321]">OWNER PORTAL</span>
              </h1>
              <div className="text-[10px] text-gray-400 font-mono">
                Official Domain: apexsyndicate.com.ng • Admin Session Active
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Navigation Tabs */}
      <div className="bg-black/40 border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
          {[
            { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
            { id: 'ai-helper', label: 'APEX AI HELPER', icon: Sparkles, badge: 'AI' },
            { id: 'products', label: 'PRODUCTS', icon: Package },
            { id: 'add-product', label: 'UPLOAD PRODUCT', icon: Plus },
            {
              id: 'requests',
              label: 'DOWNLOAD REQUESTS',
              icon: Download,
              badge: stats?.pendingApprovals || 0,
            },
            { id: 'customers', label: 'CUSTOMERS', icon: Users },
            { id: 'pricing', label: 'PRICING & LAUNCH', icon: Flame },
            { id: 'portfolio', label: 'DEV UPDATES VIDEO', icon: Film },
            { id: 'site-customization', label: 'SITE TABS & BANNER', icon: Globe },
            { id: 'settings', label: 'PAYMENT SETTINGS', icon: Settings },
            {
              id: 'notifications',
              label: 'NOTIFICATIONS',
              icon: Bell,
              badge: stats?.unreadNotifications || 0,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#FF6321] text-black shadow-[0_0_15px_rgba(255,99,33,0.35)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#FF6321] text-black text-[10px] font-black">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dashboard Body Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {loading ? (
          <div className="py-20 text-center text-[#FF6321] font-mono text-xs animate-pulse">
            Loading Owner Dashboard Data...
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {/* Visitor Analytics Card */}
                  <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-amber-500/40 space-y-2 shadow-[0_0_25px_rgba(245,158,11,0.15)] flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-amber-400 uppercase font-mono font-bold flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-amber-400" /> LIVE VISITORS
                        </span>
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      </div>
                      <div className="text-3xl font-black text-white font-mono">
                        {(stats?.totalVisitors ?? visitorCount ?? 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">Total tracked site visits</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetVisitorCount}
                      className="mt-2 w-full py-1.5 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase flex items-center justify-center gap-1.5 transition-all"
                    >
                      <RotateCcw className="w-3 h-3" /> RESET TO 0
                    </button>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-2">
                    <div className="text-xs text-gray-500 uppercase font-mono font-bold">TOTAL REQUESTS</div>
                    <div className="text-3xl font-black text-white">{stats?.totalRequests || 0}</div>
                    <div className="text-[10px] text-gray-400 font-mono">Download submissions</div>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-[#FF6321]/40 space-y-2 shadow-[0_0_20px_rgba(255,99,33,0.15)]">
                    <div className="text-xs text-[#FF6321] uppercase font-mono font-bold">PENDING APPROVALS</div>
                    <div className="text-3xl font-black text-[#FF6321]">{stats?.pendingApprovals || 0}</div>
                    <div className="text-[10px] text-gray-400 font-mono">Awaiting owner verification</div>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-2">
                    <div className="text-xs text-gray-500 uppercase font-mono font-bold">APPROVED DOWNLOADS</div>
                    <div className="text-3xl font-black text-emerald-400">{stats?.approvedCount || 0}</div>
                    <div className="text-[10px] text-gray-400 font-mono">Tokens generated</div>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-2">
                    <div className="text-xs text-gray-500 uppercase font-mono font-bold">TOTAL REVENUE (NGN)</div>
                    <div className="text-3xl font-black text-white">₦{(stats?.totalRevenueNgn || 0).toLocaleString()}</div>
                    <div className="text-[10px] text-gray-400 font-mono">Verified transfers</div>
                  </div>
                </div>

                {/* Apex Editor Launch Pricing Widget */}
                {launchPricing && (
                  <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-2xl border border-[#FF6321]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                    <div className="space-y-1">
                      <div className="text-xs font-mono font-bold text-[#FF6321] uppercase">
                        APEX EDITOR LAUNCH STATUS • DAY {launchPricing.currentDayNumber}
                      </div>
                      <h3 className="text-2xl font-black text-white">{launchPricing.phaseName}</h3>
                      <p className="text-xs text-gray-400">
                        Current price set automatically by system: <strong className="text-[#FF6321]">{launchPricing.priceDisplay}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('pricing')}
                      className="px-6 py-3 rounded-xl bg-[#FF6321] text-black font-extrabold text-xs uppercase transition-all"
                    >
                      CONFIGURE LAUNCH DATE
                    </button>
                  </div>
                )}

                {/* Recent Requests Action Table */}
                <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                      RECENT DOWNLOAD REQUESTS
                    </h2>
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="text-xs font-bold text-[#FF6321] hover:text-[#FF8A50] uppercase"
                    >
                      VIEW ALL ({requests.length})
                    </button>
                  </div>

                  {requests.length === 0 ? (
                    <p className="text-xs text-gray-500 py-6 text-center">No download requests submitted yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-gray-300">
                        <thead className="bg-black/60 text-gray-500 uppercase font-mono text-[10px]">
                          <tr>
                            <th className="p-3">Request ID</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Product</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Payment Ref</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Owner Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {requests.slice(0, 5).map((req) => (
                            <tr key={req.id} className="hover:bg-white/5">
                              <td className="p-3 font-mono font-bold text-[#FF6321]">{req.requestId}</td>
                              <td className="p-3">
                                <div className="font-bold text-white">{req.customerName}</div>
                                <div className="text-[10px] text-gray-500">{req.customerEmail}</div>
                              </td>
                              <td className="p-3">{req.productName} ({req.productVersion})</td>
                              <td className="p-3 font-bold text-white">
                                {(req.amount || 0) === 0 ? 'FREE' : `₦${(req.amount || 0).toLocaleString()}`}
                              </td>
                              <td className="p-3 font-mono text-gray-400">{req.paymentProofRef || 'N/A'}</td>
                              <td className="p-3">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                    req.status === 'APPROVED'
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                      : req.status === 'REJECTED'
                                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                      : 'bg-[#FF6321]/20 text-[#FF6321] border border-[#FF6321]/40'
                                  }`}
                                >
                                  {req.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                {req.status !== 'APPROVED' && (
                                  <button
                                    onClick={() => handleApproveRequest(req.id)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase mr-2 shadow-sm"
                                  >
                                    APPROVE
                                  </button>
                                )}
                                {req.status !== 'REJECTED' && (
                                  <button
                                    onClick={() => handleRejectRequest(req.id)}
                                    className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-bold text-[10px] uppercase"
                                  >
                                    REJECT
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: APEX AI HELPER */}
            {activeTab === 'ai-helper' && !isAiUnlocked && (
              <div className="max-w-md mx-auto my-12 p-8 rounded-[28px] bg-black/90 border border-[#FF6321]/40 shadow-[0_0_50px_rgba(255,99,33,0.2)] text-center space-y-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-2xl bg-[#FF6321]/20 border border-[#FF6321]/40 text-[#FF6321] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,99,33,0.3)]">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider">
                    APEX AI HELPER LOCK
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Apex AI Helper has master control over the website. Enter the AI password to unlock access.
                  </p>
                </div>

                <form onSubmit={handleUnlockAiHelper} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      value={aiPasswordInput}
                      onChange={(e) => {
                        setAiPasswordInput(e.target.value);
                        setAiPasswordError(false);
                      }}
                      placeholder="Enter AI Helper password..."
                      className={`w-full bg-black/80 border ${
                        aiPasswordError ? 'border-rose-500' : 'border-white/15 focus:border-[#FF6321]'
                      } rounded-2xl px-5 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors text-center font-mono`}
                      autoFocus
                    />
                    {aiPasswordError && (
                      <p className="text-[11px] text-rose-400 font-bold mt-2">
                        Incorrect password! (apexsyndicate.com.ng)
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,99,33,0.35)] transition-all"
                  >
                    <Key className="w-4 h-4" />
                    <span>UNLOCK APEX AI HELPER</span>
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'ai-helper' && isAiUnlocked && (
              <div className="space-y-6 animate-fadeIn">
                {/* Header Banner */}
                <div className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-r from-[#FF6321]/20 via-black to-purple-950/30 border border-[#FF6321]/40 shadow-[0_0_40px_rgba(255,99,33,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#FF6321] text-black font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AUTONOMOUS SITE AI
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> UNLOCKED & READY
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
                      APEX AI OMNISCIENT INTELLIGENCE
                    </h2>
                    <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
                      Powered by the combined intelligence of <strong>Gemini & ChatGPT</strong>. Converse casually, ask for <strong>production code</strong> across any language, or command <strong>autonomous live site actions</strong> (timer, demo link, banking, specs, products, visitor counters). Responds via fast typed text directly in chat.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-xs font-bold uppercase flex items-center gap-2">
                      <VolumeX className="w-4 h-4 text-emerald-400" />
                      <span>TEXT RESPONSE MODE</span>
                    </div>

                    <button
                      onClick={() => {
                        setIsAiUnlocked(false);
                        showToast('Apex AI Helper Re-locked!');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase transition-all flex items-center gap-2"
                      title="Lock AI Helper"
                    >
                      <Lock className="w-4 h-4" />
                      <span>LOCK AI</span>
                    </button>
                  </div>
                </div>

                {/* Quick Action Preset Prompts */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-[#FF6321]" /> QUICK COMMAND PRESETS
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSendAiPrompt('Reset the launch timer to 14 days free')}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#FF6321]/20 border border-white/10 hover:border-[#FF6321]/40 text-xs font-medium text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#FF6321]" /> Reset Launch Timer to 14 Days
                    </button>
                    <button
                      onClick={() => handleSendAiPrompt('Enable announcement banner saying APEX EDITOR LAUNCH PROMOTION IS LIVE')}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#FF6321]/20 border border-white/10 hover:border-[#FF6321]/40 text-xs font-medium text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#FF6321]" /> Enable Launch Announcement
                    </button>
                    <button
                      onClick={() => handleSendAiPrompt('Change bank to OPay account 8082961817 APEX SYNDICATE SOFTWARE LTD')}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#FF6321]/20 border border-white/10 hover:border-[#FF6321]/40 text-xs font-medium text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#FF6321]" /> Set OPay Bank Details
                    </button>
                    <button
                      onClick={() => handleSendAiPrompt('Add a new software product called Apex Analytics v1.0.0 for 10000 NGN')}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#FF6321]/20 border border-white/10 hover:border-[#FF6321]/40 text-xs font-medium text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#FF6321]" /> Add New Apex Software Suite
                    </button>
                    <button
                      onClick={() => handleSendAiPrompt('Clear all download requests')}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#FF6321]/20 border border-white/10 hover:border-[#FF6321]/40 text-xs font-medium text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Clear Request Logs
                    </button>
                  </div>
                </div>

                {/* AI Chat History Container */}
                <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-4 min-h-[420px] flex flex-col justify-between shadow-2xl">
                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin">
                    {aiHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 ${
                          item.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {item.sender === 'ai' && (
                          <div className="w-9 h-9 rounded-2xl bg-[#FF6321]/20 border border-[#FF6321]/40 text-[#FF6321] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,99,33,0.3)]">
                            <Bot className="w-5 h-5" />
                          </div>
                        )}

                        <div
                          className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                            item.sender === 'user'
                              ? 'bg-[#FF6321] text-black font-semibold rounded-tr-none shadow-[0_0_15px_rgba(255,99,33,0.3)]'
                              : 'bg-black/80 border border-white/10 text-gray-200 rounded-tl-none'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] opacity-70 border-b border-current/10 pb-1 mb-1">
                            <span className="font-bold uppercase font-mono">
                              {item.sender === 'user' ? 'YOU (OWNER)' : 'APEX AI HELPER'}
                            </span>
                            <span>{item.timestamp}</span>
                          </div>

                          {item.sender === 'user' ? (
                            <p className="whitespace-pre-wrap">{item.text}</p>
                          ) : (
                            <AiChatMessageContent content={item.text} />
                          )}

                          {item.logs && item.logs.length > 0 && (
                            <div className="pt-2 border-t border-white/10 space-y-1">
                              <div className="text-[10px] font-mono text-[#FF6321] font-bold">
                                EXECUTED SITE ACTIONS:
                              </div>
                              {item.logs.map((log, lIdx) => (
                                <div
                                  key={lIdx}
                                  className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5"
                                >
                                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <span>{log}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {item.sender === 'user' && (
                          <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}

                    {aiProcessing && (
                      <div className="flex items-center gap-3 text-xs text-[#FF6321] font-mono animate-pulse p-3 rounded-xl bg-black/40 border border-[#FF6321]/30">
                        <Sparkles className="w-4 h-4 animate-spin text-[#FF6321]" />
                        Apex AI Helper processing command and executing website changes...
                      </div>
                    )}
                  </div>

                  {/* Quick Action Suggestion Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[
                      { label: '👋 Yoo howfar', prompt: 'Yoo howfar' },
                      { label: '⏸️ Pause Timer', prompt: 'Pause the launch timer' },
                      { label: '▶️ Resume Timer', prompt: 'Resume the launch timer' },
                      { label: '⚡ Reset to 14 Days', prompt: 'Reset timer back to 14 days free' },
                      { label: '🎬 Remove Video', prompt: 'Remove the portfolio video and set to coming soon' },
                      { label: '✨ Reset Video', prompt: 'Reset portfolio video to default kinetic reel' },
                      { label: '💻 Write React Code', prompt: 'Write a modern React hook and component for audio synthesis' },
                      { label: '🏦 Update Bank', prompt: 'Update bank details to OPay account 8101234567' },
                    ].map((pill, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleSendAiPrompt(pill.prompt)}
                        disabled={aiProcessing}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/[0.04] hover:bg-[#FF6321]/20 hover:border-[#FF6321]/40 border border-white/10 text-gray-300 hover:text-white transition-all disabled:opacity-50"
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>

                  {/* Voice Input & Prompt Form Bar */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendAiPrompt();
                    }}
                    className="pt-4 border-t border-white/10 flex items-center gap-3"
                  >
                    {/* Voice Mic Button */}
                    <button
                      type="button"
                      onClick={handleStartListening}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center shrink-0 ${
                        isListening
                          ? 'bg-rose-600 text-white border-rose-400 animate-pulse shadow-[0_0_20px_rgba(225,29,72,0.6)]'
                          : 'bg-white/5 hover:bg-[#FF6321]/20 border-white/10 text-gray-300 hover:text-white'
                      }`}
                      title={isListening ? 'Listening...' : 'Click to Speak (Voice Mode)'}
                    >
                      {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-[#FF6321]" />}
                    </button>

                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder={
                        isListening
                          ? 'Listening to your voice... Speak now!'
                          : 'Type prompt or use voice mode e.g., "Reset timer back to 14 days", "Change bank to Access Bank"...'
                      }
                      className="flex-1 bg-black/80 border border-white/15 focus:border-[#FF6321] rounded-2xl px-5 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                      disabled={aiProcessing}
                    />

                    <button
                      type="submit"
                      disabled={!aiPrompt.trim() || aiProcessing}
                      className="px-6 py-3.5 rounded-2xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(255,99,33,0.35)] disabled:opacity-50 transition-all shrink-0"
                    >
                      <span>EXECUTE</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                      PRODUCT CATALOGUE MANAGEMENT
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Create, edit, upload installers, or publish/unpublish products across the main website.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('add-product')}
                    className="px-5 py-2.5 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,99,33,0.35)]"
                  >
                    <Plus className="w-4 h-4" /> ADD NEW PRODUCT
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((prod) => {
                    const isTBD = prod.pricingType === 'tbd' || (prod.pricingType === 'fixed' && !prod.fixedPrice);
                    const priceLabel = isTBD
                      ? 'TBD'
                      : prod.pricingType === 'free'
                      ? 'FREE'
                      : prod.pricingType === 'launch'
                      ? 'LAUNCH PROMO'
                      : `₦${(prod.fixedPrice || 0).toLocaleString()}`;

                    return (
                      <div
                        key={prod.id}
                        className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-4 flex flex-col justify-between hover:border-[#FF6321]/40 transition-all shadow-xl"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-[10px] font-bold uppercase">
                              {prod.category}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {prod.isComingSoon && (
                                <span className="px-2 py-0.5 rounded bg-[#FF6321] text-black text-[9px] font-black uppercase">
                                  COMING SOON
                                </span>
                              )}
                              <span
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                  prod.isPublished
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-black/40 text-gray-400'
                                }`}
                              >
                                {prod.isPublished ? 'PUBLISHED' : 'DRAFT'}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-white">{prod.name}</h3>
                          <p className="text-xs text-gray-400 line-clamp-2">{prod.description}</p>

                          <div className="pt-2 border-t border-white/5 space-y-1 text-[11px] font-mono">
                            <div className="flex items-center justify-between text-gray-400">
                              <span>PRICE:</span>
                              <strong className="text-white">{priceLabel}</strong>
                            </div>
                            <div className="flex items-center justify-between text-gray-400">
                              <span>VERSION:</span>
                              <strong className="text-white">{prod.version}</strong>
                            </div>
                            <div className="flex items-center justify-between text-gray-400">
                              <span>RELEASE:</span>
                              <strong className="text-gray-300">{prod.releaseDate}</strong>
                            </div>
                            {prod.fileUrl && (
                              <div className="flex items-center justify-between text-emerald-400">
                                <span>INSTALLER:</span>
                                <strong>ATTACHED ({prod.fileSize || 'READY'})</strong>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-2">
                          <button
                            onClick={() => {
                              handleStartEditProduct(prod);
                              setEditUploadMode('folder');
                            }}
                            className="w-full py-2 rounded-xl bg-[#FF6321]/15 hover:bg-[#FF6321]/25 text-[#FF6321] border border-[#FF6321]/40 text-[10px] font-extrabold uppercase flex items-center justify-center gap-1.5 transition-all shadow-sm"
                          >
                            <FolderArchive className="w-4 h-4 text-[#FF6321]" />
                            {prod.fileUrl ? 'UPLOAD / REPLACE FOLDER' : 'UPLOAD SOFTWARE FOLDER'}
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleStartEditProduct(prod)}
                              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] uppercase flex items-center justify-center gap-1 border border-white/10 transition-all"
                            >
                              <Pencil className="w-3.5 h-3.5" /> EDIT DETAILS
                            </button>

                            <button
                              onClick={() => handleToggleComingSoon(prod)}
                              className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-1 border transition-all ${
                                prod.isComingSoon
                                  ? 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border-emerald-500/40'
                                  : 'bg-amber-950/60 hover:bg-amber-900 text-amber-300 border-amber-500/40'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              {prod.isComingSoon ? 'REMOVE SOON' : 'SET SOON'}
                            </button>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <button
                              onClick={() => handleTogglePublish(prod)}
                              className="px-3 py-1.5 rounded-lg bg-black/60 text-gray-300 hover:text-white border border-white/10 text-[10px] font-bold uppercase flex items-center gap-1"
                            >
                              {prod.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              {prod.isPublished ? 'UNPUBLISH' : 'PUBLISH'}
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: UPLOAD PRODUCT */}
            {activeTab === 'add-product' && (
              <div className="max-w-2xl mx-auto p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-6 animate-fadeIn shadow-2xl">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider border-b border-white/10 pb-4">
                  CREATE NEW APEX PRODUCT
                </h2>

                <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-300 font-bold uppercase mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Apex Games Engine or Apex Cyber Tools"
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-bold uppercase mb-1">Category *</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none"
                      >
                        <option value="Editor">Editor</option>
                        <option value="Tools">Tools</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Plugins">Plugins</option>
                        <option value="Games">Games</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold uppercase mb-1">Version *</label>
                      <input
                        type="text"
                        required
                        value={newProdVersion}
                        onChange={(e) => setNewProdVersion(e.target.value)}
                        placeholder="v1.0.0"
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold uppercase mb-1">Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      placeholder="High performance commercial tool for..."
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-bold uppercase mb-1">Pricing Model *</label>
                      <select
                        value={newProdPricingType}
                        onChange={(e) => setNewProdPricingType(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none"
                      >
                        <option value="fixed">Fixed Price (₦ NGN)</option>
                        <option value="tbd">TBD (To Be Determined / Coming Soon)</option>
                        <option value="free">FREE Product</option>
                      </select>
                    </div>

                    {newProdPricingType === 'fixed' && (
                      <div>
                        <label className="block text-gray-300 font-bold uppercase mb-1">Price (₦ NGN) *</label>
                        <input
                          type="number"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(Number(e.target.value))}
                          placeholder="5000"
                          className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#FF6321]" /> IS COMING SOON PRODUCT?
                      </div>
                      <p className="text-[10px] text-gray-300 mt-0.5">
                        Tag this product with COMING SOON until the installer package is ready.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProdIsComingSoon}
                        onChange={(e) => setNewProdIsComingSoon(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6321]"></div>
                    </label>
                  </div>

                  {/* SOFTWARE RELEASE PACKAGE / FOLDER UPLOAD */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-black/80 to-[#120a05] border border-[#FF6321]/30 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-sm font-extrabold text-[#FF6321] uppercase tracking-wider flex items-center gap-2">
                          <FolderArchive className="w-4 h-4 text-[#FF6321]" />
                          SOFTWARE RELEASE PACKAGE / FOLDER UPLOAD
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Upload the software folder or installer zip for {newProdName || 'new product'}. When a customer pays and you accept, it will automatically compress into a ZIP file.
                        </p>
                      </div>

                      {/* Mode toggle */}
                      <div className="flex items-center gap-1 bg-black/80 p-1 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => setNewUploadMode('folder')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                            newUploadMode === 'folder'
                              ? 'bg-[#FF6321] text-black shadow-md'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <Folder className="w-3.5 h-3.5" /> SOFTWARE FOLDER
                        </button>

                        <button
                          type="button"
                          onClick={() => setNewUploadMode('file')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                            newUploadMode === 'file'
                              ? 'bg-[#FF6321] text-black shadow-md'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <Archive className="w-3.5 h-3.5" /> INSTALLER / ZIP
                        </button>
                      </div>
                    </div>

                    {/* Active Attached Package State */}
                    {newProdFileUrl ? (
                      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                              <FolderArchive className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> SOFTWARE PACKAGE ATTACHED & READY
                              </span>
                              <p className="text-[11px] text-gray-300 font-mono mt-0.5 truncate max-w-md">
                                {newProdFileUrl}
                              </p>
                            </div>
                          </div>

                          <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                            SIZE: {newProdFileSize || 'ZIP PACKAGE'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-emerald-500/20">
                          <a
                            href={newProdFileUrl}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 text-[10px] font-black uppercase flex items-center gap-1.5 transition-all shadow-md"
                          >
                            <Download className="w-3.5 h-3.5" /> TEST DOWNLOAD PACKAGE
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setNewProdFileUrl('');
                              setNewProdFileSize('');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase flex items-center gap-1 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> REPLACE / REMOVE
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Upload Input Dropzone */
                      <div className="relative border-2 border-dashed border-[#FF6321]/40 hover:border-[#FF6321] rounded-xl p-6 text-center bg-black/40 hover:bg-black/60 transition-all cursor-pointer group">
                        {newUploadMode === 'folder' ? (
                          <>
                            <input
                              type="file"
                              /* @ts-ignore */
                              webkitdirectory=""
                              directory=""
                              multiple
                              onChange={(e) => handleFolderUpload(e, false)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center gap-2 pointer-events-none">
                              <FolderArchive className="w-8 h-8 text-[#FF6321] group-hover:scale-110 transition-transform" />
                              <div>
                                <span className="text-xs font-extrabold text-white uppercase tracking-wider block">
                                  CLICK TO SELECT ENTIRE SOFTWARE FOLDER
                                </span>
                                <span className="text-[10px] text-gray-400 mt-0.5 block">
                                  Automatically compresses all subfiles inside into a downloadable ZIP package
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <input
                              type="file"
                              accept=".zip,.rar,.7z,.exe,.dmg,.pkg,.app,.tar,.gz,.iso"
                              onChange={(e) => handleSingleFileUpload(e, false)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center gap-2 pointer-events-none">
                              <Archive className="w-8 h-8 text-[#FF6321] group-hover:scale-110 transition-transform" />
                              <div>
                                <span className="text-xs font-extrabold text-white uppercase tracking-wider block">
                                  CLICK TO UPLOAD INSTALLER OR ZIP ARCHIVE
                                </span>
                                <span className="text-[10px] text-gray-400 mt-0.5 block">
                                  Supports .zip, .rar, .exe, .dmg, .app, and installer binaries
                                </span>
                              </div>
                            </div>
                          </>
                        )}

                        {isUploadingFile && (
                          <div className="absolute inset-0 bg-black/90 rounded-xl flex flex-col items-center justify-center gap-2 z-20">
                            <RefreshCw className="w-6 h-6 text-[#FF6321] animate-spin" />
                            <span className="text-xs font-mono font-bold text-[#FF6321] animate-pulse">
                              COMPRESSING & UPLOADING SOFTWARE PACKAGE... PLEASE WAIT
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">
                        OR PASTE DIRECT DOWNLOAD URL / LOCAL PATH
                      </label>
                      <input
                        type="text"
                        value={newProdFileUrl}
                        onChange={(e) => setNewProdFileUrl(e.target.value)}
                        placeholder="e.g. /downloads/files/apex-editor-v2.4.0.zip"
                        className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#FF6321]"
                      />
                    </div>
                  </div>

                  {/* OPTIONAL EXTERNAL WEB APP URL */}
                  <div className="p-4 rounded-2xl bg-[#031d28]/70 border border-cyan-500/40 space-y-2">
                    <label className="block text-cyan-400 font-extrabold text-xs uppercase flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      LIVE WEB APPLICATION / EXTERNAL DEMO URL (OPTIONAL)
                    </label>
                    <p className="text-[11px] text-gray-300 font-sans">
                      Optional. If this product is a web application (like ChatGPT, a web tool, or external site), paste its link here. Users will see a direct "Launch Web App" redirect button when clicking on it.
                    </p>
                    <input
                      type="url"
                      value={newProdExternalUrl}
                      onChange={(e) => setNewProdExternalUrl(e.target.value)}
                      placeholder="e.g. https://chat.apexsyndicate.com.ng or https://myapp.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/80 border border-cyan-500/50 text-cyan-200 font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold uppercase mb-1">Features (One per line)</label>
                    <textarea
                      rows={3}
                      value={newProdFeatures}
                      onChange={(e) => setNewProdFeatures(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none resize-none font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,99,33,0.35)]"
                  >
                    CREATE & PUBLISH PRODUCT
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: REQUESTS */}
            {activeTab === 'requests' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                      DOWNLOAD REQUEST MANAGEMENT
                    </h2>
                    <p className="text-xs text-gray-400">
                      Verify bank transfers and grant customer access to downloadable software files.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-white/10">
                    {['ALL', 'AWAITING_APPROVAL', 'PAYMENT_SUBMITTED', 'APPROVED', 'REJECTED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setReqFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                          reqFilter === st
                            ? 'bg-[#FF6321] text-black'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-black/60 text-gray-500 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-3">Request ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Product</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Payment Reference</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Owner Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredRequests.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-400">
                            <p className="font-bold text-gray-300">No download requests found.</p>
                            <p className="text-[11px] text-gray-500 mt-1">Customer download and payment requests will automatically appear here when submitted.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-white/5">
                            <td className="p-3 font-mono font-bold text-[#FF6321]">{req.requestId}</td>
                            <td className="p-3">
                              <div className="font-bold text-white">{req.customerName}</div>
                              <div className="text-[10px] text-gray-500">{req.customerEmail}</div>
                            </td>
                            <td className="p-3">{req.productName} ({req.productVersion})</td>
                            <td className="p-3 font-bold text-white">
                              {(req.amount || 0) === 0 ? 'FREE' : `₦${(req.amount || 0).toLocaleString()}`}
                            </td>
                            <td className="p-3 font-mono text-[#FF6321]">{req.paymentProofRef || 'N/A'}</td>
                            <td className="p-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  req.status === 'APPROVED'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : req.status === 'REJECTED'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                    : 'bg-[#FF6321]/20 text-[#FF6321] border border-[#FF6321]/40'
                                }`}
                              >
                                {req.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {req.status !== 'APPROVED' && (
                                <button
                                  onClick={() => handleApproveRequest(req.id)}
                                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase mr-2 shadow-sm"
                                >
                                  APPROVE
                                </button>
                              )}
                              {req.status !== 'REJECTED' && (
                                <button
                                  onClick={() => handleRejectRequest(req.id)}
                                  className="px-3.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-bold text-[10px] uppercase"
                                >
                                  REJECT
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: CUSTOMERS */}
            {activeTab === 'customers' && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                  REGISTERED CUSTOMER DIRECTORY
                </h2>

                <div className="p-6 rounded-[28px] bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-black/60 text-gray-500 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-3">Customer Name</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3">Total Requests</th>
                        <th className="p-3">Approved Downloads</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {Array.from(new Set(requests.map((r) => r.customerEmail))).map((email) => {
                        const custReqs = requests.filter((r) => r.customerEmail === email);
                        const custName = custReqs[0]?.customerName || 'Customer';
                        const approved = custReqs.filter((r) => r.status === 'APPROVED').length;

                        return (
                          <tr key={email} className="hover:bg-white/5">
                            <td className="p-3 font-bold text-white">{custName}</td>
                            <td className="p-3 font-mono text-gray-400">{email}</td>
                            <td className="p-3 font-bold">{custReqs.length}</td>
                            <td className="p-3 font-bold text-emerald-400">{approved}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: PRICING & LAUNCH TIMER CONTROLS */}
            {activeTab === 'pricing' && (
              <div className="max-w-3xl mx-auto p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-8 animate-fadeIn shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                      LAUNCH TIMER & PHASE CONTROLS
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Configure launch dates, pause/resume countdowns, phase durations, and promotional pricing.
                    </p>
                  </div>

                  {/* Pause / Resume & Reset Launch Timer Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetTimerToToday}
                      className="px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 bg-[#FF6321] hover:bg-[#FF8A50] text-black border border-[#FF6321] shadow-[0_0_20px_rgba(255,99,33,0.3)] transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>RESET TIMER TO 14 DAYS</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleTimerPause}
                      className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 border shadow-lg transition-all ${
                        timerPaused
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      }`}
                    >
                      {timerPaused ? <Play className="w-4 h-4 fill-emerald-400" /> : <Pause className="w-4 h-4 fill-amber-300" />}
                      <span>{timerPaused ? 'RESUME LAUNCH TIMER' : 'PAUSE LAUNCH TIMER'}</span>
                    </button>
                  </div>
                </div>

                {/* Timer Status Indicator */}
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    timerPaused
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
                    <Clock className="w-4 h-4" />
                    <span>STATUS: {timerPaused ? 'TIMER IS PAUSED / FROZEN' : 'TIMER IS LIVE & COUNTING DOWN'}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-black/40">
                    {timerPaused ? 'HALTED BY OWNER' : 'ACTIVE'}
                  </span>
                </div>

                <form onSubmit={handleSaveSettingsSubmit} className="space-y-6 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-gray-300 font-bold uppercase">
                        Official Launch Start Date *
                      </label>
                      <button
                        type="button"
                        onClick={handleResetTimerToToday}
                        className="text-[11px] font-extrabold text-[#FF6321] hover:underline flex items-center gap-1 uppercase font-mono"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset to Today (14 Days Free)
                      </button>
                    </div>
                    <input
                      type="date"
                      required
                      value={launchDateStr}
                      onChange={(e) => setLaunchDateStr(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-bold uppercase mb-1">
                        Phase 1: Free Access Duration (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={freeDays}
                        onChange={(e) => setFreeDays(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">Default is 14 days (2 weeks free access).</p>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold uppercase mb-1">
                        Phase 2: Early Access Duration (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={earlyDays}
                        onChange={(e) => setEarlyDays(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">Default is 14 days (2 weeks early access).</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-bold uppercase mb-1">
                        Early Access Price (₦ NGN)
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={earlyPrice}
                        onChange={(e) => setEarlyPrice(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold uppercase mb-1">
                        Full Commercial Price (₦ NGN)
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={fullPrice}
                        onChange={(e) => setFullPrice(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {launchPricing && (
                    <div className="p-4 rounded-2xl bg-black/60 border border-[#FF6321]/30 space-y-2 font-mono">
                      <div className="text-xs text-[#FF6321] font-bold uppercase">LIVE LAUNCH ENGINE PREVIEW:</div>
                      <div className="text-white text-xs">Day #{launchPricing.currentDayNumber} of Launch Sequence</div>
                      <div className="text-emerald-400 font-black text-sm uppercase">{launchPricing.phaseName}</div>
                      <div className="text-gray-400 text-[11px]">
                        Current Price: {(launchPricing.currentPrice || 0) === 0 ? 'FREE' : `₦${(launchPricing.currentPrice || 0).toLocaleString()}`}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,99,33,0.35)]"
                  >
                    SAVE LAUNCH & PRICING CONFIGURATION
                  </button>
                </form>

                {/* APEX EDITOR DEMO CONFIGURATION */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Play className="w-4 h-4 text-amber-400 fill-current" /> APEX EDITOR DEMO LINK CONFIGURATION
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Set the destination URL for the "APEX EDITOR DEMO" tab. When left empty, visitors see "DEMO UNAVAILABLE".
                      </p>
                    </div>
                    {apexEditorDemoUrl ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase font-bold border border-emerald-500/40">
                        LINK ACTIVE
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-mono text-[10px] uppercase font-bold border border-rose-500/40">
                        DEMO UNAVAILABLE
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-300 font-bold uppercase text-xs">
                      Live Demo Web URL / Domain
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={apexEditorDemoUrl}
                        onChange={(e) => setApexEditorDemoUrl(e.target.value)}
                        placeholder="e.g. https://apex-editor-demo.vercel.app/"
                        className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                      />
                      {apexEditorDemoUrl && (
                        <a
                          href={apexEditorDemoUrl.startsWith('http') ? apexEditorDemoUrl : `https://${apexEditorDemoUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase flex items-center gap-1.5"
                        >
                          TEST
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* GANGSTER REVOLUTION GAME LAUNCH & SPECS CONFIGURATION */}
                <div className="pt-6 border-t border-white/10 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-red-500" /> GANGSTER REVOLUTION LAUNCH & SPECIFICATIONS
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Configure target release window, build status, and PC system hardware requirements.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetGangsterSpecsToTbd}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-bold uppercase flex items-center gap-1.5 border border-white/10 shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> RESET ALL SPECS TO TBD
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-bold uppercase text-xs mb-1">
                        Game Launch Window / Date
                      </label>
                      <input
                        type="text"
                        value={gangsterRevolutionLaunchDate}
                        onChange={(e) => setGangsterRevolutionLaunchDate(e.target.value)}
                        placeholder="e.g. TBD, Q4 2026, or Coming Soon"
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold uppercase text-xs mb-1">
                        Development Status Label
                      </label>
                      <input
                        type="text"
                        value={gangsterRevolutionStatus}
                        onChange={(e) => setGangsterRevolutionStatus(e.target.value)}
                        placeholder="e.g. PRE-ALPHA BUILD • IN DEVELOPMENT"
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Minimum System Requirements */}
                  <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4">
                    <h4 className="text-xs font-extrabold text-[#FF6321] uppercase tracking-wider font-mono">
                      MINIMUM SYSTEM REQUIREMENTS (OR TBD)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-mono mb-1">OS</label>
                        <input
                          type="text"
                          value={gangsterSpecs.minOs}
                          onChange={(e) => setGangsterSpecs({ ...gangsterSpecs, minOs: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-mono mb-1">Processor</label>
                        <input
                          type="text"
                          value={gangsterSpecs.minProcessor}
                          onChange={(e) => setGangsterSpecs({ ...gangsterSpecs, minProcessor: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-mono mb-1">Memory</label>
                        <input
                          type="text"
                          value={gangsterSpecs.minMemory}
                          onChange={(e) => setGangsterSpecs({ ...gangsterSpecs, minMemory: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-mono mb-1">Graphics</label>
                        <input
                          type="text"
                          value={gangsterSpecs.minGraphics}
                          onChange={(e) => setGangsterSpecs({ ...gangsterSpecs, minGraphics: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-mono mb-1">DirectX</label>
                        <input
                          type="text"
                          value={gangsterSpecs.minDirectX}
                          onChange={(e) => setGangsterSpecs({ ...gangsterSpecs, minDirectX: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-mono mb-1">Storage</label>
                        <input
                          type="text"
                          value={gangsterSpecs.minStorage}
                          onChange={(e) => setGangsterSpecs({ ...gangsterSpecs, minStorage: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recommended System Requirements */}
                  <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4">
                    <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider font-mono">
                      RECOMMENDED SYSTEM REQUIREMENTS (OR TBD)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-mono mb-1">OS</label>
                        <input
                          type="text"
                          value={gangsterSpecs.recOs}
                          onChange={(e) => setGangsterSpecs({ ...gangsterSpecs, recOs: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-mono mb-1">Processor</label>
                        <input
                          type="text"
                          value={gangsterSpecs.recProcessor}
                          onChange={(e) => setGangsterSpecs({ ...gangsterSpecs, recProcessor: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-mono mb-1">Memory</label>
                        <input
                          type="text"
                          value={gangsterSpecs.recMemory}
                          onChange={(e) => setGangsterSpecs({ ...gangsterSpecs, recMemory: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-mono mb-1">Graphics</label>
                        <input
                          type="text"
                          value={gangsterSpecs.recGraphics}
                          onChange={(e) => setGangsterSpecs({ ...gangsterSpecs, recGraphics: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-mono mb-1">DirectX</label>
                        <input
                          type="text"
                          value={gangsterSpecs.recDirectX}
                          onChange={(e) => setGangsterSpecs({ ...gangsterSpecs, recDirectX: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-[10px] uppercase font-mono mb-1">Storage</label>
                        <input
                          type="text"
                          value={gangsterSpecs.recStorage}
                          onChange={(e) => setGangsterSpecs({ ...gangsterSpecs, recStorage: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-white text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSettingsSubmit}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-[#FF6321] to-amber-500 hover:opacity-90 text-black font-extrabold text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(255,99,33,0.35)]"
                  >
                    PUBLISH GANGSTER REVOLUTION & DEMO CONFIGURATION LIVE
                  </button>
                </div>
              </div>
            )}

            {/* TAB: PORTFOLIO SHOWCASE VIDEO MANAGEMENT */}
            {activeTab === 'portfolio' && (
              <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
                <div className="p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-2xl border border-[#FF6321]/40 space-y-6 shadow-[0_0_40px_rgba(255,99,33,0.2)]">
                  {/* Top Header & Download Action */}
                  <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-[11px] font-mono font-bold uppercase tracking-widest">
                        <Film className="w-3.5 h-3.5" /> OWNER DEVLOG CONTROLS
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-2 flex items-center gap-2">
                        DEV UPDATES & CREATION VIDEO
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">
                        Download the current dev updates video, upload a replacement video file, or remove it so the site displays "Dev Updates Coming Soon".
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadPortfolioVideo}
                      className="px-6 py-3.5 rounded-2xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_25px_rgba(255,99,33,0.4)] transition-all shrink-0 hover:scale-105"
                    >
                      <Download className="w-4 h-4" />
                      <span>DOWNLOAD DEV UPDATES VIDEO (.MP4)</span>
                    </button>
                  </div>

                  {/* Active Mode Status Banner */}
                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-gray-400 uppercase font-bold">CURRENT ACTIVE SITE MODE:</div>
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3 h-3 rounded-full animate-ping ${
                          portfolioVideoMode === 'blank'
                            ? 'bg-amber-400'
                            : portfolioVideoMode === 'custom'
                            ? 'bg-blue-400'
                            : 'bg-emerald-400'
                        }`} />
                        <span className={`text-base font-black uppercase font-mono ${
                          portfolioVideoMode === 'blank'
                            ? 'text-amber-400'
                            : portfolioVideoMode === 'custom'
                            ? 'text-blue-400'
                            : 'text-emerald-400'
                        }`}>
                          {portfolioVideoMode === 'blank'
                            ? 'BLANK — DISPLAYING "DEV UPDATES COMING SOON"'
                            : portfolioVideoMode === 'custom'
                            ? 'CUSTOM OWNER DEVLOG VIDEO ACTIVE'
                            : 'DEFAULT PROJECT SHOWCASE REEL'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-gray-400 text-left sm:text-right space-y-0.5">
                      <div>Founder: <strong className="text-white font-bold">OKERE CHIEMEKA</strong></div>
                      <div>Projects: <strong className="text-white font-bold">Apex Editor & Gangster Revolution</strong></div>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
                    {/* Action 1: Upload New Video */}
                    <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-sm font-extrabold text-[#FF6321] uppercase flex items-center gap-2">
                          <UploadCloud className="w-4 h-4" /> 1. UPLOAD DEV VIDEO
                        </h3>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                          Upload an MP4 or WebM video file from your device. It is saved directly to the server so all visitors see your creation updates.
                        </p>
                      </div>

                      {isUploadingCustomVideo ? (
                        <div className="p-5 rounded-2xl border-2 border-[#FF6321] bg-[#FF6321]/10 text-center space-y-2">
                          <RefreshCw className="w-7 h-7 text-[#FF6321] mx-auto animate-spin" />
                          <div className="text-white font-extrabold text-xs uppercase">
                            SAVING TO SERVER...
                          </div>
                          <div className="text-[10px] text-gray-400">
                            Broadcasting video to all visitors
                          </div>
                        </div>
                      ) : (
                        <label className="block cursor-pointer">
                          <div className="p-5 rounded-2xl border-2 border-dashed border-[#FF6321]/50 hover:border-[#FF6321] bg-[#FF6321]/5 text-center space-y-2 transition-all hover:scale-[1.02]">
                            <UploadCloud className="w-7 h-7 text-[#FF6321] mx-auto animate-bounce" />
                            <div className="text-white font-extrabold text-xs uppercase">
                              CHOOSE & UPLOAD VIDEO
                            </div>
                            <div className="text-[10px] text-gray-400">
                              Supports .MP4, .WEBM (Up to 500MB)
                            </div>
                          </div>
                          <input
                            type="file"
                            accept="video/mp4,video/webm"
                            onChange={handleUploadCustomVideo}
                            className="hidden"
                            disabled={isUploadingCustomVideo}
                          />
                        </label>
                      )}

                      {/* Or Enter Direct Video URL */}
                      <form onSubmit={handleSaveVideoUrl} className="pt-2 border-t border-white/10 space-y-2">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">OR PASTE DIRECT VIDEO URL:</div>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="https://...video.mp4"
                            value={customVideoUrlInput}
                            onChange={(e) => setCustomVideoUrlInput(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl bg-black/80 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-[#FF6321]"
                          />
                          <button
                            type="submit"
                            disabled={isUploadingCustomVideo || !customVideoUrlInput.trim()}
                            className="px-3 py-2 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-[11px] disabled:opacity-50"
                          >
                            SAVE URL
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Action 2: Remove Video / Leave Blank */}
                    <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-sm font-extrabold text-amber-400 uppercase flex items-center gap-2">
                          <Clock className="w-4 h-4" /> 2. REMOVE / SET BLANK
                        </h3>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                          Remove the active video and leave it blank. The website will immediately show the <strong>"Dev Updates Coming Soon"</strong> card.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveVideoSetBlank}
                        className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                          portfolioVideoMode === 'blank'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                            : 'bg-black/60 hover:bg-amber-950/40 text-amber-400 border-amber-500/40'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>SET TO "COMING SOON"</span>
                      </button>
                    </div>

                    {/* Action 3: Restore Default 18s Kinetic Reel */}
                    <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-sm font-extrabold text-emerald-400 uppercase flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" /> 3. RESTORE DEFAULT REEL
                        </h3>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                          Restore the original 18-second hyper-kinetic animated showcase reel with fast motion and electronic beats.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetCustomVideo}
                        className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                          portfolioVideoMode === 'default'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : 'bg-black/60 hover:bg-emerald-950/40 text-emerald-400 border-emerald-500/40'
                        }`}
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>RESTORE DEFAULT REEL</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: SITE TABS & ANNOUNCEMENT BANNER */}
            {activeTab === 'site-customization' && (
              <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
                {/* Portfolio Showcase Video Management (Owner Tab Feature) */}
                <div className="p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-2xl border border-[#FF6321]/40 space-y-6 shadow-[0_0_30px_rgba(255,99,33,0.2)]">
                  <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <UploadCloud className="w-6 h-6 text-[#FF6321]" /> PORTFOLIO SHOWCASE VIDEO MANAGEMENT
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">
                        Download the current showcase reel as an MP4 or upload your custom video file to replace the site showcase.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadPortfolioVideo}
                      className="px-5 py-3 rounded-2xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,99,33,0.4)] transition-all shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>DOWNLOAD SHOWCASE REEL (.MP4)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                    {/* Upload New Video Dropzone */}
                    <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-4">
                      <h3 className="text-sm font-extrabold text-[#FF6321] uppercase flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" /> UPLOAD NEW SHOWCASE VIDEO (.MP4 / .WEBM)
                      </h3>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                        Select a video file from your device to replace the animated reel on the website.
                      </p>

                      <label className="block cursor-pointer">
                        <div className="p-6 rounded-2xl border-2 border-dashed border-[#FF6321]/50 hover:border-[#FF6321] bg-[#FF6321]/5 text-center space-y-2 transition-all">
                          <UploadCloud className="w-8 h-8 text-[#FF6321] mx-auto animate-bounce" />
                          <div className="text-white font-extrabold text-xs uppercase">
                            CLICK TO CHOOSE & UPLOAD VIDEO FILE
                          </div>
                          <div className="text-[10px] text-gray-400">
                            Supports MP4, WEBM (Max 100MB)
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          onChange={handleUploadCustomVideo}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Current Showcase Status & Reset */}
                    <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-white uppercase flex items-center gap-2">
                          <Film className="w-4 h-4 text-[#FF6321]" /> CURRENT ACTIVE SHOWCASE STATUS
                        </h3>

                        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-gray-400">Mode:</span>
                            <span className={customVideoUploaded ? 'text-amber-400' : 'text-emerald-400'}>
                              {customVideoUploaded ? 'CUSTOM UPLOADED VIDEO' : 'DEFAULT ANIMATED REEL'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span>Founder:</span>
                            <span className="text-white font-bold">OKERE CHIEMEKA</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span>Projects:</span>
                            <span className="text-white font-bold">Apex Editor & Gangster Revolution</span>
                          </div>
                        </div>
                      </div>

                      {customVideoUploaded && (
                        <button
                          type="button"
                          onClick={handleResetCustomVideo}
                          className="w-full py-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                        >
                          <RotateCcw className="w-4 h-4" /> RESET TO DEFAULT ANIMATED REEL
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {/* Announcement Banner Management */}
                <div className="p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                        TOP ANNOUNCEMENT BANNER
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Display a promotional alert or notification across the top of every page.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showAnnouncement}
                        onChange={(e) => setShowAnnouncement(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6321]"></div>
                    </label>
                  </div>

                  <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-gray-300 font-bold uppercase mb-1">Banner Text Content</label>
                      <input
                        type="text"
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        placeholder="🔥 APEX EDITOR LAUNCH PROMOTION IS LIVE..."
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF6321]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase tracking-wider"
                    >
                      SAVE BANNER SETTINGS
                    </button>
                  </form>
                </div>

                {/* Custom Site Tabs Manager */}
                <div className="p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-6 shadow-2xl">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                      CUSTOM SITE NAVIGATION TABS
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Add and publish custom pages/tabs to the site header (e.g., DOCUMENTATION, FAQ, ROADMAP).
                    </p>
                  </div>

                  {/* Add New Custom Tab Form */}
                  <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-4 text-xs">
                    <h3 className="text-sm font-extrabold text-[#FF6321] uppercase flex items-center gap-2">
                      <Plus className="w-4 h-4" /> ADD NEW CUSTOM SITE TAB
                    </h3>

                    <div>
                      <label className="block text-gray-300 font-bold uppercase mb-1">Tab Name / Label *</label>
                      <input
                        type="text"
                        value={newTabLabel}
                        onChange={(e) => setNewTabLabel(e.target.value)}
                        placeholder="e.g. DOCUMENTATION or ROADMAP"
                        className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold uppercase mb-1">Page Content *</label>
                      <textarea
                        rows={5}
                        value={newTabContent}
                        onChange={(e) => setNewTabContent(e.target.value)}
                        placeholder="Enter the full page content for this tab..."
                        className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-white text-xs focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddCustomTab}
                      className="px-6 py-3 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> CREATE & PUBLISH TAB
                    </button>
                  </div>

                  {/* List Existing Custom Tabs */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-xs font-bold uppercase text-gray-400 font-mono">
                      EXISTING CUSTOM SITE TABS ({customTabsList.length})
                    </h3>

                    {customTabsList.length === 0 ? (
                      <p className="p-6 text-center text-xs text-gray-500 rounded-xl bg-black/40 border border-white/5">
                        No custom tabs created yet.
                      </p>
                    ) : (
                      customTabsList.map((ct) => (
                        <div
                          key={ct.id}
                          className="p-5 rounded-2xl bg-black/50 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1 max-w-xl">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-white uppercase">{ct.label}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  ct.isActive
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-black/60 text-gray-500'
                                }`}
                              >
                                {ct.isActive ? 'ACTIVE IN NAVBAR' : 'HIDDEN'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">{ct.content}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleCustomTabActive(ct.id)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[10px] font-bold uppercase flex items-center gap-1"
                            >
                              {ct.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              {ct.isActive ? 'HIDE' : 'SHOW'}
                            </button>

                            <button
                              onClick={() => handleDeleteCustomTab(ct.id)}
                              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 transition-colors"
                              title="Delete Custom Tab"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: PAYMENT SETTINGS */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto p-8 rounded-[28px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-6 animate-fadeIn shadow-2xl">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider border-b border-white/10 pb-4">
                  BANK & OWNER PAYMENT DETAILS
                </h2>

                <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-300 font-bold uppercase mb-1">Bank Name *</label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. OPay / Zenith Bank"
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold uppercase mb-1">Account Name *</label>
                    <input
                      type="text"
                      required
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="e.g. APEX SYNDICATE SOFTWARE LTD"
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold uppercase mb-1">Account Number *</label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 8082961817"
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF6321] font-mono text-sm font-bold text-[#FF6321]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold uppercase mb-1">Instructions for Customers</label>
                    <textarea
                      rows={2}
                      value={bankInstructions}
                      onChange={(e) => setBankInstructions(e.target.value)}
                      placeholder="Transfer the license amount and enter your bank ref ID in the request form."
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <label className="block text-[#FF6321] font-bold uppercase mb-1">Admin Owner Password</label>
                    <input
                      type="password"
                      required
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-extrabold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,99,33,0.35)]"
                  >
                    UPDATE OWNER SETTINGS
                  </button>
                </form>
              </div>
            )}

            {/* TAB 8: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                    SYSTEM NOTIFICATIONS & LOGS
                  </h2>

                  <button
                    onClick={handleMarkNotificationsRead}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold uppercase"
                  >
                    MARK ALL AS READ
                  </button>
                </div>

                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <p className="p-8 text-center text-xs text-gray-500 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
                      No notifications found.
                    </p>
                  ) : (
                    notifications.map((n) => {
                      const req = n.requestId ? requests.find((r) => r.requestId === n.requestId) : null;
                      return (
                        <div
                          key={n.id}
                          className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                            !n.read
                              ? 'bg-[#FF6321]/10 border-[#FF6321]/40 text-white'
                              : 'bg-white/[0.03] border-white/5 text-gray-400'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-xs uppercase text-[#FF6321] flex items-center gap-2">
                              {n.title}
                              {req && (
                                <span className="px-2 py-0.5 rounded bg-black/60 text-white font-mono text-[10px]">
                                  STATUS: {req.status}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-200">{n.message}</div>
                            <div className="text-[10px] text-gray-500 font-mono">
                              {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {req && req.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleApproveRequest(req.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] uppercase shadow-md transition-all"
                              >
                                APPROVE & ACCEPT REQUEST
                              </button>
                            )}
                            {req && req.status !== 'REJECTED' && req.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleRejectRequest(req.id)}
                                className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-bold text-[10px] uppercase transition-all"
                              >
                                REJECT
                              </button>
                            )}
                            {!n.read && (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6321] shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* EDIT PRODUCT MODAL OVERLAY */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0d0f17] border border-[#FF6321]/40 rounded-[28px] p-6 sm:p-8 space-y-6 my-8 shadow-[0_0_50px_rgba(255,99,33,0.2)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-[10px] font-mono text-[#FF6321] font-bold uppercase">
                  EDIT PRODUCT SPECIFICATIONS
                </div>
                <h2 className="text-2xl font-black text-white uppercase">
                  EDIT {editingProduct.name}
                </h2>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editProdName}
                    onChange={(e) => setEditProdName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#FF6321]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold uppercase mb-1">Category *</label>
                  <select
                    value={editProdCategory}
                    onChange={(e) => setEditProdCategory(e.target.value as ProductCategory)}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none"
                  >
                    <option value="Editor">Editor</option>
                    <option value="Tools">Tools</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Plugins">Plugins</option>
                    <option value="Games">Games</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase mb-1">Version *</label>
                  <input
                    type="text"
                    required
                    value={editProdVersion}
                    onChange={(e) => setEditProdVersion(e.target.value)}
                    placeholder="e.g. v2.4.0 (Commercial)"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold uppercase mb-1">
                    Release Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={editProdReleaseDate}
                    onChange={(e) => setEditProdReleaseDate(e.target.value)}
                    placeholder="e.g. August 2026 or Official Release"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Pricing Model & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase mb-1">
                    Pricing Model *
                  </label>
                  <select
                    value={editProdPricingType}
                    onChange={(e) => setEditProdPricingType(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none"
                  >
                    <option value="fixed">Fixed Price (₦ NGN)</option>
                    <option value="tbd">TBD (To Be Determined / Coming Soon)</option>
                    <option value="launch">Apex Launch Promo (Timer Dynamic)</option>
                    <option value="free">FREE Product</option>
                  </select>
                </div>

                {editProdPricingType === 'fixed' && (
                  <div>
                    <label className="block text-gray-300 font-bold uppercase mb-1">
                      Price (₦ NGN)
                    </label>
                    <input
                      type="number"
                      value={editProdPrice}
                      onChange={(e) => setEditProdPrice(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Coming Soon Toggle Checkbox */}
              <div className="p-4 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#FF6321]" /> IS COMING SOON PRODUCT?
                  </div>
                  <p className="text-[11px] text-gray-300 mt-0.5">
                    Uncheck this option when you upload/release the app to remove the <strong>COMING SOON</strong> tag from the website!
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editProdIsComingSoon}
                    onChange={(e) => setEditProdIsComingSoon(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6321]"></div>
                </label>
              </div>

              {/* SOFTWARE RELEASE PACKAGE / FOLDER UPLOAD */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-black/80 to-[#120a05] border border-[#FF6321]/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-sm font-extrabold text-[#FF6321] uppercase tracking-wider flex items-center gap-2">
                      <FolderArchive className="w-4 h-4 text-[#FF6321]" />
                      SOFTWARE RELEASE PACKAGE / FOLDER UPLOAD
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Upload the software folder or installer zip for {editProdName || 'this product'}. When a customer pays and you accept, it will automatically compress and let them download it.
                    </p>
                  </div>

                  {/* Mode toggle */}
                  <div className="flex items-center gap-1 bg-black/80 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditUploadMode('folder')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                        editUploadMode === 'folder'
                          ? 'bg-[#FF6321] text-black shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5" /> SOFTWARE FOLDER
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditUploadMode('file')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                        editUploadMode === 'file'
                          ? 'bg-[#FF6321] text-black shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Archive className="w-3.5 h-3.5" /> INSTALLER / ZIP
                    </button>
                  </div>
                </div>

                {/* Active Attached Package State */}
                {editProdFileUrl ? (
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                          <FolderArchive className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> SOFTWARE PACKAGE ATTACHED & READY
                          </span>
                          <p className="text-[11px] text-gray-300 font-mono mt-0.5 truncate max-w-md">
                            {editProdFileUrl}
                          </p>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                        SIZE: {editProdFileSize || 'ZIP PACKAGE'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-emerald-500/20">
                      <a
                        href={editProdFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 text-[10px] font-black uppercase flex items-center gap-1.5 transition-all shadow-md"
                      >
                        <Download className="w-3.5 h-3.5" /> TEST DOWNLOAD PACKAGE
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setEditProdFileUrl('');
                          setEditProdFileSize('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase flex items-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> REPLACE / REMOVE
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Upload Input Dropzone */
                  <div className="relative border-2 border-dashed border-[#FF6321]/40 hover:border-[#FF6321] rounded-xl p-6 text-center bg-black/40 hover:bg-black/60 transition-all cursor-pointer group">
                    {editUploadMode === 'folder' ? (
                      <>
                        <input
                          type="file"
                          /* @ts-ignore */
                          webkitdirectory=""
                          directory=""
                          multiple
                          onChange={(e) => handleFolderUpload(e, true)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                          <FolderArchive className="w-8 h-8 text-[#FF6321] group-hover:scale-110 transition-transform" />
                          <div>
                            <span className="text-xs font-extrabold text-white uppercase tracking-wider block">
                              CLICK TO SELECT ENTIRE SOFTWARE FOLDER
                            </span>
                            <span className="text-[10px] text-gray-400 mt-0.5 block">
                              Automatically compresses all subfiles inside into a downloadable ZIP package
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept=".zip,.rar,.7z,.exe,.dmg,.pkg,.app,.tar,.gz,.iso"
                          onChange={(e) => handleSingleFileUpload(e, true)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                          <Archive className="w-8 h-8 text-[#FF6321] group-hover:scale-110 transition-transform" />
                          <div>
                            <span className="text-xs font-extrabold text-white uppercase tracking-wider block">
                              CLICK TO UPLOAD INSTALLER OR ZIP ARCHIVE
                            </span>
                            <span className="text-[10px] text-gray-400 mt-0.5 block">
                              Supports .zip, .rar, .exe, .dmg, .app, and installer binaries
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {isEditingUploadingFile && (
                      <div className="absolute inset-0 bg-black/90 rounded-xl flex flex-col items-center justify-center gap-2 z-20">
                        <RefreshCw className="w-6 h-6 text-[#FF6321] animate-spin" />
                        <span className="text-xs font-mono font-bold text-[#FF6321] animate-pulse">
                          COMPRESSING & UPLOADING SOFTWARE PACKAGE... PLEASE WAIT
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-gray-400 font-mono text-[10px] uppercase mb-1">
                    OR PASTE DIRECT DOWNLOAD URL / LOCAL PATH
                  </label>
                  <input
                    type="text"
                    value={editProdFileUrl}
                    onChange={(e) => setEditProdFileUrl(e.target.value)}
                    placeholder="e.g. /downloads/files/apex-editor-v2.4.0.zip"
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#FF6321]"
                  />
                </div>
              </div>

              {/* OPTIONAL EXTERNAL WEB APP URL */}
              <div className="p-4 rounded-2xl bg-[#031d28]/70 border border-cyan-500/40 space-y-2">
                <label className="block text-cyan-400 font-extrabold text-xs uppercase flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  LIVE WEB APPLICATION / EXTERNAL DEMO URL (OPTIONAL)
                </label>
                <p className="text-[11px] text-gray-300 font-sans">
                  Optional. If this product is a web application (like ChatGPT, a web tool, or external site), paste its link here. Users will see a direct "Launch Web App" redirect button when clicking on it.
                </p>
                <input
                  type="url"
                  value={editProdExternalUrl}
                  onChange={(e) => setEditProdExternalUrl(e.target.value)}
                  placeholder="e.g. https://chat.apexsyndicate.com.ng or https://myapp.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/80 border border-cyan-500/50 text-cyan-200 font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-gray-300 font-bold uppercase mb-1">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={editProdDesc}
                  onChange={(e) => setEditProdDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white resize-none focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold uppercase mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={editProdFullDesc}
                  onChange={(e) => setEditProdFullDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white resize-none focus:outline-none"
                />
              </div>

              {/* Features & What's New */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold uppercase mb-1">
                    Features (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={editProdFeatures}
                    onChange={(e) => setEditProdFeatures(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white resize-none focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold uppercase mb-1">
                    What's New / Changelog (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={editProdWhatsNew}
                    onChange={(e) => setEditProdWhatsNew(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white resize-none focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold uppercase transition-all"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#FF6321] hover:bg-[#FF8A50] text-black font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,99,33,0.4)] flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> SAVE PRODUCT DETAILS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CAPCUT-READY MP4 VIDEO EXPORT PROGRESS MODAL */}
      {isExportingVideo && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border-2 border-[#FF6321] rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-[0_0_60px_rgba(255,99,33,0.4)] animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-[#FF6321]/20 border border-[#FF6321]/40 flex items-center justify-center mx-auto text-[#FF6321]">
              <Film className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                GENERATING CAPCUT-READY MP4
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Encoding 18-second kinetic video with H.264 video track and soundtrack audio. 100% compatible with CapCut, Premiere, & mobile editors.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-gray-300 truncate max-w-[280px]">{exportStatusText || 'Rendering frames...'}</span>
                <span className="text-[#FF6321]">{exportProgress}%</span>
              </div>
              <div className="w-full h-3 bg-black/80 rounded-full border border-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6321] via-amber-400 to-[#FF6321] transition-all duration-150 rounded-full"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] font-mono text-gray-500">
              Please do not close this tab until the MP4 video download triggers automatically.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
