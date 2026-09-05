import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogOut, Plus, Pencil, Trash2, X, Save, ArrowLeft, Package, Inbox, Mail, ShoppingBag, AlertTriangle, Upload, Loader2 } from 'lucide-react';
import api, { getToken, setToken, clearToken } from '../api';
import { VEHICLE_OPTIONS, TYPE_OPTIONS, ASSEMBLY_OPTIONS, formatEuro } from '../mock';
import Logo from '../components/Logo';

const emptyForm = {
  name: '', description: '', vehicle: 'TRABANT', product_type: 'TUNING', assembly_group: 'MOTOR',
  is_set: false, price_net: '', tax_rate: '19', stock_quantity: '0', stock_min_alert: '5',
  weight_grams: '0', sort_order: '100', is_active: true, dekra_certified: false, youtube_url: '', images: [],
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
    {children}
  </div>
);

const label = (opts, v) => (opts.find((o) => o.value === v) || {}).label || v;

const Admin = () => {
  const [authed, setAuthed] = useState(!!getToken());
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [tab, setTab] = useState('produkte');

  const [products, setProducts] = useState([]);
  const [loadingP, setLoadingP] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);

  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [skuPreview, setSkuPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

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

  useEffect(() => { if (authed) { loadProducts(); loadInquiries(); loadOrders(); } }, [authed, loadProducts, loadInquiries, loadOrders]);

  // Auto-SKU preview when creating
  useEffect(() => {
    if (!form || editingId) { setSkuPreview(''); return; }
    let active = true;
    (async () => {
      try {
        const res = await api.nextSku({ vehicle: form.vehicle, product_type: form.product_type, assembly_group: form.assembly_group, is_set: form.is_set });
        if (active) setSkuPreview(res.sku);
      } catch { if (active) setSkuPreview(''); }
    })();
    return () => { active = false; };
  }, [form?.vehicle, form?.product_type, form?.assembly_group, form?.is_set, editingId, form]);

  const login = async (e) => {
    e.preventDefault();
    setLoginErr('');
    try { const res = await api.login(password); setToken(res.token); setAuthed(true); }
    catch { setLoginErr('Falsches Passwort.'); }
  };
  const logout = () => { clearToken(); setAuthed(false); setPassword(''); };

  const openCreate = () => { setForm({ ...emptyForm, images: [] }); setEditingId(null); };
  const openEdit = (p) => {
    setForm({
      name: p.name || '', description: p.description || '', vehicle: p.vehicle || 'TRABANT',
      product_type: p.product_type || 'TUNING', assembly_group: p.assembly_group || 'MOTOR',
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
    const payload = {
      name: form.name, description: form.description, vehicle: form.vehicle,
      product_type: form.product_type, assembly_group: form.assembly_group, is_set: form.is_set,
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

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#17191d] flex items-center justify-center px-4">
        <form onSubmit={login} className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-lg bg-[#E63946] flex items-center justify-center text-white"><Lock className="w-5 h-5" /></span>
            <div>
              <h1 className="font-logo text-xl font-bold uppercase">Admin-Login</h1>
              <p className="text-xs text-gray-500">Kupke-Tuning Verwaltung</p>
            </div>
          </div>
          <label className="block text-sm font-semibold mb-1">Passwort</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="inp" placeholder="••••••••" data-testid="admin-password" />
          {loginErr && <p className="text-[#E63946] text-sm mt-2" data-testid="admin-login-error">{loginErr}</p>}
          <button type="submit" className="w-full mt-5 h-11 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold rounded-md transition-colors" data-testid="admin-login-btn">Anmelden</button>
          <Link to="/" className="block text-center mt-4 text-sm text-gray-500 hover:text-[#E63946]">← Zurück zum Shop</Link>
        </form>
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
            <Link to="/" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"><ArrowLeft className="w-4 h-4" /> Shop</Link>
            <button onClick={logout} className="flex items-center gap-1 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md" data-testid="admin-logout"><LogOut className="w-4 h-4" /> Abmelden</button>
          </div>
        </div>
        <div className="max-w-[1300px] mx-auto px-4 flex gap-1">
          <TabBtn id="produkte" icon={Package}>Produkte</TabBtn>
          <TabBtn id="bestellungen" icon={ShoppingBag} count={orders.length}>Bestellungen</TabBtn>
          <TabBtn id="anfragen" icon={Inbox} count={inquiries.length}>Anfragen</TabBtn>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 py-8">
        {msg && <div className="mb-4 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-2 rounded-md" data-testid="admin-msg">{msg}</div>}

        {tab === 'produkte' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-logo text-2xl font-bold uppercase">Produkte verwalten</h1>
                <p className="text-gray-500 text-sm">{products.length} Produkte {loadingP && '(lädt ...)'}</p>
              </div>
              <button onClick={openCreate} className="flex items-center gap-2 bg-[#E63946] hover:bg-[#C92F3C] text-white font-semibold px-4 py-2.5 rounded-md transition-colors" data-testid="admin-new-product"><Plus className="w-5 h-5" /> Neues Produkt</button>
            </div>
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
                      const low = (p.stock_quantity ?? 0) <= (p.stock_min_alert ?? 5);
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
            <h1 className="font-logo text-2xl font-bold uppercase mb-1">Bestellungen</h1>
            <p className="text-gray-500 text-sm mb-6">{orders.length} Bestellungen</p>
            {orders.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-400"><ShoppingBag className="w-12 h-12 mx-auto mb-3" /> Noch keine Bestellungen.</div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-600 text-left">
                    <tr><th className="px-4 py-3">Nr.</th><th className="px-4 py-3">Datum</th><th className="px-4 py-3">Kunde</th><th className="px-4 py-3">Versand</th><th className="px-4 py-3">Summe</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Rechnung</th></tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-t border-gray-100" data-testid={`admin-order-${o.order_number}`}>
                        <td className="px-4 py-2 font-mono">{o.order_number}</td>
                        <td className="px-4 py-2 text-gray-500">{o.created_at ? new Date(o.created_at).toLocaleString('de-DE') : '–'}</td>
                        <td className="px-4 py-2">{[o.first_name, o.last_name].filter(Boolean).join(' ') || o.customer_email}</td>
                        <td className="px-4 py-2 text-gray-500">{o.shipping_method}</td>
                        <td className="px-4 py-2 font-semibold">{formatEuro(o.total_gross)}</td>
                        <td className="px-4 py-2"><span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">{o.status}</span></td>
                        <td className="px-4 py-2">
                          {o.invoice_pdf_url
                            ? <a href={o.invoice_pdf_url} target="_blank" rel="noreferrer" className="text-[#E63946] font-semibold hover:underline" data-testid={`admin-invoice-${o.order_number}`}>{o.invoice_number} ↓</a>
                            : <span className="text-gray-400">–</span>}
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
            <h1 className="font-logo text-2xl font-bold uppercase mb-1">Anfragen</h1>
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
    </div>
  );
};

export default Admin;
