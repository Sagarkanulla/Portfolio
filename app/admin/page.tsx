'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, LogOut, Plus, Save, Trash2, UploadCloud } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { certificates as starterCertificates, projects as starterProjects, type Certificate, type Project } from '@/lib/data';

type Tab = 'projects' | 'certificates';

export default function AdminPage() {
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [client, setClient] = useState<ReturnType<typeof createClient>>(null);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<Tab>('projects');
  const [projectRows, setProjectRows] = useState<Project[]>(starterProjects);
  const [certRows, setCertRows] = useState<Certificate[]>(starterCertificates);
  const [edit, setEdit] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sb = createClient();
    setClient(sb);
    setSupabaseReady(!!sb);
    // Always require entering email and password to access Portfolio Studio
    setIsAdmin(false);
  }, []);

  const notify = (s: string, bad = false) => {
    setMessage(s);
    setError(bad);
  };

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    notify('');

    // Check requested admin credentials
    if (email === 'vijaysagarkanulla@gmail.com' && password === '22761A5488') {
      setUser({ email, app_metadata: { role: 'admin' } });
      setIsAdmin(true);
      setBusy(false);
      notify('Signed in as administrator.');
      return;
    }

    if (!client) {
      setBusy(false);
      notify('Invalid email or password.', true);
      return;
    }

    const { data, error } = await client.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      notify('Invalid email or password.', true);
      return;
    }
    setUser(data.user);
    if (data.user.app_metadata?.role === 'admin' || data.user.email === 'vijaysagarkanulla@gmail.com') {
      setIsAdmin(true);
      notify('Signed in as administrator.');
    } else {
      setIsAdmin(false);
      notify('Signed in, but this account has no admin role.', true);
    }
  }

  async function signOut() {
    if (client) await client.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setEmail('');
    setPassword('');
    setProjectRows(starterProjects);
    setCertRows(starterCertificates);
    notify('Signed out.');
  }

  async function loadRows() {
    if (!client || !isAdmin) return;
    setBusy(true);
    const [p, c] = await Promise.all([
      client.from('projects').select('*').order('created_at', { ascending: false }),
      client.from('certificates').select('*').order('created_at', { ascending: false })
    ]);
    setBusy(false);
    if (p.error || c.error) {
      notify(p.error?.message || c.error?.message || 'Could not load records.', true);
      return;
    }
    if (p.data && p.data.length > 0) setProjectRows(p.data);
    if (c.data && c.data.length > 0) setCertRows(c.data);
  }

  useEffect(() => {
    if (isAdmin) loadRows();
  }, [isAdmin]);

  function newItem() {
    setEdit(
      tab === 'projects'
        ? {
            title: '',
            category: 'AI / ML',
            description: '',
            stack: '',
            demo_url: '',
            repo_url: '',
            image_url: '',
            featured: false,
            details: ''
          }
        : {
            title: '',
            issuer: '',
            category: 'Data Analytics',
            issued_on: '',
            credential_url: '',
            file_url: '',
            credential_id: ''
          }
    );
    notify('');
  }

  function editItem(item: any) {
    setEdit({
      ...item,
      stack: Array.isArray(item.stack) ? item.stack.join(', ') : item.stack || ''
    });
    notify('');
  }

  async function saveItem(e: FormEvent) {
    e.preventDefault();
    if (!isAdmin || !edit) return;
    setBusy(true);
    notify('');
    const values = { ...edit };
    if (tab === 'projects') {
      values.stack = String(values.stack || '')
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    } else {
      delete values.stack;
    }
    delete values.created_at;
    delete values.updated_at;

    if (client) {
      const table = tab;
      const result = values.id
        ? await client.from(table).update(values).eq('id', values.id)
        : await client.from(table).insert(values);
      if (result.error) {
        setBusy(false);
        notify(result.error.message, true);
        return;
      }
    } else {
      // Local state update fallback
      if (tab === 'projects') {
        const next = values.id
          ? projectRows.map((r) => (r.id === values.id ? values : r))
          : [values, ...projectRows];
        setProjectRows(next);
      } else {
        const next = values.id
          ? certRows.map((r) => (r.id === values.id ? values : r))
          : [values, ...certRows];
        setCertRows(next);
      }
    }

    setBusy(false);
    setEdit(null);
    notify('Saved successfully.');
    if (client) await loadRows();
  }

  async function deleteItem(id: string) {
    if (!isAdmin || !confirm('Delete this record permanently?')) return;
    if (client) {
      const { error } = await client.from(tab).delete().eq('id', id);
      if (error) {
        notify(error.message, true);
        return;
      }
    }
    if (tab === 'projects') {
      setProjectRows((prev) => prev.filter((r) => r.id !== id));
    } else {
      setCertRows((prev) => prev.filter((r) => r.id !== id));
    }
    notify('Record deleted.');
    if (client) await loadRows();
  }

  async function uploadFile(file: File) {
    if (!isAdmin) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    if (!['pdf', 'png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
      notify('Upload a PDF or image (PNG, JPG, WEBP).', true);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      notify('File exceeds 10 MB.', true);
      return;
    }
    setBusy(true);
    if (client) {
      const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const { error } = await client.storage
        .from('portfolio-certificates')
        .upload(path, file, { upsert: false, contentType: file.type });
      if (error) {
        setBusy(false);
        notify(error.message, true);
        return;
      }
      const { data } = client.storage.from('portfolio-certificates').getPublicUrl(path);
      setEdit((old: any) => ({ ...old, file_url: data.publicUrl }));
    }
    setBusy(false);
    notify('File uploaded.');
  }

  const rows = tab === 'projects' ? projectRows : certRows;

  return (
    <main className="admin-page">
      <div className="admin-wrap">
        <div className="admin-head">
          <div>
            <Link href="/" className="kicker">
              <ArrowLeft size={14} /> BACK TO PORTFOLIO
            </Link>
            <h1>
              Portfolio <span className="gradient-text">studio.</span>
            </h1>
            <p className="admin-hint">Content management for projects and certificates.</p>
          </div>
          {isAdmin && (
            <button className="admin-button secondary" onClick={signOut}>
              <LogOut size={15} /> Sign out
            </button>
          )}
        </div>

        {!isAdmin && (
          <div className="admin-panel">
            <h2>Administrator sign in</h2>
            <p className="admin-hint">Enter your admin credentials to access the portfolio editor.</p>
            <form className="admin-form" onSubmit={signIn}>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>
              <button className="admin-button" disabled={busy}>
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        )}

        {isAdmin && (
          <>
            <div className="admin-panel">
              <div className="admin-tabs">
                <button
                  className={`admin-tab ${tab === 'projects' ? 'active' : ''}`}
                  onClick={() => {
                    setTab('projects');
                    setEdit(null);
                    notify('');
                  }}
                >
                  Projects ({projectRows.length})
                </button>
                <button
                  className={`admin-tab ${tab === 'certificates' ? 'active' : ''}`}
                  onClick={() => {
                    setTab('certificates');
                    setEdit(null);
                    notify('');
                  }}
                >
                  Certificates ({certRows.length})
                </button>
              </div>

              <div className="admin-head">
                <div>
                  <h2>{tab === 'projects' ? 'Manage projects' : 'Manage certificates'}</h2>
                  <p className="admin-hint">Update project and certificate records.</p>
                </div>
                <button className="admin-button" onClick={newItem}>
                  <Plus size={15} /> Add new
                </button>
              </div>

              {edit && (
                <form className="admin-form" onSubmit={saveItem}>
                  {tab === 'projects' ? (
                    <>
                      <label>
                        Project title
                        <input
                          value={edit.title || ''}
                          onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                          required
                        />
                      </label>
                      <label>
                        Category
                        <select
                          value={edit.category || 'AI / ML'}
                          onChange={(e) => setEdit({ ...edit, category: e.target.value })}
                        >
                          <option>AI / ML</option>
                          <option>Data Analytics</option>
                          <option>Full-Stack</option>
                        </select>
                      </label>
                      <label>
                        Description
                        <textarea
                          rows={3}
                          value={edit.description || ''}
                          onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                          required
                        />
                      </label>
                      <label>
                        Tech stack (comma separated)
                        <input
                          value={edit.stack || ''}
                          onChange={(e) => setEdit({ ...edit, stack: e.target.value })}
                          placeholder="Python, Pandas, Scikit-learn"
                        />
                      </label>
                      <label>
                        Live demo URL
                        <input
                          type="url"
                          value={edit.demo_url || ''}
                          onChange={(e) => setEdit({ ...edit, demo_url: e.target.value })}
                          placeholder="https://…"
                        />
                      </label>
                      <label>
                        Repository URL
                        <input
                          type="url"
                          value={edit.repo_url || ''}
                          onChange={(e) => setEdit({ ...edit, repo_url: e.target.value })}
                          placeholder="https://github.com/…"
                        />
                      </label>
                      <label>
                        Image URL
                        <input
                          type="url"
                          value={edit.image_url || ''}
                          onChange={(e) => setEdit({ ...edit, image_url: e.target.value })}
                        />
                      </label>
                      <label>
                        Detailed case study
                        <textarea
                          rows={3}
                          value={edit.details || ''}
                          onChange={(e) => setEdit({ ...edit, details: e.target.value })}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <label>
                        Certificate title
                        <input
                          value={edit.title || ''}
                          onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                          required
                        />
                      </label>
                      <label>
                        Issuer
                        <input
                          value={edit.issuer || ''}
                          onChange={(e) => setEdit({ ...edit, issuer: e.target.value })}
                          required
                        />
                      </label>
                      <label>
                        Category
                        <select
                          value={edit.category || 'Data Analytics'}
                          onChange={(e) => setEdit({ ...edit, category: e.target.value })}
                        >
                          <option>AI & Machine Learning</option>
                          <option>Data Analytics</option>
                          <option>Programming</option>
                          <option>Workshops & Events</option>
                          <option>Sports & Extra-Curricular</option>
                          <option>Achievements</option>
                        </select>
                      </label>
                      <label>
                        Issue date
                        <input
                          type="text"
                          value={edit.issued_on || ''}
                          onChange={(e) => setEdit({ ...edit, issued_on: e.target.value })}
                          placeholder="e.g. 31 October 2025"
                        />
                      </label>
                      <label>
                        Credential verification URL
                        <input
                          type="url"
                          value={edit.credential_url || ''}
                          onChange={(e) => setEdit({ ...edit, credential_url: e.target.value })}
                          placeholder="https://issuer.example/verify/…"
                        />
                      </label>
                      <label>
                        Credential ID
                        <input
                          value={edit.credential_id || ''}
                          onChange={(e) => setEdit({ ...edit, credential_id: e.target.value })}
                        />
                      </label>
                      <label>
                        Certificate file (PDF or image, max 10 MB)
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
                        />
                      </label>
                      {edit.file_url && (
                        <p className="admin-hint">
                          Uploaded file:{' '}
                          <a href={edit.file_url} target="_blank" rel="noreferrer">
                            Preview <UploadCloud size={13} />
                          </a>
                        </p>
                      )}
                    </>
                  )}
                  <div className="admin-actions">
                    <button className="admin-button" disabled={busy}>
                      <Save size={15} />
                      {busy ? 'Saving…' : 'Save record'}
                    </button>
                    <button
                      type="button"
                      className="admin-button secondary"
                      onClick={() => setEdit(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {message && <p className={`status-message ${error ? 'error' : ''}`}>{message}</p>}

              <div className="admin-list">
                {rows.map((r: any) => (
                  <div className="admin-item" key={r.id}>
                    <div>
                      <h3>{r.title}</h3>
                      <p>
                        {tab === 'projects'
                          ? `${r.category} · ${(r.stack || []).join(', ')}`
                          : `${r.issuer} · ${r.category}`}
                      </p>
                    </div>
                    <div className="admin-actions">
                      <button onClick={() => editItem(r)}>Edit</button>
                      <button onClick={() => deleteItem(r.id)}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
                {!rows.length && (
                  <p className="admin-hint">
                    No records found. Use the starter content in <code>lib/data.ts</code> as reference.
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {message && !isAdmin && (
          <p className={`status-message ${error ? 'error' : ''}`}>{message}</p>
        )}
      </div>
    </main>
  );
}
