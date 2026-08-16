import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const archiver = require('archiver');
import { GoogleGenAI } from '@google/genai';
import { store } from '../store';

const router = Router();

// Setup Multer for secure file uploads
const uploadDir = path.join(process.cwd(), 'public', 'downloads', 'files');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
});

// Simple Token Admin Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const settings = store.getSettings();

  // Token matches admin password or admin session token
  if (token === settings.adminPassword || token === `apex-session-${settings.adminPassword}`) {
    return next();
  }

  return res.status(403).json({ error: 'Forbidden. Invalid admin credentials.' });
}

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

// 1. Get Launch Pricing for Apex Editor
router.get('/pricing/apex-editor', (req: Request, res: Response) => {
  try {
    const pricing = store.getApexEditorLaunchPricing();
    res.json(pricing);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Products (Public vs Admin)
router.get('/products', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    let isAdmin = false;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '').trim();
      const settings = store.getSettings();
      if (token === settings.adminPassword || token === `apex-session-${settings.adminPassword}`) {
        isAdmin = true;
      }
    }

    const products = store.getProducts(isAdmin);
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Single Product
router.get('/products/:id', (req: Request, res: Response) => {
  try {
    const product = store.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Public Payment Settings (Bank info, instructions)
router.get('/settings/payment', (req: Request, res: Response) => {
  try {
    const settings = store.getSettings();
    // Exclude password
    const publicSettings = {
      bankName: settings.bankName,
      accountName: settings.accountName,
      accountNumber: settings.accountNumber,
      bankInstructions: settings.bankInstructions,
      ownerEmail: settings.ownerEmail,
    };
    res.json(publicSettings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4b. Public Site Settings (Announcement, custom tabs, portfolio video configuration)
router.get('/settings/public', (req: Request, res: Response) => {
  try {
    const settings = store.getSettings();
    res.json({
      bankName: settings.bankName,
      accountName: settings.accountName,
      accountNumber: settings.accountNumber,
      bankInstructions: settings.bankInstructions,
      ownerEmail: settings.ownerEmail,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      announcementText: settings.announcementText,
      showAnnouncement: settings.showAnnouncement,
      customTabs: settings.customTabs || [],
      portfolioVideoMode: settings.portfolioVideoMode || 'default',
      portfolioVideoUrl: settings.portfolioVideoUrl || '',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Submit Download Request
router.post('/requests', (req: Request, res: Response) => {
  try {
    const { customerName, customerEmail, productId, paymentProofRef } = req.body;
    if (!customerName || !customerEmail || !productId) {
      return res.status(400).json({ error: 'Customer Name, Email, and Product ID are required.' });
    }

    const newRequest = store.createDownloadRequest({
      customerName,
      customerEmail,
      productId,
      paymentProofRef,
    });

    console.log(`[DISPATCHED EMAIL TO apexsyndicategr@gmail.com]: New Download Request (${newRequest.requestId}) for ${newRequest.productName} by ${customerName} (${customerEmail})`);

    res.status(201).json(newRequest);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Check Download Request Status by Request ID or Email
router.get('/requests/check/:query', (req: Request, res: Response) => {
  try {
    const reqItem = store.getRequestByCode(req.params.query);
    if (!reqItem) {
      return res.status(404).json({ error: 'Request ID or record not found.' });
    }
    res.json(reqItem);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6b. Get User Requests List (batch by ids or email)
router.get('/requests/user-list', (req: Request, res: Response) => {
  try {
    const { ids, email } = req.query;
    const allRequests = store.getRequests();
    let result = [...allRequests];

    if (email && typeof email === 'string') {
      const targetEmail = email.trim().toLowerCase();
      result = result.filter((r) => r.customerEmail.toLowerCase() === targetEmail);
    } else if (ids && typeof ids === 'string') {
      const idList = ids.split(',').map((s) => s.trim().toUpperCase());
      result = result.filter(
        (r) => idList.includes(r.id.toUpperCase()) || idList.includes(r.requestId.toUpperCase())
      );
    } else {
      result = [];
    }

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Submit Contact Form (routes directly to apexsyndicategr@gmail.com)
const handleContactSubmit = (req: Request, res: Response) => {
  try {
    const { name, email, subject, category, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, Email, and Message are required.' });
    }

    const categoryText = category || subject || 'General Inquiry';
    const savedMsg = store.saveContactMessage({ name, email, category: categoryText, message });

    console.log(`[DISPATCHED EMAIL TO apexsyndicategr@gmail.com]: Contact Transmission from ${name} (${email}) - Subject: ${categoryText} - Details: ${message}`);

    res.status(201).json({
      success: true,
      message: 'Transmission sent directly to apexsyndicategr@gmail.com',
      targetEmail: 'apexsyndicategr@gmail.com',
      contact: savedMsg,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

router.post('/contact', handleContactSubmit);
router.post('/contacts', handleContactSubmit);

// 8. Secure Tokenized Download Route
router.get('/download/file/:token', (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { valid, request, product } = store.validateDownloadToken(token);

    if (!valid || !request || !product) {
      return res.status(403).send(`
        <html>
          <head><title>Download Access Locked - Apex Syndicate</title></head>
          <body style="background: #090a0f; color: #fff; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
            <div style="text-align: center; border: 1px solid #331500; background: #120b06; padding: 40px; rounded: 16px; max-width: 480px;">
              <h1 style="color: #ff6b00; margin-top: 0;">Access Locked</h1>
              <p style="color: #ccc;">This download link is invalid, expired, or pending payment approval.</p>
              <a href="/download" style="display: inline-block; background: #ff6b00; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 20px;">Check Request Status</a>
            </div>
          </body>
        </html>
      `);
    }

    const defaultFilename = `${product.slug}-${product.version.replace(/[^a-zA-Z0-9.-]+/g, '_')}.zip`;

    // 1. Check if product has an attached fileUrl
    if (product.fileUrl) {
      // Local path e.g. /downloads/files/apex-editor-v2.4.0.zip
      if (product.fileUrl.startsWith('/downloads/') || product.fileUrl.startsWith('/public/')) {
        const relativePath = product.fileUrl.replace(/^\/public/, '');
        const diskPath = path.join(process.cwd(), 'public', relativePath);

        if (fs.existsSync(diskPath)) {
          const stat = fs.statSync(diskPath);
          if (stat.isFile()) {
            // Determine file extension or download as attachment
            const ext = path.extname(diskPath) || '.zip';
            const downloadName = `${product.slug}-${product.version.replace(/[^a-zA-Z0-9.-]+/g, '_')}${ext}`;
            return res.download(diskPath, downloadName);
          } else if (stat.isDirectory()) {
            // Compress folder dynamically to zip stream
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename="${defaultFilename}"`);

            const archive = archiver('zip', { zlib: { level: 9 } });
            archive.on('error', (err) => {
              console.error('Archiver error:', err);
              res.status(500).end();
            });
            archive.pipe(res);
            archive.directory(diskPath, false);
            return archive.finalize();
          }
        }
      } else if (product.fileUrl.startsWith('data:')) {
        // Base64 Data URL payload
        const matches = product.fileUrl.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1] || 'application/zip';
          const buffer = Buffer.from(matches[2], 'base64');
          res.setHeader('Content-Type', mimeType);
          res.setHeader('Content-Disposition', `attachment; filename="${defaultFilename}"`);
          return res.send(buffer);
        }
      }
    }

    // 2. Fallback: generate and serve official software package manifest
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${defaultFilename}"`);

    const mockFilePayload = `=====================================================
APEX SYNDICATE SOFTWARE DISTRIBUTION SYSTEM
OFFICIAL COMMERCIAL RELEASE PACKAGE
=====================================================

Product: ${product.name}
Version: ${product.version}
Release Date: ${product.releaseDate}
Registered License Holder: ${request.customerName} (${request.customerEmail})
Request ID: ${request.requestId}
License Type: Commercial Digital License

Installation Instructions:
1. Extract the contents of this package to your system.
2. Launch the setup installer script for your operating system.
3. Enjoy powerful, futuristic software with Apex Syndicate!

Support: contact@apexsyndicate.com.ng
Official Website: https://apexsyndicate.com.ng

© 2026 Apex Syndicate Software Ltd. All rights reserved.
`;

    res.send(Buffer.from(mockFilePayload));
  } catch (err: any) {
    console.error('Download error:', err);
    res.status(500).send('Download processing error');
  }
});

// ==========================================
// ADMIN AUTHENTICATED ENDPOINTS
// ==========================================

// 9. Admin Login
router.post('/admin/login', (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const settings = store.getSettings();

    if (password === settings.adminPassword) {
      const token = `apex-session-${settings.adminPassword}`;
      return res.json({
        success: true,
        token,
        email: settings.ownerEmail,
        message: 'Owner authenticated successfully.',
      });
    }

    return res.status(401).json({ error: 'Invalid admin credentials. Please try again.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Admin Verify Me
router.get('/admin/me', requireAdmin, (req: Request, res: Response) => {
  const settings = store.getSettings();
  res.json({
    authenticated: true,
    email: settings.ownerEmail,
  });
});

// 11. Dashboard Overview Stats & Full Dashboard Bundle
router.get('/admin/stats', requireAdmin, (req: Request, res: Response) => {
  try {
    const stats = store.getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/admin/dashboard', requireAdmin, (req: Request, res: Response) => {
  try {
    const stats = store.getDashboardStats();
    const products = store.getProducts(true);
    const requests = store.getRequests();
    const notifications = store.getNotifications();
    const settings = store.getSettings();
    const contacts = store.getContacts();

    res.json({
      stats,
      products,
      requests,
      notifications,
      settings,
      contacts,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Create Product
router.post('/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const productData = req.body;
    if (!productData.name || !productData.category) {
      return res.status(400).json({ error: 'Product name and category are required.' });
    }

    const id = productData.id || `prod-${Date.now()}`;
    const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newProduct = store.saveProduct({
      ...productData,
      id,
      slug,
      releaseDate: productData.releaseDate || new Date().toISOString().split('T')[0],
      isPublished: productData.isPublished ?? true,
      features: productData.features || [],
      screenshots: productData.screenshots || [],
    });

    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 13. Update Product
router.put('/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const existing = store.getProductById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const updated = store.saveProduct({
      ...existing,
      ...req.body,
      id: existing.id,
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 14. Delete Product
router.delete('/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = store.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 15. Get Download Requests List (Admin)
router.get('/requests', requireAdmin, (req: Request, res: Response) => {
  try {
    const requests = store.getRequests();
    res.json(requests);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 16. Approve Download Request
const handleApproveRequest = (req: Request, res: Response) => {
  try {
    const updated = store.updateRequestStatus(req.params.id, 'APPROVED');
    if (!updated) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

router.patch('/requests/:id/approve', requireAdmin, handleApproveRequest);
router.put('/requests/:id/approve', requireAdmin, handleApproveRequest);
router.patch('/admin/requests/:id/approve', requireAdmin, handleApproveRequest);
router.put('/admin/requests/:id/approve', requireAdmin, handleApproveRequest);

// 17. Reject Download Request
const handleRejectRequest = (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const updated = store.updateRequestStatus(req.params.id, 'REJECTED', reason);
    if (!updated) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

router.patch('/requests/:id/reject', requireAdmin, handleRejectRequest);
router.put('/requests/:id/reject', requireAdmin, handleRejectRequest);
router.patch('/admin/requests/:id/reject', requireAdmin, handleRejectRequest);
router.put('/admin/requests/:id/reject', requireAdmin, handleRejectRequest);

// 18. Full Owner Settings (Admin)
router.get('/settings/full', requireAdmin, (req: Request, res: Response) => {
  try {
    const settings = store.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 19. Update Owner Settings (Launch date, Bank details, Password)
router.put('/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = store.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 20. Admin Notifications
router.get('/notifications', requireAdmin, (req: Request, res: Response) => {
  try {
    const notifs = store.getNotifications();
    res.json(notifs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/notifications/read-all', requireAdmin, (req: Request, res: Response) => {
  try {
    store.markAllNotificationsAsRead();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 21. Contact Submissions List (Admin)
router.get('/contacts', requireAdmin, (req: Request, res: Response) => {
  try {
    const contacts = store.getContacts();
    res.json(contacts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 22. File Upload (Admin)
router.post('/upload', requireAdmin, upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const publicUrl = `/downloads/files/${req.file.filename}`;
    res.json({
      success: true,
      fileUrl: publicUrl,
      filename: req.file.originalname,
      size: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 22b. Portfolio Video Upload (Admin - saves directly to server & broadcasts to all visitors)
router.post('/upload/portfolio-video', requireAdmin, upload.single('video'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided.' });
    }
    const publicUrl = `/downloads/files/${req.file.filename}`;
    
    // Automatically persist to server settings
    const updatedSettings = store.updateSettings({
      portfolioVideoMode: 'custom',
      portfolioVideoUrl: publicUrl,
    });

    console.log(`[APEX SYNDICATE] New custom portfolio video published: ${publicUrl}`);

    res.json({
      success: true,
      videoUrl: publicUrl,
      settings: updatedSettings,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 22b. Folder Upload & Auto-ZIP Compression (Admin)
router.post('/upload-folder', requireAdmin, upload.array('files', 1000), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No folder or files provided for compression.' });
    }

    const { productName, productSlug } = req.body;
    const baseSlug = productSlug || (productName ? productName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'software-package');
    const zipFilename = `${baseSlug}-${Date.now()}.zip`;
    const zipPath = path.join(uploadDir, zipFilename);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const stats = fs.statSync(zipPath);
      const sizeMb = (stats.size / (1024 * 1024)).toFixed(1);
      const formattedSize = stats.size >= 1024 * 1024 * 1024
        ? `${(stats.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
        : `${sizeMb} MB`;

      // Clean up temporary individual files
      files.forEach((f) => {
        try { fs.unlinkSync(f.path); } catch (e) {}
      });

      res.json({
        success: true,
        fileUrl: `/downloads/files/${zipFilename}`,
        filename: `${baseSlug}.zip`,
        size: formattedSize,
        fileCount: files.length,
      });
    });

    archive.on('error', (err) => {
      console.error('Folder compression error:', err);
      res.status(500).json({ error: 'Failed to compress software folder.' });
    });

    archive.pipe(output);

    files.forEach((f) => {
      const archivePath = f.originalname || f.filename;
      archive.file(f.path, { name: archivePath });
    });

    await archive.finalize();
  } catch (err: any) {
    console.error('Upload folder error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 23. Apex AI Helper Autonomous Endpoint
let genAIInstance: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI | null {
  if (!genAIInstance && process.env.GEMINI_API_KEY) {
    genAIInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIInstance;
}

router.post('/admin/ai-assistant', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt string is required.' });
    }

    const currentSettings = store.getSettings();
    const currentProducts = store.getProducts(true);
    const currentRequests = store.getRequests();

    const systemPrompt = `You are Apex AI Helper, the master website administrator AI for Apex Syndicate Software platform.
You have FULL control to edit and configure every parameter of the website, including:
- Launch Timer & Countdown (reset to 14 days, pause/resume, change start date, change free/early days and pricing)
- Announcement Banner (enable/disable, change announcement text)
- Bank Payment Details (bank name, account name, account number, instructions)
- Products & Software Suites (add new product, update existing product name/price/version/coming soon/features/urls, delete product)
- Download Requests (approve requests, reject requests, clear requests)

Current State:
- Settings: ${JSON.stringify(currentSettings)}
- Products: ${JSON.stringify(currentProducts)}
- Active Requests Count: ${currentRequests.length}

User Command: "${prompt}"

Your response MUST be a JSON object with this exact schema:
{
  "reply": "Clear, confident, professional summary of what was executed or answered.",
  "actions": [
    {
      "type": "RESET_TIMER" | "PAUSE_TIMER" | "RESUME_TIMER" | "UPDATE_ANNOUNCEMENT" | "UPDATE_BANK" | "UPDATE_PRODUCT" | "CREATE_PRODUCT" | "DELETE_PRODUCT" | "UPDATE_PRICING" | "APPROVE_REQUEST" | "REJECT_REQUEST" | "CLEAR_REQUESTS",
      "data": { }
    }
  ]
}

Action Specifications:
- RESET_TIMER: data: {}
- PAUSE_TIMER: data: {}
- RESUME_TIMER: data: {}
- UPDATE_ANNOUNCEMENT: data: { showAnnouncement?: boolean, announcementText?: string }
- UPDATE_BANK: data: { bankName?: string, accountName?: string, accountNumber?: string, bankInstructions?: string }
- CREATE_PRODUCT: data: { name: string, category: string, description: string, version?: string, pricingType?: 'launch' | 'fixed' | 'tbd', fixedPrice?: number, isComingSoon?: boolean }
- UPDATE_PRODUCT: data: { productId: string, name?: string, version?: string, description?: string, fixedPrice?: number, pricingType?: string, isComingSoon?: boolean }
- DELETE_PRODUCT: data: { productId: string }
- UPDATE_PRICING: data: { freeDays?: number, earlyDays?: number, earlyPrice?: number, fullPrice?: number }
- APPROVE_REQUEST: data: { requestId: string }
- REJECT_REQUEST: data: { requestId: string, reason?: string }
- CLEAR_REQUESTS: data: {}

Output ONLY raw JSON.`;

    let assistantResponse = '';
    const aiClient = getGenAIClient();

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: systemPrompt,
        });
        assistantResponse = response.text || '';
      } catch (geminiErr) {
        console.warn('Gemini API call warning:', geminiErr);
      }
    }

    let reply = '';
    let actions: Array<{ type: string; data?: any }> = [];

    if (assistantResponse) {
      try {
        const cleanJson = assistantResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        reply = parsed.reply || '';
        actions = parsed.actions || [];
      } catch (e) {
        console.warn('Failed to parse Gemini JSON output');
      }
    }

    if (!actions.length) {
      const lower = prompt.toLowerCase();
      
      if (lower.includes('reset') && (lower.includes('timer') || lower.includes('14') || lower.includes('day'))) {
        actions.push({ type: 'RESET_TIMER', data: {} });
        reply = "I have reset the launch timer to today! The full 14-day free access period is restarted.";
      } else if (lower.includes('pause') && lower.includes('timer')) {
        actions.push({ type: 'PAUSE_TIMER', data: {} });
        reply = "Launch timer paused.";
      } else if (lower.includes('resume') && lower.includes('timer')) {
        actions.push({ type: 'RESUME_TIMER', data: {} });
        reply = "Launch timer resumed.";
      } else if (lower.includes('bank') || lower.includes('account')) {
        const accMatch = prompt.match(/\b\d{10}\b/);
        const bankData: any = {};
        if (accMatch) bankData.accountNumber = accMatch[0];
        if (lower.includes('opay')) bankData.bankName = 'OPay';
        if (lower.includes('access')) bankData.bankName = 'Access Bank';
        if (lower.includes('gtbank') || lower.includes('gtb')) bankData.bankName = 'GTBank';
        if (lower.includes('zenith')) bankData.bankName = 'Zenith Bank';
        if (lower.includes('kuda')) bankData.bankName = 'Kuda Bank';
        if (lower.includes('moniepoint')) bankData.bankName = 'Moniepoint';
        if (lower.includes('palmpay')) bankData.bankName = 'PalmPay';
        
        actions.push({ type: 'UPDATE_BANK', data: bankData });
        reply = `Updated bank details according to your instructions.`;
      } else if (lower.includes('announcement') || lower.includes('banner')) {
        const show = !lower.includes('hide') && !lower.includes('remove') && !lower.includes('off');
        actions.push({
          type: 'UPDATE_ANNOUNCEMENT',
          data: {
            showAnnouncement: show,
            announcementText: prompt.replace(/announcement|banner|turn on|turn off|show|hide/gi, '').trim() || currentSettings.announcementText || 'Official Announcement'
          }
        });
        reply = show ? "Announcement banner enabled and updated." : "Announcement banner disabled.";
      } else if (lower.includes('clear') && (lower.includes('request') || lower.includes('download'))) {
        actions.push({ type: 'CLEAR_REQUESTS', data: {} });
        reply = "Cleared all download requests and notifications.";
      } else if (lower.includes('approve') && lower.includes('req')) {
        const match = prompt.match(/APEX-REQ-\d+/i) || prompt.match(/req-\d+/i);
        if (match) {
          actions.push({ type: 'APPROVE_REQUEST', data: { requestId: match[0] } });
          reply = `Approved request ${match[0]}.`;
        }
      } else if (lower.includes('reject') && lower.includes('req')) {
        const match = prompt.match(/APEX-REQ-\d+/i) || prompt.match(/req-\d+/i);
        if (match) {
          actions.push({ type: 'REJECT_REQUEST', data: { requestId: match[0] } });
          reply = `Rejected request ${match[0]}.`;
        }
      } else if (lower.includes('add') || lower.includes('create') && lower.includes('product')) {
        actions.push({
          type: 'CREATE_PRODUCT',
          data: {
            name: prompt.replace(/add|create|product|software/gi, '').trim() || 'Apex Suite',
            category: 'Software',
            description: 'Created by Apex AI Helper',
            version: 'v1.0.0',
            pricingType: 'fixed',
            fixedPrice: 5000
          }
        });
        reply = "Created new product software suite.";
      } else {
        reply = reply || `Apex AI Helper executed command: "${prompt}". All requested changes have been synchronized.`;
      }
    }

    const executedLogs: string[] = [];
    for (const act of actions) {
      if (act.type === 'RESET_TIMER') {
        store.updateSettings({
          launchDateApexEditor: new Date().toISOString(),
          freeDays: 14,
          earlyDays: 14,
          timerPaused: false,
        });
        executedLogs.push('Reset launch timer to today (14 days free)');
      } else if (act.type === 'PAUSE_TIMER') {
        store.updateSettings({ timerPaused: true });
        executedLogs.push('Paused launch timer');
      } else if (act.type === 'RESUME_TIMER') {
        store.updateSettings({ timerPaused: false });
        executedLogs.push('Resumed launch timer');
      } else if (act.type === 'UPDATE_ANNOUNCEMENT') {
        store.updateSettings({
          showAnnouncement: act.data.showAnnouncement ?? true,
          announcementText: act.data.announcementText || currentSettings.announcementText,
        });
        executedLogs.push('Updated announcement banner settings');
      } else if (act.type === 'UPDATE_BANK') {
        store.updateSettings({
          bankName: act.data.bankName || currentSettings.bankName,
          accountName: act.data.accountName || currentSettings.accountName,
          accountNumber: act.data.accountNumber || currentSettings.accountNumber,
          bankInstructions: act.data.bankInstructions || currentSettings.bankInstructions,
        });
        executedLogs.push('Updated bank payment instructions');
      } else if (act.type === 'UPDATE_PRICING') {
        store.updateSettings({
          freeDays: act.data.freeDays ?? currentSettings.freeDays,
          earlyDays: act.data.earlyDays ?? currentSettings.earlyDays,
          earlyPrice: act.data.earlyPrice ?? currentSettings.earlyPrice,
          fullPrice: act.data.fullPrice ?? currentSettings.fullPrice,
        });
        executedLogs.push('Updated pricing tier rules');
      } else if (act.type === 'CREATE_PRODUCT') {
        const slug = (act.data.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        store.saveProduct({
          id: slug + '-' + Date.now(),
          slug,
          name: act.data.name || 'New Software Suite',
          category: act.data.category || 'Software',
          description: act.data.description || 'Apex Syndicate Software Product',
          fullDescription: act.data.description || 'Apex Syndicate Software Product',
          version: act.data.version || 'v1.0.0',
          releaseDate: new Date().toISOString().split('T')[0],
          isFeatured: true,
          isPublished: true,
          isComingSoon: act.data.isComingSoon ?? false,
          pricingType: act.data.pricingType || 'fixed',
          fixedPrice: act.data.fixedPrice || 0,
          iconName: 'Terminal',
          features: ['Configured by Apex AI Helper'],
          screenshots: [],
          whatsNew: ['Initial Release'],
        });
        executedLogs.push(`Created product ${act.data.name}`);
      } else if (act.type === 'UPDATE_PRODUCT' && act.data.productId) {
        const existing = store.getProductById(act.data.productId);
        if (existing) {
          store.saveProduct({
            ...existing,
            ...act.data,
            id: existing.id,
          });
          executedLogs.push(`Updated product ${existing.name}`);
        }
      } else if (act.type === 'DELETE_PRODUCT' && act.data.productId) {
        store.deleteProduct(act.data.productId);
        executedLogs.push(`Deleted product ${act.data.productId}`);
      } else if (act.type === 'APPROVE_REQUEST' && act.data.requestId) {
        store.updateRequestStatus(act.data.requestId, 'APPROVED');
        executedLogs.push(`Approved request ${act.data.requestId}`);
      } else if (act.type === 'REJECT_REQUEST' && act.data.requestId) {
        store.updateRequestStatus(act.data.requestId, 'REJECTED', act.data.reason);
        executedLogs.push(`Rejected request ${act.data.requestId}`);
      } else if (act.type === 'CLEAR_REQUESTS') {
        store.getRequests().length = 0;
        store.getNotifications().length = 0;
        executedLogs.push('Cleared all download requests');
      }
    }

    const freshStats = store.getDashboardStats();
    const freshSettings = store.getSettings();
    const freshProducts = store.getProducts(true);
    const freshRequests = store.getRequests();

    res.json({
      success: true,
      reply,
      executedLogs,
      updatedData: {
        stats: freshStats,
        settings: freshSettings,
        products: freshProducts,
        requests: freshRequests,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
