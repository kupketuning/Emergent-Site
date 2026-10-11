import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock, LogOut, Plus, Pencil, Trash2, X, Save, ArrowLeft, Package, Inbox, Mail, ShoppingBag,
  AlertTriangle, Upload, Loader2, LayoutDashboard, Users, Euro, ShoppingCart, UserPlus, Ban, CheckCircle2,
  MessageCircle, Phone, RotateCcw,
} from 'lucide-react';
import api, { API } from '../api';
import { VEHICLE_OPTIONS, TYPE_OPTIONS, ASSEMBLY_OPTIONS, MODEL_OPTIONS, SPECIAL_CATEGORY_OPTIONS, formatEuro } from '../mock';
import Logo from '../components/Logo';

const emptyForm = {
  name: '', description: '', vehicle: 'TRABANT', vehicle_model: '', product_type: 'TUNING', assembly_group: 'MOTOR',
  special_category: '', is_set: false, price_net: '', tax_rate: '19', stock_quantity: '0', stock_min_alert: '5',
  weight_grams: '0', sort_order: '100', is_active: true, dekra_certified: false, youtube_url: '', images: [],
};

const emptyStaffForm = { email: '', password: '', name: '', role: 'bearbeiter' };
const emptyPhoneOrder = { email: '', first_name: '', last_name: '', street: '', zip: '', city: '', country: 'DE', shipping_method: 'HERMES' };
const emptyCustomItem = { name: '', price_net: '', shipping_override: '', lead_time_text: '' };

const ORDER_STATUS_OPTIONS = [
  { value: 'NEU', label: 'Neu' },
  { value: 'BEZAHLT', label: 'Bezahlt' },
  { value: 'IN_BEARBEITUNG', label: 'In Bearbeitung' },
  { value: 'VERSENDET', label: 'Versendet' },
  { value: 'ABGEHOLT', label: 'Abgeholt' },
  { value: 'WIDERRUF_ANGEFORDERT', label: 'Widerruf angefordert' },
  { value: 'STORNIERT', label: 'Storniert' },
];
const SUPPORT_CATEGORY_LABEL = { RUECKFRAGE: 'Rückfrage', TERMINANFRAGE: 'Terminanfrage', REKLAMATION: 'Reklamation', SONSTIGES: 'Sonstiges' };

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
    {children}
  </div>
);

const label = (opts, v) => (opts.find((o) => o.value === v) || {}).label || v;

