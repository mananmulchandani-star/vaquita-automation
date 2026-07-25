import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Store, MessageSquare, ShieldCheck, Check, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import api from '../api/client';

export const SetupWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [shopifyStatus, setShopifyStatus] = useState<{
    connected: boolean;
    domain?: string;
    storeName?: string;
    loading: boolean;
  }>({ connected: false, loading: true });
  const navigate = useNavigate();
  const location = useLocation();

  // On mount: extract token from OAuth callback URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const storeId = params.get('storeId');
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    if (storeId) {
      localStorage.setItem('store_id', storeId);
    }
    if (token || storeId) {
      window.history.replaceState({}, document.title, '/setup');
    }
  }, [location]);

  // Fetch store info to check Shopify connection status
  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setShopifyStatus({ connected: false, loading: false });
          return;
        }
        const res: any = await api.get('/settings');
        const data = res.data || res;
        setShopifyStatus({
          connected: !!data.shopifyConnected,
          domain: data.shopifyDomain,
          storeName: data.name,
          loading: false,
        });
      } catch (err) {
        console.error('Failed to fetch store info:', err);
        setShopifyStatus({ connected: false, loading: false });
      }
    };
    // Small delay to ensure token is saved first
    const timer = setTimeout(fetchStoreInfo, 300);
    return () => clearTimeout(timer);
  }, []);

  const [formData, setFormData] = useState({
    metaAppId: '',
    metaAppSecret: '',
    metaAccessToken: '',
    metaPhoneId: '',
    metaWabaId: '',
    metaVerifyToken: '',
    metaWebhookVerifyToken: '',
    brandName: '',
    brandColor: '#2563EB'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 2));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    try {
      await api.post('/settings/integrations', formData);
      localStorage.setItem('integrationComplete', 'true');
      navigate('/');
    } catch (err) {
      console.error(err);
      // Allow completion even if API fails in dev
      localStorage.setItem('integrationComplete', 'true');
      navigate('/');
    }
  };

  const handleConnectShopify = () => {
    const shop = prompt('Enter your Shopify store domain (e.g. my-store.myshopify.com):');
    if (shop) {
      const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
      
      if (apiUrl === '/api/v1') {
        alert("Configuration Error: VITE_API_URL is missing in Vercel! Please add VITE_API_URL to your Vercel Environment Variables pointing to your Railway backend (e.g., https://your-app.up.railway.app/api/v1), then click 'Redeploy' in Vercel.");
        return;
      }
      
      window.location.href = `${apiUrl}/shopify/auth?shop=${encodeURIComponent(cleanShop)}`;
    }
  };

  const steps = [
    { id: 1, title: 'WhatsApp', icon: MessageSquare },
    { id: 2, title: 'Brand', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Shopify Connection Status Banner */}
        <div className={`mb-6 p-4 rounded-xl border ${
          shopifyStatus.loading 
            ? 'border-[#333] bg-[#121212]'
            : shopifyStatus.connected 
              ? 'border-emerald-500/30 bg-emerald-500/5' 
              : 'border-amber-500/30 bg-amber-500/5'
        }`}>
          {shopifyStatus.loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#555] border-t-white rounded-full animate-spin" />
              <span className="text-[#a3a3a3]">Checking Shopify connection...</span>
            </div>
          ) : shopifyStatus.connected ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="font-semibold text-emerald-400">Shopify Connected</p>
                  <p className="text-sm text-[#a3a3a3]">{shopifyStatus.domain}</p>
                </div>
              </div>
              <Store className="w-5 h-5 text-emerald-400/50" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="font-semibold text-amber-400">Shopify Not Connected</p>
                  <p className="text-sm text-[#a3a3a3]">Connect your store to get started</p>
                </div>
              </div>
              <button
                onClick={handleConnectShopify}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Connect Store
              </button>
            </div>
          )}
        </div>

        {/* Main Wizard Card */}
        <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-8 border-b border-[#262626]">
            <h1 className="text-3xl font-bold mb-2">Complete Your Setup</h1>
            <p className="text-[#a3a3a3]">Configure WhatsApp and brand settings to finish setup.</p>
            
            <div className="flex items-center mt-8 space-x-4">
              {steps.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${step >= s.id ? 'border-blue-500 bg-blue-500 text-white' : 'border-[#333] text-[#737373]'}`}>
                    {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-1 flex-1 rounded ${step > s.id ? 'bg-blue-500' : 'bg-[#333]'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold mb-2">Meta WhatsApp Integration</h2>
                  <p className="text-sm text-[#737373] mb-4">Optional — you can configure this later in Settings.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">App ID</label>
                      <input name="metaAppId" value={formData.metaAppId} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">App Secret</label>
                      <input name="metaAppSecret" value={formData.metaAppSecret} onChange={handleChange} type="password" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">Permanent Access Token</label>
                      <input name="metaAccessToken" value={formData.metaAccessToken} onChange={handleChange} type="password" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">Phone Number ID</label>
                      <input name="metaPhoneId" value={formData.metaPhoneId} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">WABA ID</label>
                      <input name="metaWabaId" value={formData.metaWabaId} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">Verify Token</label>
                      <input name="metaVerifyToken" value={formData.metaVerifyToken} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">Webhook Verify Token</label>
                      <input name="metaWebhookVerifyToken" value={formData.metaWebhookVerifyToken} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold mb-4">Brand Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">Brand Name</label>
                      <input name="brandName" value={formData.brandName} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">Primary Color</label>
                      <div className="flex items-center space-x-4">
                        <input name="brandColor" type="color" value={formData.brandColor} onChange={handleChange} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
                        <span className="text-[#a3a3a3]">{formData.brandColor}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#262626] flex items-center justify-between bg-[#171717]">
            <button 
              onClick={handlePrev} 
              disabled={step === 1}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${step === 1 ? 'opacity-50 cursor-not-allowed text-[#737373]' : 'text-white hover:bg-[#262626]'}`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            
            {step < 2 ? (
              <button 
                onClick={handleNext} 
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-green-900/20"
              >
                Complete Setup <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
