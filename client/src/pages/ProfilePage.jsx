import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PresenceIndicator } from '../components/common/PresenceIndicator';
import { formatDate } from '../utils/dateUtils';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Key,
  MapPin,
  Phone,
  Github,
  Linkedin,
  GraduationCap,
  Code2,
  Cpu,
  FolderGit2,
  CheckCircle2,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, isAdmin } = useAuth();

  // Admin details from verified credentials & resume
  const isUjjwal = isAdmin || user?.email?.toLowerCase().includes('ujjsingh') || user?.email?.toLowerCase().includes('admin');

  const adminData = {
    name: user?.name || 'Ujjwal Singh',
    title: 'Lead Full-Stack Software Engineer & Administrator',
    email: user?.email || 'ujjsingh203@gmail.com',
    phone: '+91 8604913255',
    location: 'AKTU, Lucknow, Uttar Pradesh, India',
    github: 'https://github.com/ujjsingh2005-byte',
    avatar: '/admin-avatar.jpg',
    education: [
      {
        institution: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU / GCRG)',
        degree: 'Bachelor of Technology in Computer Science and Engineering',
        period: 'Sep. 2023 – May 2027',
        location: 'Lucknow, Uttar Pradesh',
        status: 'In Progress',
      },
      {
        institution: 'Kamla Nehru Institute of Child and Education',
        degree: 'Class 12th (Senior Secondary) — 81%',
        period: 'April 2021 – May 2022',
        location: 'Sultanpur, Uttar Pradesh',
        status: 'Completed',
      },
      {
        institution: 'Kamla Nehru Institute of Child and Education',
        degree: 'Class 10th (Secondary School) — 88.8%',
        period: 'April 2019 – May 2020',
        location: 'Sultanpur, Uttar Pradesh',
        status: 'Completed',
      },
    ],
    skills: {
      languages: ['C++', 'Python', 'Java', 'C', 'JavaScript', 'TypeScript', 'SQL', 'PostgreSQL', 'HTML/CSS'],
      backend: ['Node.js', 'Express.js', 'FastAPI', 'MongoDB', 'PostgreSQL', 'Supabase', 'REST APIs', 'Socket.IO'],
      frontend: ['React.js', 'Next.js', 'Tailwind CSS', 'Redux', 'Vite', 'Responsive Design'],
      tools: ['VS Code', 'Git', 'GitHub', 'Linux', 'Google Cloud Platform', 'Cloudinary', 'MediaPipe', 'OpenCV'],
    },
    coursework: [
      'Data Structures & Algorithms',
      'Database Management (DBMS)',
      'Artificial Intelligence',
      'Systems Programming',
      'Computer Organisation & Architecture',
      'Algorithms Analysis',
      'Digital Electronics',
      'Discrete Mathematics',
    ],
    projects: [
      {
        name: 'TaskFlow',
        tagline: 'Real-Time Collaborative Task Management SaaS',
        tech: 'React, Node.js, Express, MongoDB, Socket.IO, Tailwind CSS',
        description:
          'Engineered a high-performance collaborative task platform featuring optimistic concurrency control, real-time presence indicators, instant WebSocket state synchronization, and role governance.',
      },
      {
        name: 'CourseHub',
        tagline: 'Scalable Online Course Management System',
        tech: 'Node.js, Express.js, MongoDB, React.js, Tailwind, Cloudinary',
        description:
          'Supports 1,000+ concurrent users with 30% API response time optimization, JWT role-based access control, automated course delivery, and secure payment processing.',
      },
      {
        name: 'Bharat Sign AI 3',
        tagline: 'AI-Powered Sign Language Translation Platform',
        tech: 'React, Next.js, TypeScript, Python, FastAPI, MediaPipe, OpenCV, PostgreSQL',
        description:
          'Multilingual communication platform translating between spoken languages and Indian Sign Language (ISL) using text, voice, and real-time computer vision gesture analysis.',
      },
      {
        name: 'Smart Parking System',
        tagline: 'Intelligent Parking Slot Allocation & Booking',
        tech: 'React, Node.js, Express.js, MongoDB',
        description:
          'Streamlined real-time parking slot availability, dynamic reservations, and user/administrator parking management workflows.',
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Profile Hero Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-midnight-deep via-midnight-ink to-midnight-slate rounded-3xl p-6 sm:p-10 border border-midnight-subtle shadow-2xl text-midnight-text">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-aqua/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          {/* Avatar Container with Real Admin Photo */}
          <div className="relative group shrink-0">
            <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl bg-gradient-to-tr from-violet via-blueAccent to-aqua p-1 shadow-2xl shadow-violet/30 ring-4 ring-midnight-border/60">
              <div className="h-full w-full rounded-[22px] overflow-hidden bg-midnight-ink flex items-center justify-center">
                <img
                  src={isUjjwal ? adminData.avatar : (user?.avatar || adminData.avatar)}
                  alt={user?.name || adminData.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = adminData.avatar;
                  }}
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-midnight-ink p-2 rounded-full shadow-lg border border-midnight-subtle">
              <PresenceIndicator userId={user?._id} size="md" />
            </div>
          </div>

          {/* User Bio Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet/20 text-violet-light border border-violet/40 shadow-xs">
                <Shield className="h-3.5 w-3.5 text-violet-light" />
                <span>{user?.role || 'ADMIN'} GOVERNANCE</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-aqua/20 text-aqua border border-aqua/40">
                <span className="w-2 h-2 rounded-full bg-aqua animate-pulse-live mr-1" />
                <span>Verified System Lead</span>
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {isUjjwal ? adminData.name : user?.name}
              </h1>
              <p className="text-sm font-medium text-violet-light/90 mt-1">
                {isUjjwal ? adminData.title : 'TaskFlow Platform Member'}
              </p>
            </div>

            {/* Contact Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-4 text-xs text-midnight-muted pt-1">
              <div className="flex items-center space-x-1.5">
                <Mail className="h-3.5 w-3.5 text-violet-light" />
                <span>{isUjjwal ? adminData.email : user?.email}</span>
              </div>
              {isUjjwal && (
                <>
                  <div className="flex items-center space-x-1.5">
                    <Phone className="h-3.5 w-3.5 text-lime" />
                    <span>{adminData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="h-3.5 w-3.5 text-coral" />
                    <span>{adminData.location}</span>
                  </div>
                </>
              )}
            </div>

            {/* Action Links */}
            {isUjjwal && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href={adminData.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-midnight-elevated/80 hover:bg-midnight-elevated text-xs font-semibold text-white border border-midnight-subtle hover:border-violet/50 transition-all cursor-pointer"
                >
                  <Github className="h-3.5 w-3.5 text-violet-light" />
                  <span>GitHub Profile</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
                <a
                  href={`mailto:${adminData.email}`}
                  className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-coral hover:bg-coral-bright text-xs font-semibold text-white shadow-coral-glow transition-all cursor-pointer"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Contact Admin</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Education & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Education & Academic Credentials */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-ivory-paper dark:bg-midnight-ink rounded-3xl p-6 sm:p-8 border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-ivory-subtle dark:border-midnight-subtle">
              <div className="p-2.5 rounded-xl bg-violet/10 text-violet">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-ivory-text dark:text-midnight-text">
                  Academic Background & Degrees
                </h2>
                <p className="text-xs text-ivory-muted dark:text-midnight-muted">
                  Formal education and university credentials
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {adminData.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="relative pl-6 pb-4 border-l-2 border-violet/30 last:border-transparent last:pb-0"
                >
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-violet ring-4 ring-ivory-paper dark:ring-midnight-ink" />
                  <div className="bg-ivory-soft/60 dark:bg-midnight-slate/40 p-4 rounded-2xl border border-ivory-subtle dark:border-midnight-subtle space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-ivory-text dark:text-midnight-text">
                        {edu.institution}
                      </h3>
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-violet/10 text-violet">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-blueAccent">{edu.degree}</p>
                    <p className="text-[11px] text-ivory-muted dark:text-midnight-muted flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{edu.location}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Key Projects */}
          <div className="bg-ivory-paper dark:bg-midnight-ink rounded-3xl p-6 sm:p-8 border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-ivory-subtle dark:border-midnight-subtle">
              <div className="p-2.5 rounded-xl bg-aqua/10 text-aqua">
                <FolderGit2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-ivory-text dark:text-midnight-text">
                  Featured Software Engineering Projects
                </h2>
                <p className="text-xs text-ivory-muted dark:text-midnight-muted">
                  Production systems and scalable architectures engineered by the admin
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminData.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-ivory-soft/50 dark:bg-midnight-slate/40 border border-ivory-subtle dark:border-midnight-subtle hover:border-violet/40 transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-ivory-text dark:text-midnight-text">
                        {proj.name}
                      </h3>
                      <Sparkles className="h-3.5 w-3.5 text-violet" />
                    </div>
                    <p className="text-[11px] font-semibold text-coral mt-0.5">{proj.tagline}</p>
                    <p className="text-xs text-ivory-muted dark:text-midnight-muted mt-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-ivory-subtle/80 dark:border-midnight-subtle/80">
                    <p className="text-[10px] font-bold text-ivory-muted dark:text-midnight-muted uppercase tracking-wider mb-1">
                      Tech Stack
                    </p>
                    <p className="text-[11px] font-mono text-blueAccent font-semibold">{proj.tech}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skills & Coursework */}
        <div className="space-y-6">
          {/* Technical Skills */}
          <div className="bg-ivory-paper dark:bg-midnight-ink rounded-3xl p-6 border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-5">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-ivory-subtle dark:border-midnight-subtle">
              <div className="p-2 rounded-xl bg-blueAccent/10 text-blueAccent">
                <Code2 className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-ivory-text dark:text-midnight-text">
                Technical Proficiencies
              </h2>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
                Programming Languages
              </p>
              <div className="flex flex-wrap gap-1.5">
                {adminData.skills.languages.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet/10 text-violet border border-violet/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend & Databases */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
                Backend & Cloud
              </p>
              <div className="flex flex-wrap gap-1.5">
                {adminData.skills.backend.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-aqua/10 text-aqua border border-aqua/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Frontend & Frameworks */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
                Frontend & UI Systems
              </p>
              <div className="flex flex-wrap gap-1.5">
                {adminData.skills.frontend.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-coral/10 text-coral border border-coral/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools & DevOps */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ivory-muted dark:text-midnight-muted">
                Developer Tools & Frameworks
              </p>
              <div className="flex flex-wrap gap-1.5">
                {adminData.skills.tools.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-lime/10 text-lime-deep dark:text-lime border border-lime/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Relevant Coursework */}
          <div className="bg-ivory-paper dark:bg-midnight-ink rounded-3xl p-6 border border-ivory-subtle dark:border-midnight-subtle shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-ivory-subtle dark:border-midnight-subtle">
              <div className="p-2 rounded-xl bg-amber/10 text-amber">
                <Cpu className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-ivory-text dark:text-midnight-text">
                Computer Science Coursework
              </h2>
            </div>

            <div className="space-y-2">
              {adminData.coursework.map((course, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-2 text-xs font-medium text-ivory-text dark:text-midnight-text py-1 border-b border-ivory-subtle/50 dark:border-midnight-subtle/50 last:border-none"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-violet shrink-0" />
                  <span>{course}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