const Admin = () => {
  const [staffUser, setStaffUser] = useState(null); // null=checking, false=anon, obj=angemeldet
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErr, setLoginErr] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [resetToken] = useState(() => new URLSearchParams(window.location.search).get('token') || '');
  const [resetPw, setResetPw] = useState({ password: '', confirm: '' });
  const [resetErr, setResetErr] = useState('');
  const [resetDone, setResetDone] = useState(false);
  const [tab, setTab] = useState('uebersicht');

  const [products, setProducts] = useState([]);
  const [loadingP, setLoadingP] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [overview, setOverview] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [staffForm, setStaffForm] = useState(emptyStaffForm);
  const [staffMsg, setStaffMsg] = useState('');
  const [staffSaving, setStaffSaving] = useState(false);

  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [skuPreview, setSkuPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [labelUploadingId, setLabelUploadingId] = useState(null);
  const [returnLabelUploadingId, setReturnLabelUploadingId] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const now = new Date();
  const [exportYear, setExportYear] = useState(now.getFullYear());
  const [exportMonth, setExportMonth] = useState(now.getMonth() + 1);
  const [exporting, setExporting] = useState(false);

  const [supportRequests, setSupportRequests] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyingId, setReplyingId] = useState(null);

  const [phoneOrderOpen, setPhoneOrderOpen] = useState(false);
  const [phoneOrderForm, setPhoneOrderForm] = useState(emptyPhoneOrder);
  const [phoneOrderLines, setPhoneOrderLines] = useState([]);
  const [phoneOrderProductId, setPhoneOrderProductId] = useState('');
  const [phoneOrderSaving, setPhoneOrderSaving] = useState(false);
  const [phoneOrderMsg, setPhoneOrderMsg] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customItem, setCustomItem] = useState(emptyCustomItem);
  const [showCustomItem, setShowCustomItem] = useState(false);

  const isAdmin = staffUser && staffUser.role === 'admin';

  useEffect(() => {
    (async () => {
      try { setStaffUser(await api.staffMe()); } catch { setStaffUser(false); }
    })();
  }, []);

  const loadProducts = useCallback(async () => {
    setLoadingP(true);
    try { setProducts(await api.adminGetProducts()); } catch { /* ignore */ }
    finally { setLoadingP(false); }
  }, []);
  const loadInquiries = useCallback(async () => {
    try { setInquiries(await api.getInquiries()); } catch { /* ignore */ }
  }, []);
  const loadOrders = useCallback(async () => {
    try { setOrders(await api.getOrders()); } catch { /* ignore */ }
  }, []);
  const loadOverview = useCallback(async () => {
    try { setOverview(await api.getAdminOverview()); } catch { /* ignore */ }
  }, []);
  const loadStaffUsers = useCallback(async () => {
    try { setStaffList(await api.listStaffUsers()); } catch { /* ignore */ }
  }, []);
  const loadSupportRequests = useCallback(async () => {
    try { setSupportRequests(await api.listSupportRequests()); } catch { /* ignore */ }
  }, []);
  const loadCustomers = useCallback(async () => {
    try { setCustomers(await api.listCustomers()); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (staffUser) { loadProducts(); loadInquiries(); loadOrders(); loadOverview(); loadSupportRequests(); loadCustomers(); if (isAdmin) loadStaffUsers(); }
  }, [staffUser, isAdmin, loadProducts, loadInquiries, loadOrders, loadOverview, loadStaffUsers, loadSupportRequests, loadCustomers]);

  // Auto-SKU preview when creating
  useEffect(() => {
    if (!form || editingId) { setSkuPreview(''); return; }
    let active = true;
    (async () => {
      try {
        const params = form.special_category
          ? { special_category: form.special_category }
          : { vehicle: form.vehicle, product_type: form.product_type, assembly_group: form.assembly_group, is_set: form.is_set };
        const res = await api.nextSku(params);
        if (active) setSkuPreview(res.sku);
      } catch { if (active) setSkuPreview(''); }
    })();
    return () => { active = false; };
  }, [form?.vehicle, form?.product_type, form?.assembly_group, form?.is_set, form?.special_category, editingId, form]);

  const login = async (e) => {
    e.preventDefault();
    setLoginErr(''); setLoginLoading(true);
    try { setStaffUser(await api.staffLogin(loginForm.email, loginForm.password)); }
    catch (err) { setLoginErr(err?.response?.data?.detail || 'Anmeldung fehlgeschlagen.'); }
    finally { setLoginLoading(false); }
  };
  const logout = async () => {
    try { await api.staffLogout(); } finally { setStaffUser(false); setTab('uebersicht'); }
  };
  const submitForgot = async (e) => {
    e.preventDefault();
    try { await api.forgotPassword(loginForm.email, `${window.location.origin}/admin`); } finally { setForgotSent(true); }
  };
  const submitReset = async (e) => {
    e.preventDefault();
    setResetErr('');
    if (resetPw.password !== resetPw.confirm) { setResetErr('Die Passwörter stimmen nicht überein.'); return; }
    if (resetPw.password.length < 8) { setResetErr('Das Passwort muss mindestens 8 Zeichen lang sein.'); return; }
    try {
      await api.resetPassword(resetToken, resetPw.password);
      setResetDone(true);
    } catch (err) {
      setResetErr(err?.response?.data?.detail || 'Der Link ist ungültig oder abgelaufen.');
    }
  };

  const openCreate = () => { setForm({ ...emptyForm, images: [] }); setEditingId(null); };
  const openEdit = (p) => {
    setForm({
      name: p.name || '', description: p.description || '', vehicle: p.vehicle || 'TRABANT',
      vehicle_model: p.vehicle_model || '', product_type: p.product_type || 'TUNING', assembly_group: p.assembly_group || 'MOTOR',
      special_category: p.special_category || '',
      is_set: !!p.is_set, price_net: p.price_net == null ? '' : String(p.price_net),
      tax_rate: p.tax_rate == null ? '19' : String(p.tax_rate), stock_quantity: String(p.stock_quantity ?? 0),
      stock_min_alert: String(p.stock_min_alert ?? 5), weight_grams: String(p.weight_grams ?? 0),
      sort_order: String(p.sort_order ?? 100), is_active: !!p.is_active, dekra_certified: !!p.dekra_certified,
      youtube_url: p.youtube_url || '', images: p.images || [], sku: p.sku,
    });
    setEditingId(p.id);
  };
  const closeForm = () => { setForm(null); setEditingId(null); setSkuPreview(''); };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const res = await api.uploadImages(files);
      setForm((f) => ({ ...f, images: [...(f.images || []), ...res.urls] }));
    } catch { setMsg('Bild-Upload fehlgeschlagen.'); }
    finally { setUploading(false); e.target.value = ''; }
  };
  const removeImage = (idx) => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    const isSpecial = !!form.special_category;
    const payload = {
      name: form.name, description: form.description,
      vehicle: isSpecial ? null : form.vehicle,
      vehicle_model: (!isSpecial && form.vehicle === 'TRABANT' && form.vehicle_model) ? form.vehicle_model : null,
      product_type: isSpecial ? null : form.product_type,
      assembly_group: isSpecial ? null : form.assembly_group,
      special_category: form.special_category || null,
      is_set: form.is_set,
      price_net: form.price_net === '' ? 0 : form.price_net, tax_rate: form.tax_rate === '' ? 19 : form.tax_rate,
      stock_quantity: form.stock_quantity, stock_min_alert: form.stock_min_alert,
      weight_grams: form.weight_grams, sort_order: form.sort_order, is_active: form.is_active,
      dekra_certified: form.dekra_certified, youtube_url: form.youtube_url, images: form.images,
    };
    try {
      if (editingId) await api.updateSbProduct(editingId, payload);
      else await api.createSbProduct(payload);
      await loadProducts();
      setMsg(editingId ? 'Produkt aktualisiert.' : 'Produkt angelegt.');
      closeForm();
    } catch (err) { setMsg(err?.response?.data?.detail || 'Fehler beim Speichern.'); }
    finally { setSaving(false); }
  };

  const remove = async (p) => {
    if (!window.confirm(`"${p.name}" wirklich löschen?`)) return;
    try { await api.deleteSbProduct(p.id); await loadProducts(); setMsg('Produkt gelöscht.'); }
    catch { setMsg('Fehler beim Löschen.'); }
  };
  const removeInquiry = async (id) => {
    if (!window.confirm('Anfrage wirklich löschen?')) return;
    try { await api.deleteInquiry(id); await loadInquiries(); } catch { /* ignore */ }
  };

  const uploadLabel = async (order, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLabelUploadingId(order.id);
    try {
      await api.uploadShippingLabel(order.id, file);
      await loadOrders();
      setMsg(`Versandlabel für ${order.order_number} hochgeladen – Kunde & Lager wurden benachrichtigt.`);
    } catch {
      setMsg('Upload des Versandlabels fehlgeschlagen.');
    } finally {
      setLabelUploadingId(null);
      e.target.value = '';
    }
  };

  const uploadReturnLabel = async (order, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReturnLabelUploadingId(order.id);
    try {
      await api.uploadReturnLabel(order.id, file);
      await loadOrders();
      setMsg(`Rücksendelabel für ${order.order_number} hochgeladen – Kunde wurde benachrichtigt.`);
    } catch {
      setMsg('Upload des Rücksendelabels fehlgeschlagen.');
    } finally {
      setReturnLabelUploadingId(null);
      e.target.value = '';
    }
  };

  const changeOrderStatus = async (order, status) => {
    setStatusUpdatingId(order.id);
    try { await api.updateOrderStatus(order.id, status); await loadOrders(); }
    catch { setMsg('Status konnte nicht geändert werden.'); }
    finally { setStatusUpdatingId(null); }
  };

  const submitReply = async (req) => {
    const reply = (replyDrafts[req.id] || '').trim();
    if (!reply) return;
    setReplyingId(req.id);
    try {
      await api.replySupportRequest(req.id, reply);
      setReplyDrafts((d) => ({ ...d, [req.id]: '' }));
      await loadSupportRequests();
    } catch {
      setMsg('Antwort konnte nicht gesendet werden.');
    } finally {
      setReplyingId(null);
    }
  };

  const exportInvoices = async () => {
    setExporting(true); setMsg('');
    try {
      const blob = await api.exportInvoicesZip(exportYear, exportMonth);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rechnungen_${exportYear}-${String(exportMonth).padStart(2, '0')}.zip`;
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setMsg('Keine Rechnungen für diesen Zeitraum gefunden oder Export fehlgeschlagen.');
    } finally {
      setExporting(false);
    }
  };

  const createStaff = async (e) => {
    e.preventDefault();
    setStaffSaving(true); setStaffMsg('');
    try {
      await api.createStaffUser(staffForm);
      setStaffForm(emptyStaffForm);
      await loadStaffUsers();
      setStaffMsg(`Konto für ${staffForm.email} wurde angelegt.`);
    } catch (err) {
      setStaffMsg(err?.response?.data?.detail || 'Fehler beim Anlegen des Kontos.');
    } finally {
      setStaffSaving(false);
    }
  };
  const toggleStaffActive = async (u) => {
    try { await api.setStaffUserActive(u.id, !u.is_active); await loadStaffUsers(); }
    catch (err) { setStaffMsg(err?.response?.data?.detail || 'Aktion fehlgeschlagen.'); }
  };

  const openPhoneOrder = () => {
    setPhoneOrderForm(emptyPhoneOrder); setPhoneOrderLines([]); setPhoneOrderMsg('');
    setSelectedCustomerId(''); setCustomItem(emptyCustomItem); setShowCustomItem(false);
    setPhoneOrderOpen(true);
  };
  const closePhoneOrder = () => setPhoneOrderOpen(false);
  const selectExistingCustomer = (id) => {
    setSelectedCustomerId(id);
    const c = customers.find((x) => x.id === id);
    if (!c) return;
    setPhoneOrderForm((f) => ({ ...f, email: c.email, first_name: c.first_name || '', last_name: c.last_name || '',
      street: c.street || '', zip: c.zip || '', city: c.city || '', country: c.country || 'DE' }));
  };
  const addPhoneOrderLine = () => {
    if (!phoneOrderProductId) return;
    const p = products.find((x) => x.id === phoneOrderProductId);
    if (!p || phoneOrderLines.some((l) => l.product_id === p.id)) return;
    setPhoneOrderLines((lines) => [...lines, { product_id: p.id, name: p.name, price_gross: p.price_gross, quantity: 1 }]);
    setPhoneOrderProductId('');
  };
  const setLineQty = (productId, qty) => setPhoneOrderLines((lines) => lines.map((l) => (l.product_id === productId ? { ...l, quantity: Math.max(1, Number(qty) || 1) } : l)));
  const removeLine = (productId) => setPhoneOrderLines((lines) => lines.filter((l) => l.product_id !== productId));
  const hasCustomItem = showCustomItem && customItem.name.trim() && customItem.price_net !== '';
  const customItemGross = hasCustomItem ? Number(customItem.price_net) * 1.19 : 0;
  const phoneOrderTotal = phoneOrderLines.reduce((sum, l) => sum + (l.price_gross || 0) * l.quantity, 0) + customItemGross;

  const submitPhoneOrder = async (e) => {
    e.preventDefault();
    if (phoneOrderLines.length === 0 && !hasCustomItem) { setPhoneOrderMsg('Bitte mindestens ein Produkt oder ein individuelles Produkt hinzufügen.'); return; }
    setPhoneOrderSaving(true); setPhoneOrderMsg('');
    try {
      const res = await api.createPhoneOrder({
        customer: { email: phoneOrderForm.email, first_name: phoneOrderForm.first_name, last_name: phoneOrderForm.last_name,
                   street: phoneOrderForm.street, zip: phoneOrderForm.zip, city: phoneOrderForm.city, country: phoneOrderForm.country },
        items: phoneOrderLines.map((l) => ({ product_id: l.product_id, quantity: l.quantity })),
        custom_item: hasCustomItem ? {
          name: customItem.name, price_net: Number(customItem.price_net),
          shipping_cost_gross_override: customItem.shipping_override !== '' ? Number(customItem.shipping_override) : null,
          lead_time_text: customItem.lead_time_text,
        } : null,
        shipping_method: phoneOrderForm.shipping_method,
        origin_url: window.location.origin,
      });
      setPhoneOrderMsg(`Bestellung ${res.preview_number} angelegt – Bestätigungs-/Bezahl-E-Mail wurde an ${phoneOrderForm.email} gesendet.`);
      setPhoneOrderLines([]);
      setCustomItem(emptyCustomItem); setShowCustomItem(false);
    } catch (err) {
      setPhoneOrderMsg(err?.response?.data?.detail || 'Telefonbestellung konnte nicht angelegt werden.');
    } finally {
      setPhoneOrderSaving(false);
    }
  };

  useEffect(() => {
    if (!phoneOrderOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closePhoneOrder(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phoneOrderOpen]);

  const lowStockProducts = products.filter((p) => (p.stock_min_alert ?? 0) > 0 && (p.stock_quantity ?? 0) <= p.stock_min_alert);

  if (resetToken) {
    return (
      <div className="min-h-screen bg-[#17191d] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-lg bg-[#E63946] flex items-center justify-center text-white"><Lock className="w-5 h-5" /></span>
            <div><h1 className="font-logo text-xl font-bold uppercase">Neues Passwort</h1><p className="text-xs text-gray-500">Kupke-Tuning Verwaltung</p></div>
          </div>
          {resetDone ? (
            <div data-testid="admin-reset-success">
              <p className="text-sm text-gray-600 mb-4">Passwort erfolgreich geändert.</p>
              <a href="/admin" className="text-sm text-[#E63946] font-semibold hover:underline">Jetzt anmelden</a>
            </div>
          ) : (
            <form onSubmit={submitReset}>
              <label className="block text-sm font-semibold mb-1">Neues Passwort</label>
              <input type="password" required minLength={8} value={resetPw.password} onChange={(e) => setResetPw((f) => ({ ...f, password: e.target.value }))} className="inp mb-3" data-testid="admin-reset-password" />
              <label className="block text-sm font-semibold mb-1">Passwort bestätigen</label>
              <input type="password" required minLength={8} value={resetPw.confirm} onChange={(e) => setResetPw((f) => ({ ...f, confirm: e.target.value }))} className="inp" data-testid="admin-reset-confirm" />
              {resetErr && <p className="text-[#E63946] text-sm mt-2" data-testid="admin-reset-error">{resetErr}</p>}
              <button type="submit" className="w-full mt-5 h-11 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md" data-testid="admin-reset-submit">Passwort speichern</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (staffUser === null) {
    return <div className="min-h-screen bg-[#17191d] flex items-center justify-center text-white/60"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  if (!staffUser) {
    return (
      <div className="min-h-screen bg-[#17191d] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-lg bg-[#E63946] flex items-center justify-center text-white"><Lock className="w-5 h-5" /></span>
            <div>
              <h1 className="font-logo text-xl font-bold uppercase">{forgotMode ? 'Passwort vergessen' : 'Mitarbeiter-Login'}</h1>
              <p className="text-xs text-gray-500">Kupke-Tuning Verwaltung</p>
            </div>
          </div>

          {forgotMode ? (
            forgotSent ? (
              <div data-testid="admin-forgot-sent">
                <p className="text-sm text-gray-600 mb-4">Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir einen Link zum Zurücksetzen versendet.</p>
                <button onClick={() => { setForgotMode(false); setForgotSent(false); }} className="text-sm text-[#E63946] font-semibold hover:underline">← Zurück zum Login</button>
              </div>
            ) : (
              <form onSubmit={submitForgot}>
                <label className="block text-sm font-semibold mb-1">E-Mail</label>
                <input type="email" required value={loginForm.email} onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))} className="inp" data-testid="admin-forgot-email" />
                <button type="submit" className="w-full mt-5 h-11 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md transition-colors" data-testid="admin-forgot-submit">Link anfordern</button>
                <button type="button" onClick={() => setForgotMode(false)} className="block w-full text-center mt-4 text-sm text-gray-500 hover:text-[#E63946]">← Zurück zum Login</button>
              </form>
            )
          ) : (
            <form onSubmit={login}>
              <label className="block text-sm font-semibold mb-1">E-Mail</label>
              <input type="email" required value={loginForm.email} onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))} className="inp mb-3" data-testid="admin-email" />
              <label className="block text-sm font-semibold mb-1">Passwort</label>
              <input type="password" required value={loginForm.password} onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))} className="inp" placeholder="••••••••" data-testid="admin-password" />
              {loginErr && <p className="text-[#E63946] text-sm mt-2" data-testid="admin-login-error">{loginErr}</p>}
              <button type="submit" disabled={loginLoading} className="w-full mt-5 h-11 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md transition-colors disabled:opacity-60" data-testid="admin-login-btn">
                {loginLoading ? 'Einen Moment ...' : 'Anmelden'}
              </button>
              <button type="button" onClick={() => setForgotMode(true)} className="block w-full text-center mt-4 text-sm text-gray-500 hover:text-[#E63946]" data-testid="admin-forgot-link">Passwort vergessen?</button>
              <Link to="/" className="block text-center mt-2 text-sm text-gray-500 hover:text-[#E63946]">← Zurück zum Shop</Link>
            </form>
          )}
        </div>
      </div>
    );
  }

  const TabBtn = ({ id, icon: Icon, children, count }) => (
    <button onClick={() => setTab(id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 ${tab === id ? 'border-[#E63946] text-white' : 'border-transparent text-gray-400 hover:text-white'}`} data-testid={`admin-tab-${id}`}>
      <Icon className="w-4 h-4" /> {children} {count > 0 && <span className="bg-[#E63946] text-white text-[11px] rounded-full px-1.5">{count}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#17191d] text-white">
        <div className="max-w-[1300px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="light" size={32} showSlogan={false} to="/admin" />
            <span className="text-[#E63946] font-logo font-bold uppercase text-lg">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400" data-testid="admin-current-user">{staffUser.name || staffUser.email} · <span className="uppercase text-xs font-semibold text-gray-300">{staffUser.role}</span></span>
            <Link to="/" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"><ArrowLeft className="w-4 h-4" /> Shop</Link>
            <button onClick={logout} className="flex items-center gap-1 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md" data-testid="admin-logout"><LogOut className="w-4 h-4" /> Abmelden</button>
          </div>
        </div>
        <div className="max-w-[1300px] mx-auto px-4 flex gap-1">
          <TabBtn id="uebersicht" icon={LayoutDashboard}>Übersicht</TabBtn>
          <TabBtn id="produkte" icon={Package}>Produkte</TabBtn>
          <TabBtn id="bestellungen" icon={ShoppingBag} count={orders.length}>Bestellungen</TabBtn>
          <TabBtn id="anfragen" icon={Inbox} count={inquiries.length}>Anfragen</TabBtn>
          <TabBtn id="support" icon={MessageCircle} count={supportRequests.filter((r) => r.status === 'OFFEN').length}>Support</TabBtn>
          {isAdmin && <TabBtn id="benutzer" icon={Users} count={staffList.length}>Benutzer</TabBtn>}
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 py-8">
        {msg && <div className="mb-4 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-2 rounded-md" data-testid="admin-msg">{msg}</div>}

        {tab === 'uebersicht' && (
          <>
            <h1 className="font-logo text-3xl font-bold uppercase mb-6">Übersicht</h1>
            {!overview ? (
              <div className="flex items-center gap-2 text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /> Kennzahlen werden geladen ...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="admin-overview-tiles">
                <div className="bg-white border border-gray-200 rounded-lg p-5" data-testid="overview-orders">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase mb-2"><ShoppingCart className="w-4 h-4" /> Bestellungen (Monat)</div>
                  <p className="text-3xl font-bold text-[#17191d]">{overview.orders_this_month}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5" data-testid="overview-revenue">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase mb-2"><Euro className="w-4 h-4" /> Umsatz (Monat)</div>
                  <p className="text-3xl font-bold text-[#17191d]">{formatEuro(overview.revenue_this_month)}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5" data-testid="overview-inquiries">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase mb-2"><Inbox className="w-4 h-4" /> Offene Anfragen</div>
                  <p className="text-3xl font-bold text-[#17191d]">{overview.open_inquiries}</p>
                </div>
                <div className={`bg-white border rounded-lg p-5 ${overview.low_stock_count > 0 ? 'border-[#f3c6c6]' : 'border-gray-200'}`} data-testid="overview-low-stock">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase mb-2"><AlertTriangle className="w-4 h-4" /> Niedriger Bestand</div>
                  <p className={`text-3xl font-bold ${overview.low_stock_count > 0 ? 'text-[#E63946]' : 'text-[#17191d]'}`}>{overview.low_stock_count}</p>
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'produkte' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-logo text-3xl font-bold uppercase">Produkte verwalten</h1>
                <p className="text-gray-500 text-sm">{products.length} Produkte {loadingP && '(lädt ...)'}</p>
              </div>
              <button onClick={openCreate} className="flex items-center gap-2 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold px-4 py-2.5 rounded-md transition-colors" data-testid="admin-new-product"><Plus className="w-5 h-5" /> Neues Produkt</button>
            </div>
            {lowStockProducts.length > 0 && (
              <div className="mb-6 flex items-center gap-2 bg-[#fdecec] border border-[#f3c6c6] text-[#C92F3C] text-sm px-4 py-2.5 rounded-md" data-testid="admin-low-stock-banner">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span><strong>{lowStockProducts.length} Produkt{lowStockProducts.length !== 1 ? 'e' : ''}</strong> {lowStockProducts.length !== 1 ? 'sind' : 'ist'} am oder unter dem Mindestbestand – bitte Nachbestellung prüfen.</span>
              </div>
            )}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-600 text-left">
                    <tr>
                      <th className="px-4 py-3">Bild</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Fahrzeug</th>
                      <th className="px-4 py-3">Preis (brutto)</th>
                      <th className="px-4 py-3">Bestand</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const low = (p.stock_min_alert ?? 0) > 0 && (p.stock_quantity ?? 0) <= p.stock_min_alert;
                      return (
                        <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50" data-testid={`admin-product-row-${p.sku}`}>
                          <td className="px-4 py-2"><img src={(p.images && p.images[0]) || 'https://via.placeholder.com/48'} alt="" className="w-12 h-12 object-cover rounded" /></td>
                          <td className="px-4 py-2 font-medium max-w-[300px]">{p.name}</td>
                          <td className="px-4 py-2 text-gray-500 font-mono text-xs">{p.sku}</td>
                          <td className="px-4 py-2 text-gray-500">{label(VEHICLE_OPTIONS, p.vehicle)}</td>
                          <td className="px-4 py-2">{p.price_net > 0 ? formatEuro(p.price_gross) : <span className="text-gray-400">auf Anfrage</span>}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex items-center gap-1 font-semibold ${low ? 'text-[#E63946]' : 'text-gray-700'}`}>
                              {low && <AlertTriangle className="w-4 h-4" />}{p.stock_quantity ?? 0}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{p.is_active ? 'Aktiv' : 'Inaktiv'}</span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEdit(p)} className="p-2 text-gray-500 hover:text-[#E63946]" data-testid={`admin-edit-${p.sku}`}><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => remove(p)} className="p-2 text-gray-500 hover:text-[#E63946]" data-testid={`admin-delete-${p.sku}`}><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === 'bestellungen' && (
          <>
            <div className="flex items-center justify-between mb-1 flex-wrap gap-4">
              <div>
                <h1 className="font-logo text-3xl font-bold uppercase mb-1">Bestellungen</h1>
                <p className="text-gray-500 text-sm">{orders.length} Bestellungen</p>
              </div>
              <div className="flex items-end gap-3 flex-wrap">
                <button onClick={openPhoneOrder} className="flex items-center gap-2 h-[42px] bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold px-4 rounded-md" data-testid="admin-new-phone-order-btn">
                  <Phone className="w-4 h-4" /> Telefonbestellung anlegen
                </button>
                <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-lg p-3">
                  <Field label="Monat">
                    <select value={exportMonth} onChange={(e) => setExportMonth(Number(e.target.value))} className="inp" data-testid="admin-export-month">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
                    </select>
                  </Field>
                  <Field label="Jahr">
                    <input type="number" value={exportYear} onChange={(e) => setExportYear(Number(e.target.value))} className="inp w-24" data-testid="admin-export-year" />
                  </Field>
                  <button onClick={exportInvoices} disabled={exporting} className="flex items-center gap-2 h-[42px] bg-[#17191d] hover:bg-black text-white font-semibold px-4 rounded-md disabled:opacity-60" data-testid="admin-export-invoices-btn">
                    {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 rotate-180" />} Rechnungen als ZIP
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-6" />
            {orders.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-400"><ShoppingBag className="w-12 h-12 mx-auto mb-3" /> Noch keine Bestellungen.</div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-600 text-left">
                    <tr><th className="px-4 py-3">Nr.</th><th className="px-4 py-3">Datum</th><th className="px-4 py-3">Kunde</th><th className="px-4 py-3">Versand</th><th className="px-4 py-3">Summe</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Rechnung</th><th className="px-4 py-3">Lieferschein</th><th className="px-4 py-3">Versandlabel</th><th className="px-4 py-3">Rücksendelabel</th></tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-t border-gray-100" data-testid={`admin-order-${o.order_number}`}>
                        <td className="px-4 py-2 font-mono">{o.order_number}</td>
                        <td className="px-4 py-2 text-gray-500">{o.created_at ? new Date(o.created_at).toLocaleString('de-DE') : '–'}</td>
                        <td className="px-4 py-2">{[o.first_name, o.last_name].filter(Boolean).join(' ') || o.customer_email}</td>
                        <td className="px-4 py-2 text-gray-500">{o.shipping_method}</td>
                        <td className="px-4 py-2 font-semibold">{formatEuro(o.total_gross)}</td>
                        <td className="px-4 py-2">
                          <select value={o.status} disabled={statusUpdatingId === o.id} onChange={(e) => changeOrderStatus(o, e.target.value)} className="inp py-1 text-xs" data-testid={`admin-order-status-${o.order_number}`}>
                            {ORDER_STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          {o.invoice_pdf_url
                            ? <a href={o.invoice_pdf_url} target="_blank" rel="noreferrer" className="text-[#E63946] font-semibold hover:underline" data-testid={`admin-invoice-${o.order_number}`}>{o.invoice_number} ↓</a>
                            : <span className="text-gray-400">–</span>}
                        </td>
                        <td className="px-4 py-2">
                          <a href={`${API}/sb/orders/${o.id}/delivery-note`} target="_blank" rel="noreferrer" className="text-[#E63946] font-semibold hover:underline text-xs" data-testid={`admin-delivery-note-${o.order_number}`}>Lieferschein ↓</a>
                        </td>
                        <td className="px-4 py-2">
                          {o.shipping_label_url ? (
                            <div className="flex flex-col gap-0.5">
                              <a href={o.shipping_label_url} target="_blank" rel="noreferrer" className="text-[#E63946] font-semibold hover:underline text-xs" data-testid={`admin-label-${o.order_number}`}>Label ↓</a>
                              {o.packing_slip_url && <a href={o.packing_slip_url} target="_blank" rel="noreferrer" className="text-gray-500 hover:underline text-xs" data-testid={`admin-slip-${o.order_number}`}>Packzettel ↓</a>}
                            </div>
                          ) : (
                            <label className="inline-flex items-center gap-1 text-xs font-semibold text-[#E63946] cursor-pointer" data-testid={`admin-upload-label-${o.order_number}`}>
                              {labelUploadingId === o.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />} Label hochladen
                              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => uploadLabel(o, e)} />
                            </label>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {o.return_label_url ? (
                            <a href={o.return_label_url} target="_blank" rel="noreferrer" className="text-[#E63946] font-semibold hover:underline text-xs" data-testid={`admin-return-label-${o.order_number}`}>Rücksendelabel ↓</a>
                          ) : o.status === 'WIDERRUF_ANGEFORDERT' ? (
                            <label className="inline-flex items-center gap-1 text-xs font-semibold text-[#E63946] cursor-pointer" data-testid={`admin-upload-return-label-${o.order_number}`}>
                              {returnLabelUploadingId === o.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />} Rücksendelabel hochladen
                              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => uploadReturnLabel(o, e)} />
                            </label>
                          ) : <span className="text-gray-400">–</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === 'anfragen' && (
          <>
            <h1 className="font-logo text-3xl font-bold uppercase mb-1">Anfragen</h1>
            <p className="text-gray-500 text-sm mb-6">{inquiries.length} Anfragen</p>
            {inquiries.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-400"><Inbox className="w-12 h-12 mx-auto mb-3" /> Noch keine Anfragen eingegangen.</div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((q) => (
                  <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-[#17191d]">{q.name} <span className="text-gray-400 font-normal text-sm">· {new Date(q.created_at).toLocaleString('de-DE')}</span></p>
                        <p className="text-sm text-gray-600 flex flex-wrap gap-x-4 mt-1">
                          <a href={`mailto:${q.email}`} className="flex items-center gap-1 hover:text-[#E63946]"><Mail className="w-4 h-4" /> {q.email}</a>
                          {q.phone && <span>{q.phone}</span>}
                        </p>
                      </div>
                      <button onClick={() => removeInquiry(q.id)} className="p-2 text-gray-400 hover:text-[#E63946]"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    {(q.product_name || q.variant) && (
                      <div className="mt-3 bg-[#fdf2f2] border border-[#f3c6c6] rounded-md px-3 py-2 text-sm">
                        {q.product_name && <span className="font-semibold text-[#17191d]">{q.product_name}</span>}
                        {q.product_art_nr && <span className="text-gray-500"> · Art.-Nr. {q.product_art_nr}</span>}
                        {q.variant && <div className="text-gray-600">Ausführung: {q.variant}</div>}
                      </div>
                    )}
                    <p className="mt-3 text-sm text-gray-700 whitespace-pre-line">{q.message}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'support' && (
          <>
            <h1 className="font-logo text-3xl font-bold uppercase mb-1">Support-Anfragen</h1>
            <p className="text-gray-500 text-sm mb-6">{supportRequests.length} Anfragen zu Bestellungen</p>
            {supportRequests.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-400"><MessageCircle className="w-12 h-12 mx-auto mb-3" /> Noch keine Support-Anfragen eingegangen.</div>
            ) : (
              <div className="space-y-4">
                {supportRequests.map((r) => (
                  <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-5" data-testid={`support-request-row-${r.id}`}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="font-bold text-[#17191d]">Bestellung {r.order_number} <span className="text-gray-400 font-normal text-sm">· {new Date(r.created_at).toLocaleString('de-DE')}</span></p>
                        <p className="text-sm text-gray-600">{r.customer_email} · <span className="font-semibold">{SUPPORT_CATEGORY_LABEL[r.category] || r.category}</span></p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${r.status === 'BEANTWORTET' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status === 'BEANTWORTET' ? 'Beantwortet' : 'Offen'}</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line mb-3">{r.message}</p>
                    {r.admin_reply ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm">
                        <p className="text-xs font-semibold text-gray-500 mb-0.5">Eure Antwort:</p>
                        <p className="text-gray-700">{r.admin_reply}</p>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <textarea rows={2} value={replyDrafts[r.id] || ''} onChange={(e) => setReplyDrafts((d) => ({ ...d, [r.id]: e.target.value }))} className="inp flex-1" placeholder="Antwort schreiben ..." data-testid={`support-reply-input-${r.id}`} />
                        <button onClick={() => submitReply(r)} disabled={replyingId === r.id} className="h-[42px] px-4 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md text-sm disabled:opacity-60" data-testid={`support-reply-submit-${r.id}`}>
                          {replyingId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Antworten'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'benutzer' && isAdmin && (
          <>
            <h1 className="font-logo text-3xl font-bold uppercase mb-1">Benutzer verwalten</h1>
            <p className="text-gray-500 text-sm mb-6">Admin & Bearbeiter – persönliche Logins für euer Team.</p>

            <form onSubmit={createStaff} className="bg-white border border-gray-200 rounded-lg p-5 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end" data-testid="admin-create-staff-form">
              <Field label="Name"><input value={staffForm.name} onChange={(e) => setStaffForm((f) => ({ ...f, name: e.target.value }))} className="inp" data-testid="staff-name" /></Field>
              <Field label="E-Mail"><input type="email" required value={staffForm.email} onChange={(e) => setStaffForm((f) => ({ ...f, email: e.target.value }))} className="inp" data-testid="staff-email" /></Field>
              <Field label="Startpasswort"><input type="password" required minLength={8} value={staffForm.password} onChange={(e) => setStaffForm((f) => ({ ...f, password: e.target.value }))} className="inp" data-testid="staff-password" /></Field>
              <Field label="Rolle">
                <select value={staffForm.role} onChange={(e) => setStaffForm((f) => ({ ...f, role: e.target.value }))} className="inp" data-testid="staff-role">
                  <option value="bearbeiter">Bearbeiter</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>
              <div className="sm:col-span-4">
                <button type="submit" disabled={staffSaving} className="flex items-center gap-2 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold px-4 py-2.5 rounded-md disabled:opacity-60" data-testid="staff-create-submit">
                  <UserPlus className="w-4 h-4" /> {staffSaving ? 'Wird angelegt ...' : 'Konto anlegen'}
                </button>
                {staffMsg && <span className="ml-3 text-sm text-gray-600" data-testid="staff-msg">{staffMsg}</span>}
              </div>
            </form>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600 text-left">
                  <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">E-Mail</th><th className="px-4 py-3">Rolle</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Aktion</th></tr>
                </thead>
                <tbody>
                  {staffList.map((u) => (
                    <tr key={u.id} className="border-t border-gray-100" data-testid={`staff-row-${u.email}`}>
                      <td className="px-4 py-2">{u.name || '–'}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2 uppercase text-xs font-semibold text-gray-500">{u.role}</td>
                      <td className="px-4 py-2"><span className={`text-xs font-semibold px-2 py-1 rounded ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{u.is_active ? 'Aktiv' : 'Deaktiviert'}</span></td>
                      <td className="px-4 py-2 text-right">
                        {u.id !== staffUser.id && (
                          <button onClick={() => toggleStaffActive(u)} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#E63946]" data-testid={`staff-toggle-${u.email}`}>
                            {u.is_active ? <><Ban className="w-3.5 h-3.5" /> Deaktivieren</> : <><CheckCircle2 className="w-3.5 h-3.5" /> Aktivieren</>}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Product form drawer */}
      {form && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={closeForm} />
          <form onSubmit={save} className="relative bg-white w-full max-w-lg h-full overflow-y-auto p-6 shadow-2xl" data-testid="admin-product-form">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-logo text-xl font-bold uppercase">{editingId ? 'Produkt bearbeiten' : 'Neues Produkt'}</h2>
              <button type="button" onClick={closeForm} className="p-2 text-gray-500 hover:text-[#E63946]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Name"><input required value={form.name} onChange={(e) => set('name', e.target.value)} className="inp" data-testid="pf-name" /></Field>

              <Field label="Sonderkategorie">
                <select value={form.special_category} onChange={(e) => set('special_category', e.target.value)} className="inp" data-testid="pf-special-category">
                  {SPECIAL_CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>

              {!form.special_category && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Fahrzeug">
                      <select value={form.vehicle} onChange={(e) => set('vehicle', e.target.value)} className="inp" data-testid="pf-vehicle">{VEHICLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                    </Field>
                    <Field label="Typ">
                      <select value={form.product_type} onChange={(e) => set('product_type', e.target.value)} className="inp" data-testid="pf-type">{TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                    </Field>
                    <Field label="Baugruppe">
                      <select value={form.assembly_group} onChange={(e) => set('assembly_group', e.target.value)} className="inp" data-testid="pf-assembly">{ASSEMBLY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                    </Field>
                  </div>
                  {form.vehicle === 'TRABANT' && (
                    <Field label="Trabant-Typ (optional)">
                      <select value={form.vehicle_model} onChange={(e) => set('vehicle_model', e.target.value)} className="inp" data-testid="pf-vehicle-model">
                        {MODEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </Field>
                  )}
                </>
              )}

              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_set} onChange={(e) => set('is_set', e.target.checked)} /> Set / Komplettbausatz</label>

              <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm">
                <span className="text-gray-500">Artikelnummer (SKU): </span>
                <span className="font-mono font-semibold" data-testid="pf-sku">{editingId ? form.sku : (skuPreview || '… wird automatisch erzeugt')}</span>
                {!editingId && <p className="text-xs text-gray-400 mt-1">Wird beim Speichern automatisch vergeben.</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Nettopreis (€, 0 = auf Anfrage)"><input value={form.price_net} onChange={(e) => set('price_net', e.target.value)} placeholder="z.B. 249.00" className="inp" data-testid="pf-price-net" /></Field>
                <Field label="MwSt. (%)"><input value={form.tax_rate} onChange={(e) => set('tax_rate', e.target.value)} className="inp" data-testid="pf-tax-rate" /></Field>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Bestand"><input value={form.stock_quantity} onChange={(e) => set('stock_quantity', e.target.value)} className="inp" data-testid="pf-stock" /></Field>
                <Field label="Mindestbestand"><input value={form.stock_min_alert} onChange={(e) => set('stock_min_alert', e.target.value)} className="inp" data-testid="pf-stock-alert" /></Field>
                <Field label="Gewicht (g)"><input value={form.weight_grams} onChange={(e) => set('weight_grams', e.target.value)} className="inp" /></Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Sortierung"><input value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} className="inp" /></Field>
                <Field label="YouTube-URL (optional)"><input value={form.youtube_url} onChange={(e) => set('youtube_url', e.target.value)} className="inp" /></Field>
              </div>

              <Field label="Beschreibung"><textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} className="inp" data-testid="pf-description" /></Field>

              {/* Images */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Produktbilder</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {(form.images || []).map((url, i) => (
                    <div key={i} className="relative w-20 h-20 border border-gray-200 rounded overflow-hidden">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#E63946] cursor-pointer">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Bilder hochladen
                  <input type="file" accept="image/*" multiple onChange={onUpload} className="hidden" data-testid="pf-upload" />
                </label>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} data-testid="pf-active" /> Im Shop sichtbar</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.dekra_certified} onChange={(e) => set('dekra_certified', e.target.checked)} /> DEKRA-geprüft</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 h-11 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md disabled:opacity-60" data-testid="pf-save"><Save className="w-5 h-5" /> {saving ? 'Speichern ...' : 'Speichern'}</button>
              <button type="button" onClick={closeForm} className="px-5 h-11 border border-gray-300 rounded-md font-semibold text-gray-600">Abbrechen</button>
            </div>
          </form>
        </div>
      )}

      {/* Telefonbestellung drawer */}
      {phoneOrderOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={closePhoneOrder} />
          <form onSubmit={submitPhoneOrder} className="relative bg-white w-full max-w-lg h-full overflow-y-auto p-6 shadow-2xl" data-testid="admin-phone-order-form">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-logo text-xl font-bold uppercase">Telefonbestellung anlegen</h2>
              <button type="button" onClick={closePhoneOrder} className="p-2 text-gray-500 hover:text-[#E63946]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Bestandskunde wählen (optional)">
                <select value={selectedCustomerId} onChange={(e) => selectExistingCustomer(e.target.value)} className="inp" data-testid="po-existing-customer">
                  <option value="">Neuer Kunde ...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{[c.first_name, c.last_name].filter(Boolean).join(' ') || c.email} – {c.email}</option>
                  ))}
                </select>
              </Field>
              <Field label="Kunden-E-Mail *"><input required type="email" value={phoneOrderForm.email} onChange={(e) => setPhoneOrderForm((f) => ({ ...f, email: e.target.value }))} className="inp" data-testid="po-email" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Vorname"><input value={phoneOrderForm.first_name} onChange={(e) => setPhoneOrderForm((f) => ({ ...f, first_name: e.target.value }))} className="inp" data-testid="po-first-name" /></Field>
                <Field label="Nachname"><input value={phoneOrderForm.last_name} onChange={(e) => setPhoneOrderForm((f) => ({ ...f, last_name: e.target.value }))} className="inp" data-testid="po-last-name" /></Field>
              </div>
              <Field label="Straße & Nr."><input value={phoneOrderForm.street} onChange={(e) => setPhoneOrderForm((f) => ({ ...f, street: e.target.value }))} className="inp" data-testid="po-street" /></Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="PLZ"><input value={phoneOrderForm.zip} onChange={(e) => setPhoneOrderForm((f) => ({ ...f, zip: e.target.value }))} className="inp" data-testid="po-zip" /></Field>
                <Field label="Ort"><input value={phoneOrderForm.city} onChange={(e) => setPhoneOrderForm((f) => ({ ...f, city: e.target.value }))} className="inp" data-testid="po-city" /></Field>
                <Field label="Land"><input value={phoneOrderForm.country} onChange={(e) => setPhoneOrderForm((f) => ({ ...f, country: e.target.value }))} className="inp" data-testid="po-country" /></Field>
              </div>
              <Field label="Versandart">
                <select value={phoneOrderForm.shipping_method} onChange={(e) => setPhoneOrderForm((f) => ({ ...f, shipping_method: e.target.value }))} className="inp" data-testid="po-shipping-method">
                  <option value="HERMES">Hermes-Versand (5,95 €)</option>
                  <option value="ABHOLUNG">Abholung (kostenfrei)</option>
                </select>
              </Field>

              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Produkte</label>
                <div className="flex gap-2 mb-3">
                  <select value={phoneOrderProductId} onChange={(e) => setPhoneOrderProductId(e.target.value)} className="inp flex-1" data-testid="po-product-select">
                    <option value="">Produkt wählen ...</option>
                    {products.filter((p) => p.price_net > 0).map((p) => <option key={p.id} value={p.id}>{p.name} – {formatEuro(p.price_gross)}</option>)}
                  </select>
                  <button type="button" onClick={addPhoneOrderLine} className="px-4 bg-[#17191d] hover:bg-black text-white font-semibold rounded-md" data-testid="po-add-line">Hinzufügen</button>
                </div>
                {phoneOrderLines.map((l) => (
                  <div key={l.product_id} className="flex items-center gap-2 py-2 border-b border-gray-100 text-sm" data-testid={`po-line-${l.product_id}`}>
                    <span className="flex-1">{l.name}</span>
                    <input type="number" min={1} value={l.quantity} onChange={(e) => setLineQty(l.product_id, e.target.value)} className="inp w-16 py-1" data-testid={`po-line-qty-${l.product_id}`} />
                    <span className="w-20 text-right font-semibold">{formatEuro((l.price_gross || 0) * l.quantity)}</span>
                    <button type="button" onClick={() => removeLine(l.product_id)} className="text-gray-400 hover:text-[#E63946]"><X className="w-4 h-4" /></button>
                  </div>
                ))}
                {phoneOrderLines.length > 0 && (
                  <div className="flex justify-between pt-3 font-bold text-[#17191d]"><span>Summe (brutto, zzgl. Versand)</span><span data-testid="po-total">{formatEuro(phoneOrderTotal)}</span></div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <button type="button" onClick={() => setShowCustomItem((s) => !s)} className="text-sm font-semibold text-[#E63946] hover:underline mb-3" data-testid="po-toggle-custom-item">
                  {showCustomItem ? '− Individuelles Produkt entfernen' : '+ Individuelles Produkt hinzufügen'}
                </button>
                {showCustomItem && (
                  <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-md p-3" data-testid="po-custom-item-block">
                    <Field label="Produktname *"><input value={customItem.name} onChange={(e) => setCustomItem((f) => ({ ...f, name: e.target.value }))} className="inp" data-testid="po-custom-name" /></Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Nettopreis (€) *"><input value={customItem.price_net} onChange={(e) => setCustomItem((f) => ({ ...f, price_net: e.target.value }))} className="inp" data-testid="po-custom-price" /></Field>
                      <Field label="Versandkosten (€, optional)"><input value={customItem.shipping_override} onChange={(e) => setCustomItem((f) => ({ ...f, shipping_override: e.target.value }))} placeholder="Standard übernehmen" className="inp" data-testid="po-custom-shipping" /></Field>
                    </div>
                    <Field label="Versandlaufzeit (optional)"><input value={customItem.lead_time_text} onChange={(e) => setCustomItem((f) => ({ ...f, lead_time_text: e.target.value }))} placeholder="z.B. Lieferung in 5 Werktagen nach Zahlungseingang" className="inp" data-testid="po-custom-lead-time" /></Field>
                    <p className="text-xs text-gray-400">Wird als inaktives Produkt im Katalog gespeichert und erscheint nicht im Shop.</p>
                  </div>
                )}
              </div>

              {phoneOrderMsg && <p className="text-sm text-gray-600" data-testid="po-msg">{phoneOrderMsg}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button type="submit" disabled={phoneOrderSaving} className="flex-1 flex items-center justify-center gap-2 h-11 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md disabled:opacity-60" data-testid="po-submit">
                <Mail className="w-5 h-5" /> {phoneOrderSaving ? 'Wird gesendet ...' : 'Bestätigungs-E-Mail senden'}
              </button>
              <button type="button" onClick={closePhoneOrder} className="px-5 h-11 border border-gray-300 rounded-md font-semibold text-gray-600">Schließen</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
