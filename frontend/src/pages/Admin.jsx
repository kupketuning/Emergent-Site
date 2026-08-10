import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogOut, Plus, Pencil, Trash2, X, Save, ArrowLeft, Package, Inbox, Mail } from 'lucide-react';
import api, { getToken, setToken, clearToken } from '../api';
import { useProducts } from '../context/ProductsContext';
import { categories, formatPrice } from '../mock';

const emptyForm = {
  art_nr: '', name: '', category: 'tuning', sub: '', brand: '', price: '',
  delivery: '1-2 Tage', badge: '', fahrzeug: '', image: '', description: '', featured: false, variants: [],
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
    {children}
  </div>
);

const Admin = () => {
  const { products, loading, refetch } = useProducts();
  const [authed, setAuthed] = useState(!!getToken());
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [tab, setTab] = useState('produkte');
  const [inquiries, setInquiries] = useState([]);
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const loadInquiries = async () => {
    try { setInquiries(await api.getInquiries()); } catch { /* ignore */ }
  };

  useEffect(() => { if (authed) loadInquiries(); }, [authed]);

  const login = async (e) => {
    e.preventDefault();
    setLoginErr('');
    try {
      const res = await api.login(password);
      setToken(res.token);
      setAuthed(true);
    } catch { setLoginErr('Falsches Passwort.'); }
  };

  const logout = () => { clearToken(); setAuthed(false); setPassword(''); };

  const openCreate = () => { setForm({ ...emptyForm, variants: [] }); setEditingId(null); };
  const openEdit = (p) => {
    setForm({
      ...p,
      price: p.price === null || p.price === undefined ? '' : String(p.price),
      badge: p.badge || '',
      variants: (p.variants || []).map((g) => ({ name: g.name, optionsText: (g.options || []).join(', ') })),
    });
    setEditingId(p.id);
  };
  const closeForm = () => { setForm(null); setEditingId(null); };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const addGroup = () => setForm((f) => ({ ...f, variants: [...f.variants, { name: '', optionsText: '' }] }));
  const setGroup = (i, k, v) => setForm((f) => ({ ...f, variants: f.variants.map((g, idx) => idx === i ? { ...g, [k]: v } : g) }));
  const removeGroup = (i) => setForm((f) => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    const variants = (form.variants || [])
      .map((g) => ({ name: (g.name || '').trim(), options: (g.optionsText || '').split(',').map((s) => s.trim()).filter(Boolean) }))
      .filter((g) => g.name && g.options.length);
    const payload = {
      ...form,
      price: form.price === '' ? null : parseFloat(String(form.price).replace(',', '.')),
      badge: form.badge || null,
      variants,
    };
    try {
      if (editingId) await api.updateProduct(editingId, payload);
      else await api.createProduct(payload);
      await refetch();
      setMsg(editingId ? 'Produkt aktualisiert.' : 'Produkt angelegt.');
      closeForm();
    } catch { setMsg('Fehler beim Speichern (evtl. Sitzung abgelaufen).'); }
    finally { setSaving(false); }
  };

  const remove = async (p) => {
    if (!window.confirm(`"${p.name}" wirklich löschen?`)) return;
    try { await api.deleteProduct(p.id); await refetch(); setMsg('Produkt gelöscht.'); }
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
            <span className="w-10 h-10 rounded-lg bg-[#e11d1d] flex items-center justify-center text-white"><Lock className="w-5 h-5" /></span>
            <div>
              <h1 className="font-logo text-xl font-bold uppercase">Admin-Login</h1>
              <p className="text-xs text-gray-500">Kupke-Tuning Verwaltung</p>
            </div>
          </div>
          <label className="block text-sm font-semibold mb-1">Passwort</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="inp" placeholder="••••••••" />
          {loginErr && <p className="text-[#e11d1d] text-sm mt-2">{loginErr}</p>}
          <button type="submit" className="w-full mt-5 h-11 bg-[#e11d1d] hover:bg-[#b3161c] text-white font-semibold rounded-md transition-colors">Anmelden</button>
          <Link to="/" className="block text-center mt-4 text-sm text-gray-500 hover:text-[#e11d1d]">← Zurück zum Shop</Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#17191d] text-white">
        <div className="max-w-[1300px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-logo text-xl font-bold uppercase">Kupke-Tuning <span className="text-[#e11d1d]">Admin</span></div>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"><ArrowLeft className="w-4 h-4" /> Shop</Link>
            <button onClick={logout} className="flex items-center gap-1 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md"><LogOut className="w-4 h-4" /> Abmelden</button>
          </div>
        </div>
        <div className="max-w-[1300px] mx-auto px-4 flex gap-1">
          <button onClick={() => setTab('produkte')} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 ${tab === 'produkte' ? 'border-[#e11d1d] text-white' : 'border-transparent text-gray-400 hover:text-white'}`}><Package className="w-4 h-4" /> Produkte</button>
          <button onClick={() => { setTab('anfragen'); loadInquiries(); }} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 ${tab === 'anfragen' ? 'border-[#e11d1d] text-white' : 'border-transparent text-gray-400 hover:text-white'}`}><Inbox className="w-4 h-4" /> Anfragen {inquiries.length > 0 && <span className="bg-[#e11d1d] text-white text-[11px] rounded-full px-1.5">{inquiries.length}</span>}</button>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 py-8">
        {msg && <div className="mb-4 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-2 rounded-md">{msg}</div>}

        {tab === 'produkte' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-logo text-2xl font-bold uppercase">Produkte verwalten</h1>
                <p className="text-gray-500 text-sm">{products.length} Produkte {loading && '(lädt ...)'}</p>
              </div>
              <button onClick={openCreate} className="flex items-center gap-2 bg-[#e11d1d] hover:bg-[#b3161c] text-white font-semibold px-4 py-2.5 rounded-md transition-colors"><Plus className="w-5 h-5" /> Neues Produkt</button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-600 text-left">
                    <tr>
                      <th className="px-4 py-3">Bild</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Kategorie</th>
                      <th className="px-4 py-3">Art.-Nr.</th>
                      <th className="px-4 py-3">Preis</th>
                      <th className="px-4 py-3">Varianten</th>
                      <th className="px-4 py-3 text-right">Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2"><img src={p.image} alt="" className="w-12 h-12 object-cover rounded" /></td>
                        <td className="px-4 py-2 font-medium max-w-[320px]">{p.name}</td>
                        <td className="px-4 py-2">{categories.find((c) => c.id === p.category)?.name || p.category}</td>
                        <td className="px-4 py-2 text-gray-500">{p.art_nr}</td>
                        <td className="px-4 py-2">{formatPrice(p.price)}</td>
                        <td className="px-4 py-2 text-gray-500">{(p.variants || []).length || '–'}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(p)} className="p-2 text-gray-500 hover:text-[#e11d1d]"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => remove(p)} className="p-2 text-gray-500 hover:text-[#e11d1d]"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === 'anfragen' && (
          <>
            <h1 className="font-logo text-2xl font-bold uppercase mb-1">Anfragen</h1>
            <p className="text-gray-500 text-sm mb-6">{inquiries.length} Anfragen</p>
            {inquiries.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-400">
                <Inbox className="w-12 h-12 mx-auto mb-3" /> Noch keine Anfragen eingegangen.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((q) => (
                  <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-[#17191d]">{q.name} <span className="text-gray-400 font-normal text-sm">· {new Date(q.created_at).toLocaleString('de-DE')}</span></p>
                        <p className="text-sm text-gray-600 flex flex-wrap gap-x-4 mt-1">
                          <a href={`mailto:${q.email}`} className="flex items-center gap-1 hover:text-[#e11d1d]"><Mail className="w-4 h-4" /> {q.email}</a>
                          {q.phone && <span>{q.phone}</span>}
                        </p>
                      </div>
                      <button onClick={() => removeInquiry(q.id)} className="p-2 text-gray-400 hover:text-[#e11d1d]"><Trash2 className="w-4 h-4" /></button>
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
          <form onSubmit={save} className="relative bg-white w-full max-w-lg h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-logo text-xl font-bold uppercase">{editingId ? 'Produkt bearbeiten' : 'Neues Produkt'}</h2>
              <button type="button" onClick={closeForm} className="p-2 text-gray-500 hover:text-[#e11d1d]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Name"><input required value={form.name} onChange={(e) => set('name', e.target.value)} className="inp" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Art.-Nr."><input value={form.art_nr} onChange={(e) => set('art_nr', e.target.value)} className="inp" /></Field>
                <Field label="Marke"><input value={form.brand} onChange={(e) => set('brand', e.target.value)} className="inp" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Kategorie">
                  <select value={form.category} onChange={(e) => set('category', e.target.value)} className="inp">
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Unterkategorie">
                  <select value={form.sub} onChange={(e) => set('sub', e.target.value)} className="inp">
                    <option value="">–</option>
                    {(categories.find((c) => c.id === form.category)?.sub || []).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Preis (€, leer = auf Anfrage)"><input value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="z.B. 249.00" className="inp" /></Field>
                <Field label="Lieferzeit"><input value={form.delivery} onChange={(e) => set('delivery', e.target.value)} className="inp" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Badge (optional)"><input value={form.badge} onChange={(e) => set('badge', e.target.value)} placeholder="z.B. Neu" className="inp" /></Field>
                <Field label="Passend für"><input value={form.fahrzeug} onChange={(e) => set('fahrzeug', e.target.value)} className="inp" /></Field>
              </div>
              <Field label="Bild-URL"><input value={form.image} onChange={(e) => set('image', e.target.value)} className="inp" /></Field>
              <Field label="Beschreibung"><textarea rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} className="inp" /></Field>

              {/* Variants editor */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Ausführungen / Varianten</label>
                  <button type="button" onClick={addGroup} className="text-sm text-[#e11d1d] font-semibold flex items-center gap-1"><Plus className="w-4 h-4" /> Gruppe</button>
                </div>
                <p className="text-xs text-gray-400 mb-3">z.B. Gruppe "Dämpfer" mit Optionen "KONI-Rot, KONI-Gelb, KONI-Sport" (durch Komma getrennt).</p>
                <div className="space-y-3">
                  {(form.variants || []).map((g, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <input value={g.name} onChange={(e) => setGroup(i, 'name', e.target.value)} placeholder="Gruppenname (z.B. Lochkreis)" className="inp" />
                        <button type="button" onClick={() => removeGroup(i)} className="p-2 text-gray-400 hover:text-[#e11d1d]"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <input value={g.optionsText} onChange={(e) => setGroup(i, 'optionsText', e.target.value)} placeholder="Optionen, durch Komma getrennt" className="inp" />
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> Auf Startseite hervorheben</label>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 h-11 bg-[#e11d1d] hover:bg-[#b3161c] text-white font-semibold rounded-md disabled:opacity-60"><Save className="w-5 h-5" /> {saving ? 'Speichern ...' : 'Speichern'}</button>
              <button type="button" onClick={closeForm} className="px-5 h-11 border border-gray-300 rounded-md font-semibold text-gray-600">Abbrechen</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
