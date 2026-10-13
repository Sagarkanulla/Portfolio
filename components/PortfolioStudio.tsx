'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  ChartNoAxesCombined,
  Code2,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  GraduationCap,
  BriefcaseBusiness,
  ShieldCheck,
  Award,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  UploadCloud,
  CheckCircle2,
  SlidersHorizontal,
  Eye,
  Lock,
  Unlock,
  Download
} from 'lucide-react';
import {
  profile as defaultProfile,
  projects as defaultProjects,
  certificates as defaultCertificates,
  experience as defaultExperience,
  education as defaultEducation,
  achievements as defaultAchievements,
  type Project,
  type Certificate,
  type ExperienceItem,
  type EducationItem
} from '@/lib/data';
import { createClient } from '@/lib/supabase';

type ModalType =
  | 'profile'
  | 'about'
  | 'project'
  | 'certificate'
  | 'experience'
  | 'education'
  | 'achievement'
  | 'contact'
  | null;

export default function PortfolioStudio() {
  // Content States
  const [profile, setProfile] = useState(defaultProfile);
  const [projectsList, setProjectsList] = useState<Project[]>(defaultProjects);
  const [certificatesList, setCertificatesList] = useState<Certificate[]>(defaultCertificates);
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>(defaultExperience);
  const [educationList, setEducationList] = useState<EducationItem[]>(defaultEducation);
  const [achievementsList, setAchievementsList] = useState<string[]>(defaultAchievements);
  const [aboutPillars, setAboutPillars] = useState({
    mainTitle: 'Practical thinking.\nThoughtful building.',
    mainDesc: defaultProfile.intro,
    subDesc: 'I enjoy working across the full journey: understanding a problem, exploring the data, building a solution, and presenting it clearly.',
    aiDesc: 'Data preparation, supervised learning, model evaluation, and computer vision prototypes.',
    insightsDesc: 'Exploring data, communicating patterns, and building clear visual stories with analytics tools.',
    buildDesc: 'Creating responsive web experiences, API-driven applications, and database-backed products.'
  });

  // Filter & Search states
  const [projectFilter, setProjectFilter] = useState('All');
  const [projectSearch, setProjectSearch] = useState('');
  const [certFilter, setCertFilter] = useState('All');

  // Edit Mode & Auth state
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('vijaysagarkanulla@gmail.com');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Certificate Viewer Modal State
  const [viewerCert, setViewerCert] = useState<{
    id?: string;
    title: string;
    issuer?: string;
    issued_on?: string;
    file_url?: string;
    category?: string;
    credential_id?: string;
    valid_until?: string;
  } | null>(null);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editData, setEditData] = useState<any>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Initial Load: Supabase + LocalStorage sync
  useEffect(() => {
    const DATA_VERSION = 'v10_clean_21_no_duplicates_deletable';
    try {
      if (localStorage.getItem('vs_data_version') !== DATA_VERSION) {
        localStorage.clear();
        localStorage.setItem('vs_data_version', DATA_VERSION);
      }
      const storedProfile = localStorage.getItem('vs_profile');
      if (storedProfile) setProfile(JSON.parse(storedProfile));
      const storedExp = localStorage.getItem('vs_experience');
      if (storedExp) setExperienceList(JSON.parse(storedExp));
      const storedAch = localStorage.getItem('vs_achievements');
      if (storedAch) setAchievementsList(JSON.parse(storedAch));
      const storedAbout = localStorage.getItem('vs_about');
      if (storedAbout) setAboutPillars(JSON.parse(storedAbout));

      // Strictly visible-only by default; only active if authenticated in this session
      const isAuthenticated = sessionStorage.getItem('vs_edit_authenticated') === 'true';
      if (isAuthenticated) setIsEditMode(true);
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    }

    // Then load from Supabase if configured
    const sb = createClient();
    if (sb) {
      // Load projects and merge with defaultProjects so repo_url and status are always preserved
      sb.from('projects')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .then(({ data }) => {
          if (data && data.length > 0) {
            const merged = defaultProjects.map((dp) => {
              const remote = data.find(
                (p: any) =>
                  p.title?.toLowerCase().includes('look2local') && dp.title.toLowerCase().includes('look2local')
                  ? true
                  : p.title?.toLowerCase() === dp.title?.toLowerCase() || p.id === dp.id
              );
              if (remote) {
                return {
                  ...dp,
                  ...remote,
                  repo_url: remote.repo_url || dp.repo_url,
                  status: (dp.id === 'look2local' || dp.title.toLowerCase().includes('look2local'))
                    ? 'In Process'
                    : (remote.status || dp.status),
                  details: dp.details || remote.details
                };
              }
              return dp;
            });
            setProjectsList(merged);
            localStorage.setItem('vs_projects', JSON.stringify(merged));
          }
        });

      // Load certificates: strictly merge with defaultCertificates and exclude any deleted items
      sb.from('certificates')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .then(({ data }) => {
          const deleted = JSON.parse(localStorage.getItem('vs_deleted_certs') || '[]');
          if (data && data.length > 0) {
            const merged = defaultCertificates
              .filter(dc => !deleted.includes(dc.id) && !deleted.includes(dc.title))
              .map((dc) => {
                const remote = data.find(
                  (c: any) =>
                    c.id === dc.id ||
                    c.title?.toLowerCase().trim() === dc.title.toLowerCase().trim()
                );
                if (remote) {
                  return {
                    ...dc,
                    file_url:
                      dc.id === 'prakruthi-3rd'
                        ? '/certificates/3rdprize.jpeg'
                        : remote.file_url || dc.file_url,
                    credential_id: remote.credential_id || dc.credential_id,
                    valid_until: dc.valid_until || remote.valid_until,
                    issued_on: dc.issued_on || remote.issued_on
                  };
                }
                return dc;
              });
            setCertificatesList(merged);
            localStorage.setItem('vs_certificates', JSON.stringify(merged));
          } else {
            const filtered = defaultCertificates.filter(
              dc => !deleted.includes(dc.id) && !deleted.includes(dc.title)
            );
            setCertificatesList(filtered);
          }
        });

      // Load site content
      sb.from('site_content')
        .select('*')
        .then(({ data }) => {
          if (data) {
            data.forEach((row) => {
              if (row.key === 'profile' && row.data) setProfile(row.data);
              if (row.key === 'experience' && row.data) setExperienceList(row.data);
              if (row.key === 'education' && row.data) {
                const mergedEdu = defaultEducation.map((de, idx) => {
                  const remote = Array.isArray(row.data) ? row.data[idx] : null;
                  return {
                    ...de,
                    ...(remote || {}),
                    certificate_url: de.certificate_url,
                    issued_on: de.issued_on
                  };
                });
                setEducationList(mergedEdu);
              }
              if (row.key === 'achievements' && row.data) setAchievementsList(row.data);
              if (row.key === 'about' && row.data) setAboutPillars(row.data);
            });
          }
        });
    }
  }, []);

  const toggleStudioMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
      try {
        sessionStorage.removeItem('vs_edit_authenticated');
        localStorage.removeItem('vs_studio_mode');
      } catch (e) {}
      showToast('Locked: portfolio is in visible-only mode.');
    } else {
      try {
        if (sessionStorage.getItem('vs_edit_authenticated') === 'true') {
          setIsEditMode(true);
          showToast('Edit mode enabled.');
          return;
        }
      } catch (e) {}
      setAuthEmail('vijaysagarkanulla@gmail.com');
      setAuthPassword('');
      setAuthError('');
      setShowAuthModal(true);
    }
  };

  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      authEmail.trim().toLowerCase() === 'vijaysagarkanulla@gmail.com' &&
      authPassword === '22761A5488'
    ) {
      setIsEditMode(true);
      setShowAuthModal(false);
      setAuthError('');
      setAuthPassword('');
      try {
        sessionStorage.setItem('vs_edit_authenticated', 'true');
      } catch (e) {}
      showToast('Authenticated! Studio edit mode unlocked.');
    } else {
      setAuthError('Invalid email or password. Access denied.');
    }
  };

  // Helper to persist content to Supabase + localStorage
  const syncContent = async (key: string, data: any) => {
    localStorage.setItem(`vs_${key}`, JSON.stringify(data));
    const sb = createClient();
    if (sb) {
      if (key === 'projects' || key === 'certificates') {
        // Individual tables
      } else {
        await sb.from('site_content').upsert({ key, data });
      }
    }
  };

  // File Uploader handler
  const handleFileUpload = async (file: File, targetField: 'image_url' | 'file_url' | 'resume') => {
    setUploading(true);
    try {
      // 1. Upload via local upload API
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'folder',
        targetField === 'image_url'
          ? 'projects'
          : targetField === 'resume'
          ? 'resumes'
          : 'certificates'
      );

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const json = await res.json();
        setEditData((prev: any) => ({
          ...prev,
          [targetField === 'resume' ? 'resume' : targetField]: json.url
        }));
        if (targetField === 'resume') {
          const updated = { ...profile, resume: json.url };
          setProfile(updated);
          localStorage.setItem('vs_profile', JSON.stringify(updated));
          await syncContent('profile', updated);
        }
        showToast('File uploaded successfully!');
      } else {
        // Fallback: Upload to Supabase Storage if local fails
        const sb = createClient();
        if (sb) {
          const ext = file.name.split('.').pop() || 'bin';
          const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const bucket = 'portfolio-certificates';
          const { error } = await sb.storage.from(bucket).upload(path, file);
          if (!error) {
            const { data } = sb.storage.from(bucket).getPublicUrl(path);
            setEditData((prev: any) => ({
              ...prev,
              [targetField === 'resume' ? 'resume' : targetField]: data.publicUrl
            }));
            if (targetField === 'resume') {
              const updated = { ...profile, resume: data.publicUrl };
              setProfile(updated);
              localStorage.setItem('vs_profile', JSON.stringify(updated));
              await syncContent('profile', updated);
            }
            showToast('File uploaded to storage!');
          } else {
            showToast('Upload error: ' + error.message);
          }
        }
      }
    } catch (err: any) {
      showToast('Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Direct 1-click resume update handler
  const handleDirectResumeUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'resumes');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const json = await res.json();
        const updated = { ...profile, resume: json.url };
        setProfile(updated);
        localStorage.setItem('vs_profile', JSON.stringify(updated));
        await syncContent('profile', updated);
        showToast('Resume updated successfully!');
      } else {
        showToast('Resume upload failed.');
      }
    } catch (err: any) {
      showToast('Resume upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Save Modal Handlers
  const handleSaveModal = async (e: FormEvent) => {
    e.preventDefault();
    const sb = createClient();

    if (activeModal === 'profile') {
      setProfile(editData);
      await syncContent('profile', editData);
      showToast('Profile updated!');
    } else if (activeModal === 'about') {
      setAboutPillars(editData);
      await syncContent('about', editData);
      showToast('About section updated!');
    } else if (activeModal === 'project') {
      const formatted = {
        ...editData,
        stack: Array.isArray(editData.stack)
          ? editData.stack
          : String(editData.stack || '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
        id: editData.id || `proj-${Date.now()}`
      };

      let nextProjects: Project[];
      if (editIndex !== null) {
        nextProjects = [...projectsList];
        nextProjects[editIndex] = formatted;
      } else {
        nextProjects = [formatted, ...projectsList];
      }
      setProjectsList(nextProjects);
      localStorage.setItem('vs_projects', JSON.stringify(nextProjects));

      if (sb) {
        const payload = { ...formatted };
        await sb.from('projects').upsert(payload);
      }
      showToast('Project saved!');
    } else if (activeModal === 'certificate') {
      const formatted = {
        ...editData,
        id: editData.id || `cert-${Date.now()}`
      };

      let nextCerts: Certificate[];
      if (editIndex !== null) {
        nextCerts = [...certificatesList];
        nextCerts[editIndex] = formatted;
      } else {
        nextCerts = [formatted, ...certificatesList];
      }
      setCertificatesList(nextCerts);
      localStorage.setItem('vs_certificates', JSON.stringify(nextCerts));

      if (sb) {
        await sb.from('certificates').upsert(formatted);
      }
      showToast('Certificate saved!');
    } else if (activeModal === 'experience') {
      let nextExp = [...experienceList];
      if (editIndex !== null) {
        nextExp[editIndex] = editData;
      } else {
        nextExp = [editData, ...nextExp];
      }
      setExperienceList(nextExp);
      await syncContent('experience', nextExp);
      showToast('Experience saved!');
    } else if (activeModal === 'education') {
      let nextEdu = [...educationList];
      if (editIndex !== null) {
        nextEdu[editIndex] = editData;
      } else {
        nextEdu = [editData, ...nextEdu];
      }
      setEducationList(nextEdu);
      await syncContent('education', nextEdu);
      showToast('Education saved!');
    } else if (activeModal === 'achievement') {
      let nextAch = [...achievementsList];
      if (editIndex !== null) {
        nextAch[editIndex] = editData.text;
      } else {
        nextAch = [editData.text, ...nextAch];
      }
      setAchievementsList(nextAch);
      await syncContent('achievements', nextAch);
      showToast('Milestone saved!');
    }

    setActiveModal(null);
    setEditData(null);
    setEditIndex(null);
  };

  // Delete Handlers
  const handleDeleteProject = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this project?')) return;
    const target = projectsList[index];
    const next = projectsList.filter((_, i) => i !== index);
    setProjectsList(next);
    localStorage.setItem('vs_projects', JSON.stringify(next));

    const sb = createClient();
    if (sb && target.id) {
      await sb.from('projects').delete().eq('id', target.id);
    }
    showToast('Project deleted');
  };

  const handleDeleteCert = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this certificate?')) return;
    const target = certificatesList[index];
    const next = certificatesList.filter((_, i) => i !== index);
    setCertificatesList(next);
    localStorage.setItem('vs_certificates', JSON.stringify(next));

    try {
      const deleted = JSON.parse(localStorage.getItem('vs_deleted_certs') || '[]');
      if (target.id && !deleted.includes(target.id)) deleted.push(target.id);
      if (target.title && !deleted.includes(target.title)) deleted.push(target.title);
      localStorage.setItem('vs_deleted_certs', JSON.stringify(deleted));
    } catch (err) {}

    const sb = createClient();
    if (sb && target) {
      if (target.id) await sb.from('certificates').delete().eq('id', target.id);
      if (target.title) await sb.from('certificates').delete().eq('title', target.title);
    }
    showToast('Certificate deleted');
  };

  const handleDeleteExperience = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this experience?')) return;
    const next = experienceList.filter((_, i) => i !== index);
    setExperienceList(next);
    await syncContent('experience', next);
    showToast('Experience deleted');
  };

  const handleDeleteEducation = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this education entry?')) return;
    const next = educationList.filter((_, i) => i !== index);
    setEducationList(next);
    await syncContent('education', next);
    showToast('Education entry deleted');
  };

  const handleDeleteAchievement = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this milestone?')) return;
    const next = achievementsList.filter((_, i) => i !== index);
    setAchievementsList(next);
    await syncContent('achievements', next);
    showToast('Milestone deleted');
  };

  // Dynamic Categories from actual data
  const projectCategories = [
    'All',
    ...Array.from(new Set(projectsList.map((p) => p.category).filter(Boolean)))
  ];

  const filteredProjects = projectsList.filter(
    (p) =>
      (projectFilter === 'All' || p.category === projectFilter) &&
      `${p.title} ${p.description} ${p.stack?.join(' ')}`
        .toLowerCase()
        .includes(projectSearch.toLowerCase())
  );

  const certCategories = [
    'All',
    ...Array.from(new Set(certificatesList.map((c) => c.category).filter(Boolean)))
  ];

  const visibleCerts = certificatesList.filter(
    (c) => certFilter === 'All' || c.category === certFilter
  );

  return (
    <main>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="edit-toast">
          <CheckCircle2 size={16} />
          {toastMessage}
        </div>
      )}

      {/* Floating Studio Control Bar */}
      <div className="studio-bar">
        <button
          className={`studio-toggle-btn ${isEditMode ? 'active' : ''}`}
          onClick={toggleStudioMode}
          title={isEditMode ? 'Lock edit mode (switch to visible-only)' : 'Enter admin credentials to edit'}
        >
          {isEditMode ? <Lock size={14} /> : <Pencil size={14} />}
          {isEditMode ? 'Lock / View Mode' : 'Edit Website'}
        </button>
        <span className="studio-status">
          <span
            className="live-dot"
            style={{ background: isEditMode ? 'var(--mint)' : '#666' }}
          />
          {isEditMode ? 'Edit Mode Unlocked' : 'Visible Only'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="nav shell">
        <Link className="brand" href="#home">
          <span className="brand-mark">VS</span>
          <span>
            {profile.name.split(' ')[0] || 'Vijay Sagar'}
            <span className="brand-dot">.</span>
          </span>
        </Link>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#certificates">Certificates</a>
          <a href="#contact">Contact</a>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={toggleStudioMode}
            className="section-btn"
            style={{ padding: '7px 12px', fontSize: '11px' }}
          >
            {isEditMode ? <Lock size={13} /> : <SlidersHorizontal size={13} />}
            {isEditMode ? 'Lock Edit' : 'Edit Mode'}
          </button>
          <Link href="/admin" className="nav-admin">
            Admin <ArrowUpRight size={14} />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" /> OPEN TO OPPORTUNITIES <span className="eyebrow-line" />
          </div>

          {isEditMode && (
            <div className="section-action-bar">
              <button
                className="section-btn"
                onClick={() => {
                  setEditData({ ...profile });
                  setActiveModal('profile');
                }}
              >
                <Pencil size={13} /> Edit Hero & Profile Info
              </button>
            </div>
          )}

          <h1>
            Building useful things with <span className="gradient-text">data, AI</span>
            <br />
            and code<span className="hero-period">.</span>
          </h1>
          <p className="hero-intro">
            I’m <strong>{profile.name}</strong> — {profile.headline}.
          </p>
          <p className="hero-intro" style={{ marginTop: '8px', fontSize: '14px' }}>
            {profile.intro}
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#projects">
              Explore my work <ArrowDownRight size={17} />
            </a>
            <a className="button button-secondary" href={profile.resume} target="_blank">
              Download resume <ArrowUpRight size={16} />
            </a>
            {isEditMode && (
              <label
                className="button button-secondary"
                style={{
                  cursor: 'pointer',
                  borderColor: 'var(--mint)',
                  color: 'var(--mint)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Upload updated resume PDF"
              >
                <UploadCloud size={16} />
                <span>{uploading ? 'Uploading...' : 'Update Resume (PDF)'}</span>
                <input
                  type="file"
                  accept=".pdf"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      await handleDirectResumeUpload(f);
                    }
                  }}
                />
              </label>
            )}
          </div>

          <div className="social-row">
            <a href={profile.github} target="_blank" rel="noreferrer">
              <Github size={17} /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={17} /> LinkedIn
            </a>
            <span>
              <MapPin size={16} />
              {profile.location}
            </span>
          </div>
        </div>

        <div className="hero-art">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orb-core">
            <BrainCircuit size={76} strokeWidth={1.15} />
            <span>AI × DATA × BUILD</span>
          </div>
          <div className="float-card float-card-one">
            <span className="float-icon purple">
              <BrainCircuit size={17} />
            </span>
            <span>
              <b>Machine Learning</b>
              <small>Models · Experiments</small>
            </span>
          </div>
          <div className="float-card float-card-two">
            <span className="float-icon green">
              <ChartNoAxesCombined size={17} />
            </span>
            <span>
              <b>Data Analytics</b>
              <small>Insights · Visualization</small>
            </span>
          </div>
          <div className="hero-stamp">
            <Sparkles size={15} /> Curious by design
          </div>
        </div>

        <div className="hero-bottom">
          <span>PORTFOLIO / 2026</span>
          <span>
            SCROLL TO EXPLORE <ArrowDownRight size={14} />
          </span>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="section shell">
        <div className="section-head">
          <div>
            <span className="kicker">01 — A LITTLE ABOUT ME</span>
            <h2>
              Curiosity into <span className="gradient-text">capability.</span>
            </h2>
            {isEditMode && (
              <div className="section-action-bar">
                <button
                  className="section-btn"
                  onClick={() => {
                    setEditData({ ...aboutPillars });
                    setActiveModal('about');
                  }}
                >
                  <Pencil size={13} /> Edit About Section
                </button>
              </div>
            )}
          </div>
          <p className="section-aside">One portfolio. Three connected interests. A focus on solving real problems.</p>
        </div>

        <div className="about-grid">
          <article className="about-card about-main">
            <span className="mini-icon">
              <Sparkles size={18} />
            </span>
            <h3 style={{ whiteSpace: 'pre-line' }}>{aboutPillars.mainTitle}</h3>
            <p>{aboutPillars.mainDesc}</p>
            <p>{aboutPillars.subDesc}</p>
          </article>
          <article className="about-card">
            <div className="about-icon">
              <BrainCircuit />
            </div>
            <span className="card-number">01 / AI</span>
            <h3>Artificial Intelligence</h3>
            <p>{aboutPillars.aiDesc}</p>
          </article>
          <article className="about-card">
            <div className="about-icon">
              <ChartNoAxesCombined />
            </div>
            <span className="card-number">02 / INSIGHTS</span>
            <h3>Data Analytics</h3>
            <p>{aboutPillars.insightsDesc}</p>
          </article>
          <article className="about-card">
            <div className="about-icon">
              <Code2 />
            </div>
            <span className="card-number">03 / BUILD</span>
            <h3>Full-Stack Development</h3>
            <p>{aboutPillars.buildDesc}</p>
          </article>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="section projects-section">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="kicker">02 — SELECTED WORK</span>
              <h2>
                Projects with a <span className="gradient-text">purpose.</span>
              </h2>
              {isEditMode && (
                <div className="section-action-bar">
                  <button
                    className="section-btn"
                    onClick={() => {
                      setEditData({
                        title: '',
                        category: 'AI / ML',
                        description: '',
                        stack: '',
                        demo_url: '',
                        repo_url: '',
                        image_url: '',
                        details: '',
                        featured: true
                      });
                      setEditIndex(null);
                      setActiveModal('project');
                    }}
                  >
                    <Plus size={14} /> Add New Project
                  </button>
                </div>
              )}
            </div>
            <p className="section-aside">
              A mix of ML prototypes, analytics, and full-stack applications. Updated dynamically.
            </p>
          </div>

          <div className="project-tools">
            <div className="filter-row">
              {projectCategories.map((f) => (
                <button
                  key={f}
                  className={`filter-chip ${projectFilter === f ? 'active' : ''}`}
                  onClick={() => setProjectFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <input
              aria-label="Search projects"
              className="project-search"
              placeholder="Search projects…"
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
            />
          </div>

          <div className="project-grid">
            {filteredProjects.map((p, idx) => {
              const actualIndex = projectsList.findIndex((item) => item.id === p.id);
              return (
                <article className="project-card" key={p.id || idx} style={{ position: 'relative' }}>
                  {isEditMode && (
                    <div className="card-edit-controls">
                      <button
                        title="Edit Project"
                        onClick={() => {
                          setEditData({
                            ...p,
                            stack: Array.isArray(p.stack) ? p.stack.join(', ') : p.stack
                          });
                          setEditIndex(actualIndex);
                          setActiveModal('project');
                        }}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        className="delete-btn"
                        title="Delete Project"
                        onClick={(e) => handleDeleteProject(actualIndex, e)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}

                  <div className="project-top">
                    <span className="project-category">{p.category}</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {(() => {
                        const effectiveStatus = p.status || (p.title?.toLowerCase().includes('look2local') ? 'In Process' : null);
                        if (!effectiveStatus) return null;
                        const isCompleted = effectiveStatus.toLowerCase().includes('completed');
                        return (
                          <span
                            className="project-status-badge"
                            style={
                              isCompleted
                                ? {
                                    background: 'rgba(56, 189, 248, 0.12)',
                                    borderColor: 'rgba(56, 189, 248, 0.35)',
                                    color: '#38bdf8'
                                  }
                                : undefined
                            }
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={11} style={{ marginRight: '3px' }} />
                            ) : (
                              <span className="status-dot-pulse" />
                            )}
                            {effectiveStatus}
                          </span>
                        );
                      })()}
                      <span className="project-index">{p.featured ? 'FEATURED' : 'PROJECT'}</span>
                    </div>
                  </div>

                  {p.image_url && (
                    <img
                      className="project-image"
                      src={p.image_url}
                      alt={`${p.title} project preview`}
                      loading="lazy"
                    />
                  )}

                  <h3>{p.title}</h3>
                  <p>{p.description}</p>

                  <div className="tags">
                    {(p.stack || []).map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>

                  {p.details && <p className="project-note">{p.details}</p>}

                  <div className="card-links">
                    {p.demo_url && (
                      <a href={p.demo_url} target="_blank" rel="noreferrer">
                        Live demo <ArrowUpRight size={14} />
                      </a>
                    )}
                    {p.repo_url && (
                      <a href={p.repo_url} target="_blank" rel="noreferrer">
                        <Github size={14} /> Source <ArrowUpRight size={14} />
                      </a>
                    )}
                    {!p.demo_url && !p.repo_url && (
                      <span className="pending">Demo link pending</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          {!filteredProjects.length && (
            <p className="admin-hint" style={{ marginTop: '20px' }}>
              No projects match that filter.
            </p>
          )}
        </div>
      </section>

      {/* EXPERIENCE & EDUCATION SECTION */}
      <section id="experience" className="section shell">
        <div className="section-head">
          <div>
            <span className="kicker">03 — THE JOURNEY</span>
            <h2>
              Experience & <span className="gradient-text">education.</span>
            </h2>
          </div>
        </div>

        <div className="timeline-layout">
          {/* Experience Column */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="subsection-title" style={{ margin: 0 }}>
                <BriefcaseBusiness size={18} /> Experience
              </h3>
              {isEditMode && (
                <button
                  className="section-btn"
                  onClick={() => {
                    setEditData({
                      role: '',
                      company: '',
                      period: '',
                      location: '',
                      description: ''
                    });
                    setEditIndex(null);
                    setActiveModal('experience');
                  }}
                >
                  <Plus size={13} /> Add
                </button>
              )}
            </div>

            <div className="timeline">
              {experienceList.map((e, i) => (
                <article className="timeline-item" key={i} style={{ position: 'relative' }}>
                  {isEditMode && (
                    <div className="card-edit-controls" style={{ top: 0, right: 0 }}>
                      <button
                        title="Edit Experience"
                        onClick={() => {
                          setEditData({ ...e });
                          setEditIndex(i);
                          setActiveModal('experience');
                        }}
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        className="delete-btn"
                        title="Delete Experience"
                        onClick={(evt) => handleDeleteExperience(i, evt)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}

                  <span className="timeline-dot" />
                  <div className="timeline-meta">
                    {e.period} <span>{e.location}</span>
                  </div>
                  <h3>{e.role}</h3>
                  <h4>{e.company}</h4>
                  <p>{e.description}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="subsection-title" style={{ margin: 0 }}>
                <GraduationCap size={19} /> Education
              </h3>
              {isEditMode && (
                <button
                  className="section-btn"
                  onClick={() => {
                    setEditData({
                      institution: '',
                      degree: '',
                      period: '',
                      grade: ''
                    });
                    setEditIndex(null);
                    setActiveModal('education');
                  }}
                >
                  <Plus size={13} /> Add
                </button>
              )}
            </div>

            <div className="education-list">
              {educationList.map((e, i) => (
                <article className="education-card" key={i} style={{ position: 'relative' }}>
                  {isEditMode && (
                    <div className="card-edit-controls">
                      <button
                        title="Edit Education"
                        onClick={() => {
                          setEditData({ ...e });
                          setEditIndex(i);
                          setActiveModal('education');
                        }}
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        className="delete-btn"
                        title="Delete Education"
                        onClick={(evt) => handleDeleteEducation(i, evt)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}

                  <span>{e.period}</span>
                  <h3>{e.degree}</h3>
                  <p>{e.institution}</p>
                  <small>{e.grade}</small>

                  {(() => {
                    const certUrl = e.certificate_url || defaultEducation[i]?.certificate_url;
                    const certDate = e.issued_on || defaultEducation[i]?.issued_on;
                    if (!certUrl) return null;
                    return (
                      <div
                        style={{
                          marginTop: '12px',
                          paddingTop: '10px',
                          borderTop: '1px solid var(--line)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setViewerCert({
                              id: `edu-${i}`,
                              title: `${e.degree} Certificate`,
                              issuer: e.institution,
                              file_url: certUrl,
                              category: 'Education Certificate',
                              issued_on: certDate
                            })
                          }
                          className="edu-cert-btn"
                        >
                          <Eye size={13} /> View Certificate
                        </button>
                        {certDate && (
                          <span
                            style={{
                              fontSize: '11px',
                              color: 'var(--muted)',
                              fontFamily: 'var(--mono)',
                              background: 'rgba(255,255,255,0.04)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--line)'
                            }}
                          >
                            Issued: {certDate}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATES SECTION */}
      <section id="certificates" className="section certificate-section">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="kicker">04 — LEARNING IN PUBLIC</span>
              <h2>
                Certificates & <span className="gradient-text">credentials.</span>
              </h2>
              {isEditMode && (
                <div className="section-action-bar">
                  <button
                    className="section-btn"
                    onClick={() => {
                      setEditData({
                        title: '',
                        issuer: '',
                        category: 'Data Analytics',
                        issued_on: '',
                        file_url: '',
                        credential_url: '',
                        credential_id: ''
                      });
                      setEditIndex(null);
                      setActiveModal('certificate');
                    }}
                  >
                    <Plus size={14} /> Add New Certificate
                  </button>
                </div>
              )}
            </div>
            <p className="section-aside">
              Verified certificates & credentials from resume. Click any card to view original scans and PDFs.
            </p>
          </div>

          <div className="filter-row certificate-filters">
            {certCategories.map((f) => (
              <button
                key={f}
                type="button"
                className={`filter-chip ${certFilter === f ? 'active' : ''}`}
                onClick={() => setCertFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="certificate-grid">
            {visibleCerts.map((c, i) => {
              const actualIndex = certificatesList.findIndex((item) => item.id === c.id);
              return (
                <article className="certificate-card" key={`${c.id || 'cert'}-${i}`} style={{ position: 'relative' }}>
                  {isEditMode && (
                    <div className="card-edit-controls">
                      <button
                        title="Edit Certificate"
                        onClick={() => {
                          setEditData({ ...c });
                          setEditIndex(actualIndex);
                          setActiveModal('certificate');
                        }}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        className="delete-btn"
                        title="Delete Certificate"
                        onClick={(e) => handleDeleteCert(actualIndex, e)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}

                  <div className="cert-icon">
                    <Award size={21} />
                  </div>
                  <div className="cert-num">CREDENTIAL / {String(i + 1).padStart(2, '0')}</div>
                  <h3>{c.title}</h3>
                  <p>
                    {c.issuer}
                    {c.issued_on ? ` · ${c.issued_on}` : ''}
                    {c.valid_until ? ` · Valid until ${c.valid_until}` : ''}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="cert-category">{c.category}</span>
                    {c.valid_until && (
                      <span className="cert-category" style={{ color: 'var(--mint)', borderColor: 'rgba(154,240,208,.3)' }}>
                        Valid: {c.valid_until}
                      </span>
                    )}
                  </div>

                  <div className="cert-footer">
                    {c.file_url ? (
                      <button
                        type="button"
                        onClick={() => setViewerCert(c)}
                        className="cert-view-btn"
                      >
                        View certificate <ArrowUpRight size={13} />
                      </button>
                    ) : (
                      <span>Certificate file pending</span>
                    )}

                    {c.credential_id ? (
                      <span className="cert-lock" title={`Credential ID: ${c.credential_id}`}>
                        <ShieldCheck size={14} /> ID: {c.credential_id.length > 14 ? `${c.credential_id.slice(0, 12)}…` : c.credential_id}
                      </span>
                    ) : c.credential_url ? (
                      <a href={c.credential_url} target="_blank" rel="noreferrer" className="cert-lock">
                        <ShieldCheck size={14} /> Verify
                      </a>
                    ) : (
                      <span className="cert-lock">Verified</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS SECTION */}
      <section className="section shell">
        <div className="section-head">
          <div>
            <span className="kicker">05 — BEYOND THE SCREEN</span>
            <h2>
              Milestones & <span className="gradient-text">community.</span>
            </h2>
            {isEditMode && (
              <div className="section-action-bar">
                <button
                  className="section-btn"
                  onClick={() => {
                    setEditData({ text: '' });
                    setEditIndex(null);
                    setActiveModal('achievement');
                  }}
                >
                  <Plus size={14} /> Add Milestone
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="achievement-list">
          {achievementsList.map((a, i) => (
            <div key={i} className="achievement-row" style={{ position: 'relative' }}>
              <span>0{i + 1}</span>
              <p>{a}</p>
              {isEditMode ? (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    className="section-btn"
                    style={{ padding: '4px 8px' }}
                    onClick={() => {
                      setEditData({ text: a });
                      setEditIndex(i);
                      setActiveModal('achievement');
                    }}
                  >
                    <Pencil size={11} />
                  </button>
                  <button
                    className="section-btn"
                    style={{ padding: '4px 8px', borderColor: '#f43f5e', color: '#fda4af' }}
                    onClick={(e) => handleDeleteAchievement(i, e)}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ) : (
                <ArrowUpRight size={17} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="contact-section">
        <div className="shell contact-inner">
          <div>
            <span className="kicker">06 — LET’S CONNECT</span>
            <h2>
              Have a problem
              <br />
              worth <span className="gradient-text">solving?</span>
            </h2>
            <p>I'm interested in opportunities across AI/ML, data analytics, and full-stack development.</p>
            {isEditMode && (
              <div className="section-action-bar">
                <button
                  className="section-btn"
                  onClick={() => {
                    setEditData({ ...profile });
                    setActiveModal('contact');
                  }}
                >
                  <Pencil size={13} /> Edit Contact Info
                </button>
              </div>
            )}
          </div>
          <div className="contact-card">
            <a href={`mailto:${profile.email}`}>
              <span className="contact-icon">
                <Mail />
              </span>
              <span>
                <small>EMAIL ME</small>
                <b>{profile.email}</b>
              </span>
              <ArrowUpRight />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <span className="contact-icon">
                <Linkedin />
              </span>
              <span>
                <small>CONNECT ON</small>
                <b>LinkedIn</b>
              </span>
              <ArrowUpRight />
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <span className="contact-icon">
                <Github />
              </span>
              <span>
                <small>EXPLORE CODE</small>
                <b>GitHub repositories</b>
              </span>
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer shell">
        <Link className="brand" href="#home">
          <span className="brand-mark">VS</span>
          <span>
            {profile.name}
            <span className="brand-dot">.</span>
          </span>
        </Link>
        <span>Designed to grow with the work.</span>
        <span>© 2026 {profile.name}</span>
      </footer>

      {/* ================= EDIT MODALS ================= */}
      {activeModal && editData && (
        <div className="edit-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-head">
              <h3>
                {activeModal === 'profile' && 'Edit Profile & Hero'}
                {activeModal === 'about' && 'Edit About Section'}
                {activeModal === 'project' && (editIndex !== null ? 'Edit Project' : 'Add New Project')}
                {activeModal === 'certificate' &&
                  (editIndex !== null ? 'Edit Certificate' : 'Add New Certificate')}
                {activeModal === 'experience' &&
                  (editIndex !== null ? 'Edit Experience' : 'Add Experience')}
                {activeModal === 'education' &&
                  (editIndex !== null ? 'Edit Education' : 'Add Education')}
                {activeModal === 'achievement' &&
                  (editIndex !== null ? 'Edit Milestone' : 'Add Milestone')}
                {activeModal === 'contact' && 'Edit Contact Information'}
              </h3>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <X size={16} />
              </button>
            </div>

            <form className="admin-form" style={{ maxWidth: '100%' }} onSubmit={handleSaveModal}>
              {/* Profile Modal */}
              {activeModal === 'profile' && (
                <>
                  <label>
                    Full Name
                    <input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Headline
                    <input
                      value={editData.headline || ''}
                      onChange={(e) => setEditData({ ...editData, headline: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Bio / Introduction
                    <textarea
                      rows={3}
                      value={editData.intro || ''}
                      onChange={(e) => setEditData({ ...editData, intro: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Location
                    <input
                      value={editData.location || ''}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    />
                  </label>
                  <label>
                    Upload Updated Resume (PDF)
                    <div
                      className="file-upload-zone"
                      onClick={() => resumeInputRef.current?.click()}
                    >
                      <UploadCloud size={20} />
                      <span>{uploading ? 'Uploading...' : 'Click to upload updated resume PDF'}</span>
                      <small style={{ color: 'var(--muted)' }}>Automatically updates download button and /resume.pdf</small>
                      <input
                        ref={resumeInputRef}
                        type="file"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'resume')}
                      />
                    </div>
                  </label>
                  <label>
                    Active Resume File / URL
                    <input
                      value={editData.resume || ''}
                      onChange={(e) => setEditData({ ...editData, resume: e.target.value })}
                    />
                  </label>
                </>
              )}

              {/* About Modal */}
              {activeModal === 'about' && (
                <>
                  <label>
                    Main Title (supports new lines)
                    <textarea
                      rows={2}
                      value={editData.mainTitle || ''}
                      onChange={(e) => setEditData({ ...editData, mainTitle: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Primary Narrative
                    <textarea
                      rows={3}
                      value={editData.mainDesc || ''}
                      onChange={(e) => setEditData({ ...editData, mainDesc: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Secondary Narrative
                    <textarea
                      rows={2}
                      value={editData.subDesc || ''}
                      onChange={(e) => setEditData({ ...editData, subDesc: e.target.value })}
                    />
                  </label>
                  <label>
                    AI Pillar Description
                    <input
                      value={editData.aiDesc || ''}
                      onChange={(e) => setEditData({ ...editData, aiDesc: e.target.value })}
                    />
                  </label>
                  <label>
                    Data Analytics Pillar Description
                    <input
                      value={editData.insightsDesc || ''}
                      onChange={(e) => setEditData({ ...editData, insightsDesc: e.target.value })}
                    />
                  </label>
                  <label>
                    Full-Stack Pillar Description
                    <input
                      value={editData.buildDesc || ''}
                      onChange={(e) => setEditData({ ...editData, buildDesc: e.target.value })}
                    />
                  </label>
                </>
              )}

              {/* Project Modal */}
              {activeModal === 'project' && (
                <>
                  <label>
                    Project Title
                    <input
                      value={editData.title || ''}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Category
                    <input
                      value={editData.category || ''}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      placeholder="AI / ML, Full-Stack, etc."
                      required
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      rows={3}
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Tech Stack (comma separated)
                    <input
                      value={editData.stack || ''}
                      onChange={(e) => setEditData({ ...editData, stack: e.target.value })}
                      placeholder="Python, Flask, React..."
                    />
                  </label>
                  <label>
                    Live Demo URL
                    <input
                      type="url"
                      value={editData.demo_url || ''}
                      onChange={(e) => setEditData({ ...editData, demo_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </label>
                  <label>
                    Source Code / Repository URL
                    <input
                      type="url"
                      value={editData.repo_url || ''}
                      onChange={(e) => setEditData({ ...editData, repo_url: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </label>
                  <label>
                    Image Preview
                    <div
                      className="file-upload-zone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud size={20} />
                      <span>{uploading ? 'Uploading...' : 'Click to upload project screenshot/image'}</span>
                      <small style={{ color: 'var(--muted)' }}>Supports PNG, JPG, WebP</small>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image_url')}
                      />
                    </div>
                    {editData.image_url && (
                      <p className="admin-hint" style={{ marginTop: '6px' }}>
                        Active Image: <code>{editData.image_url}</code>
                      </p>
                    )}
                  </label>
                  <label>
                    Details & Notes
                    <textarea
                      rows={2}
                      value={editData.details || ''}
                      onChange={(e) => setEditData({ ...editData, details: e.target.value })}
                    />
                  </label>
                  <label>
                    Project Status
                    <select
                      value={editData.status || ''}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--line)',
                        color: 'var(--fg)',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        width: '100%',
                        fontSize: '13px',
                        marginTop: '4px'
                      }}
                    >
                      <option value="">None (Standard Project)</option>
                      <option value="In Progress">In Progress (Active pulsing indicator)</option>
                      <option value="Completed">Completed (Checkmark badge)</option>
                      <option value="In Process">In Process</option>
                      <option value="Under Development">Under Development</option>
                      <option value="Prototype">Prototype</option>
                      <option value="Planning / Concept">Planning / Concept</option>
                    </select>
                  </label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '-4px', marginBottom: '8px' }}>
                    {['In Progress', 'Completed', 'In Process', 'Under Development'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setEditData({ ...editData, status: st })}
                        className={`filter-chip ${editData.status === st ? 'active' : ''}`}
                        style={{ fontSize: '11px', padding: '3px 9px' }}
                      >
                        {st}
                      </button>
                    ))}
                    {editData.status && (
                      <button
                        type="button"
                        onClick={() => setEditData({ ...editData, status: '' })}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          background: 'transparent',
                          border: '1px solid var(--line)',
                          color: 'var(--muted)',
                          borderRadius: '999px',
                          cursor: 'pointer'
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      style={{ width: 'auto' }}
                      checked={!!editData.featured}
                      onChange={(e) => setEditData({ ...editData, featured: e.target.checked })}
                    />
                    Featured Project
                  </label>
                </>
              )}

              {/* Certificate Modal */}
              {activeModal === 'certificate' && (
                <>
                  <label>
                    Certificate Title
                    <input
                      value={editData.title || ''}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Issuer
                    <input
                      value={editData.issuer || ''}
                      onChange={(e) => setEditData({ ...editData, issuer: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Category
                    <input
                      value={editData.category || ''}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      placeholder="Data Analytics, AI & Machine Learning, Programming, etc."
                      required
                    />
                  </label>
                  <label>
                    Issue Date
                    <input
                      type="date"
                      value={editData.issued_on || ''}
                      onChange={(e) => setEditData({ ...editData, issued_on: e.target.value })}
                    />
                  </label>
                  <label>
                    Upload Certificate File (PDF / Image)
                    <div
                      className="file-upload-zone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud size={20} />
                      <span>{uploading ? 'Uploading...' : 'Click to upload certificate PDF or scan image'}</span>
                      <small style={{ color: 'var(--muted)' }}>Supports PDF, JPG, PNG, WebP</small>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'file_url')}
                      />
                    </div>
                    {editData.file_url && (
                      <p className="admin-hint" style={{ marginTop: '6px' }}>
                        File URL: <a href={editData.file_url} target="_blank" rel="noreferrer">Preview File <ArrowUpRight size={12} /></a>
                      </p>
                    )}
                  </label>
                  <label>
                    Credential Verification Link
                    <input
                      type="url"
                      value={editData.credential_url || ''}
                      onChange={(e) => setEditData({ ...editData, credential_url: e.target.value })}
                      placeholder="https://issuer.com/verify/..."
                    />
                  </label>
                </>
              )}

              {/* Experience Modal */}
              {activeModal === 'experience' && (
                <>
                  <label>
                    Role / Title
                    <input
                      value={editData.role || ''}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Company / Organization
                    <input
                      value={editData.company || ''}
                      onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Period
                    <input
                      value={editData.period || ''}
                      onChange={(e) => setEditData({ ...editData, period: e.target.value })}
                      placeholder="May 2025 – June 2025"
                      required
                    />
                  </label>
                  <label>
                    Location
                    <input
                      value={editData.location || ''}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      placeholder="Vijayawada, India"
                    />
                  </label>
                  <label>
                    Description & Key Contributions
                    <textarea
                      rows={3}
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      required
                    />
                  </label>
                </>
              )}

              {/* Education Modal */}
              {activeModal === 'education' && (
                <>
                  <label>
                    Institution / University
                    <input
                      value={editData.institution || ''}
                      onChange={(e) => setEditData({ ...editData, institution: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Degree / Certification
                    <input
                      value={editData.degree || ''}
                      onChange={(e) => setEditData({ ...editData, degree: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Period / Year
                    <input
                      value={editData.period || ''}
                      onChange={(e) => setEditData({ ...editData, period: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Grade / Percentage / CGPA
                    <input
                      value={editData.grade || ''}
                      onChange={(e) => setEditData({ ...editData, grade: e.target.value })}
                      placeholder="CGPA: 7.35"
                    />
                  </label>
                </>
              )}

              {/* Achievement Modal */}
              {activeModal === 'achievement' && (
                <>
                  <label>
                    Milestone / Award / Participation
                    <textarea
                      rows={3}
                      value={editData.text || ''}
                      onChange={(e) => setEditData({ ...editData, text: e.target.value })}
                      required
                    />
                  </label>
                </>
              )}

              {/* Contact Modal */}
              {activeModal === 'contact' && (
                <>
                  <label>
                    Email Address
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    LinkedIn Profile URL
                    <input
                      type="url"
                      value={editData.linkedin || ''}
                      onChange={(e) => setEditData({ ...editData, linkedin: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    GitHub Profile URL
                    <input
                      type="url"
                      value={editData.github || ''}
                      onChange={(e) => setEditData({ ...editData, github: e.target.value })}
                      required
                    />
                  </label>
                </>
              )}

              <div className="admin-actions" style={{ marginTop: '10px' }}>
                <button type="submit" className="admin-button" disabled={uploading}>
                  <Save size={14} /> Save Record
                </button>
                <button
                  type="button"
                  className="admin-button secondary"
                  onClick={() => setActiveModal(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CERTIFICATE & DOCUMENT VIEWER MODAL */}
      {viewerCert && (
        <div className="edit-modal-backdrop" onClick={() => setViewerCert(null)}>
          <div className="cert-viewer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cert-viewer-head">
              <div>
                <span className="kicker" style={{ fontSize: '10px' }}>
                  {viewerCert.category || 'CERTIFICATE / CREDENTIAL'}
                </span>
                <h3 style={{ fontSize: '18px', margin: '4px 0 0', color: 'var(--text)' }}>
                  {viewerCert.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '4px 0 0' }}>
                  {viewerCert.issuer} {viewerCert.issued_on ? `· ${viewerCert.issued_on}` : ''}
                  {viewerCert.valid_until ? ` · Valid until ${viewerCert.valid_until}` : ''}
                </p>
                {viewerCert.credential_id && (
                  <p
                    style={{
                      fontSize: '11px',
                      color: 'var(--mint)',
                      fontFamily: 'var(--mono)',
                      margin: '4px 0 0'
                    }}
                  >
                    Credential ID / Verification: <strong>{viewerCert.credential_id}</strong>
                  </p>
                )}
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setViewerCert(null)}
                aria-label="Close Viewer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="cert-viewer-body">
              {viewerCert.file_url ? (
                viewerCert.file_url.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={viewerCert.file_url}
                    title={viewerCert.title}
                    className="cert-iframe-viewer"
                  />
                ) : (
                  <div className="cert-image-container">
                    <img
                      src={viewerCert.file_url}
                      alt={viewerCert.title}
                      className="cert-img-viewer"
                    />
                  </div>
                )
              ) : (
                <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
                  No preview file available.
                </p>
              )}
            </div>

            <div className="cert-viewer-footer">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {viewerCert.file_url && (
                  <a
                    href={viewerCert.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-button secondary"
                    style={{ fontSize: '11px', padding: '8px 12px' }}
                  >
                    Open Full Document <ArrowUpRight size={13} />
                  </a>
                )}
                {viewerCert.file_url && (
                  <a
                    href={viewerCert.file_url}
                    download
                    className="admin-button secondary"
                    style={{ fontSize: '11px', padding: '8px 12px' }}
                  >
                    <Download size={13} /> Download File
                  </a>
                )}
              </div>
              <button
                type="button"
                className="admin-button"
                style={{ fontSize: '11px', padding: '8px 16px' }}
                onClick={() => setViewerCert(null)}
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN AUTHENTICATION MODAL */}
      {showAuthModal && (
        <div className="edit-modal-backdrop" onClick={() => setShowAuthModal(false)}>
          <div
            className="edit-modal"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="edit-modal-head">
              <div>
                <span className="kicker" style={{ fontSize: '10px' }}>ADMIN VERIFICATION</span>
                <h3 style={{ fontSize: '18px', margin: '4px 0 0' }}>Unlock Portfolio Studio</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAuthModal(false)}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
              Enter administrator credentials to unlock website editing features. Public visitors have view-only access.
            </p>

            <form onSubmit={handleAuthSubmit} style={{ display: 'grid', gap: '14px' }}>
              {authError && (
                <div className="status-message error" style={{ margin: 0 }}>
                  {authError}
                </div>
              )}
              <label className="auth-field-label">
                <span>Email Address</span>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => {
                    setAuthEmail(e.target.value);
                    setAuthError('');
                  }}
                  autoComplete="username"
                  required
                  className="auth-input"
                />
              </label>
              <label className="auth-field-label">
                <span>Admin Password</span>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => {
                    setAuthPassword(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  required
                  className="auth-input"
                />
              </label>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  type="submit"
                  className="admin-button"
                  style={{ flex: 1, padding: '11px' }}
                >
                  Verify & Unlock
                </button>
                <button
                  type="button"
                  className="admin-button secondary"
                  onClick={() => setShowAuthModal(false)}
                  style={{ padding: '11px 16px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
