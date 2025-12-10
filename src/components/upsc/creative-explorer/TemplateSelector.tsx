import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Scale, History, Globe, Sparkles, ArrowRight, ArrowLeft,
  Check, ChevronRight, BookOpen, Building, Gavel, Users, Network,
  Landmark, Castle, Flag, Award, Clock,
  Mountain, Cloud, Droplets, Gem, TrendingUp
} from 'lucide-react';
import type { Node, Edge } from 'reactflow';
import type { MindMapNodeData } from '../../../store/useMindMapStore';

// ============ TYPES ============
interface Subject {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
}

interface Topic {
  id: string;
  name: string;
  subjectId: string;
  icon: React.ElementType;
}

interface Subtopic {
  id: string;
  name: string;
  topicId: string;
}

interface SubSubtopic {
  id: string;
  name: string;
  subtopicId: string;
}

// ============ MOCK DATA ============

const SUBJECTS: Subject[] = [
  {
    id: 'polity',
    name: 'Indian Polity',
    icon: Scale,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'history',
    name: 'Indian History',
    icon: History,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: Globe,
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-600'
  }
];

const TOPICS: Topic[] = [
  // Indian Polity Topics
  { id: 'constitution', name: 'Constitution', subjectId: 'polity', icon: BookOpen },
  { id: 'parliament', name: 'Parliament', subjectId: 'polity', icon: Building },
  { id: 'judiciary', name: 'Judiciary', subjectId: 'polity', icon: Gavel },
  { id: 'executive', name: 'Executive', subjectId: 'polity', icon: Users },
  { id: 'federalism', name: 'Federalism', subjectId: 'polity', icon: Network },

  // Indian History Topics
  { id: 'ancient', name: 'Ancient India', subjectId: 'history', icon: Landmark },
  { id: 'medieval', name: 'Medieval India', subjectId: 'history', icon: Castle },
  { id: 'modern', name: 'Modern India', subjectId: 'history', icon: Flag },
  { id: 'freedom', name: 'Freedom Struggle', subjectId: 'history', icon: Award },
  { id: 'post-independence', name: 'Post-Independence', subjectId: 'history', icon: Clock },

  // Geography Topics
  { id: 'physical', name: 'Physical Geography', subjectId: 'geography', icon: Mountain },
  { id: 'climate', name: 'Climate', subjectId: 'geography', icon: Cloud },
  { id: 'rivers', name: 'Rivers & Drainage', subjectId: 'geography', icon: Droplets },
  { id: 'resources', name: 'Natural Resources', subjectId: 'geography', icon: Gem },
  { id: 'economic', name: 'Economic Geography', subjectId: 'geography', icon: TrendingUp }
];

const SUBTOPICS: Subtopic[] = [
  // Constitution Subtopics
  { id: 'preamble', name: 'Preamble', topicId: 'constitution' },
  { id: 'fundamental-rights', name: 'Fundamental Rights', topicId: 'constitution' },
  { id: 'dpsp', name: 'Directive Principles (DPSP)', topicId: 'constitution' },
  { id: 'fundamental-duties', name: 'Fundamental Duties', topicId: 'constitution' },
  { id: 'amendments', name: 'Constitutional Amendments', topicId: 'constitution' },

  // Parliament Subtopics
  { id: 'lok-sabha', name: 'Lok Sabha', topicId: 'parliament' },
  { id: 'rajya-sabha', name: 'Rajya Sabha', topicId: 'parliament' },
  { id: 'parliamentary-procedures', name: 'Parliamentary Procedures', topicId: 'parliament' },
  { id: 'committees', name: 'Parliamentary Committees', topicId: 'parliament' },
  { id: 'legislation', name: 'Legislative Process', topicId: 'parliament' },

  // Judiciary Subtopics
  { id: 'supreme-court', name: 'Supreme Court', topicId: 'judiciary' },
  { id: 'high-courts', name: 'High Courts', topicId: 'judiciary' },
  { id: 'subordinate-courts', name: 'Subordinate Courts', topicId: 'judiciary' },
  { id: 'judicial-review', name: 'Judicial Review', topicId: 'judiciary' },
  { id: 'pil', name: 'Public Interest Litigation', topicId: 'judiciary' },

  // Executive Subtopics
  { id: 'president', name: 'President', topicId: 'executive' },
  { id: 'prime-minister', name: 'Prime Minister', topicId: 'executive' },
  { id: 'council-ministers', name: 'Council of Ministers', topicId: 'executive' },
  { id: 'governor', name: 'Governor', topicId: 'executive' },
  { id: 'chief-minister', name: 'Chief Minister', topicId: 'executive' },

  // Federalism Subtopics
  { id: 'center-state', name: 'Centre-State Relations', topicId: 'federalism' },
  { id: 'inter-state', name: 'Inter-State Relations', topicId: 'federalism' },
  { id: 'finance-commission', name: 'Finance Commission', topicId: 'federalism' },
  { id: 'gst-council', name: 'GST Council', topicId: 'federalism' },
  { id: 'cooperative-federalism', name: 'Cooperative Federalism', topicId: 'federalism' },

  // Ancient India Subtopics
  { id: 'indus-valley', name: 'Indus Valley Civilization', topicId: 'ancient' },
  { id: 'vedic-period', name: 'Vedic Period', topicId: 'ancient' },
  { id: 'maurya-empire', name: 'Maurya Empire', topicId: 'ancient' },
  { id: 'gupta-empire', name: 'Gupta Empire', topicId: 'ancient' },
  { id: 'sangam-age', name: 'Sangam Age', topicId: 'ancient' },

  // Medieval India Subtopics
  { id: 'delhi-sultanate', name: 'Delhi Sultanate', topicId: 'medieval' },
  { id: 'mughal-empire', name: 'Mughal Empire', topicId: 'medieval' },
  { id: 'vijayanagara', name: 'Vijayanagara Empire', topicId: 'medieval' },
  { id: 'bhakti-movement', name: 'Bhakti Movement', topicId: 'medieval' },
  { id: 'regional-kingdoms', name: 'Regional Kingdoms', topicId: 'medieval' },

  // Modern India Subtopics
  { id: 'british-rule', name: 'British Rule', topicId: 'modern' },
  { id: 'socio-religious', name: 'Socio-Religious Reforms', topicId: 'modern' },
  { id: 'revolt-1857', name: 'Revolt of 1857', topicId: 'modern' },
  { id: 'economic-impact', name: 'Economic Impact of British', topicId: 'modern' },
  { id: 'education-press', name: 'Education & Press', topicId: 'modern' },

  // Freedom Struggle Subtopics
  { id: 'inc-formation', name: 'Formation of INC', topicId: 'freedom' },
  { id: 'gandhi-era', name: 'Gandhian Era', topicId: 'freedom' },
  { id: 'civil-disobedience', name: 'Civil Disobedience', topicId: 'freedom' },
  { id: 'quit-india', name: 'Quit India Movement', topicId: 'freedom' },
  { id: 'partition', name: 'Partition & Independence', topicId: 'freedom' },

  // Post-Independence Subtopics
  { id: 'integration', name: 'Integration of States', topicId: 'post-independence' },
  { id: 'five-year-plans', name: 'Five Year Plans', topicId: 'post-independence' },
  { id: 'green-revolution', name: 'Green Revolution', topicId: 'post-independence' },
  { id: 'foreign-policy', name: 'Foreign Policy (NAM)', topicId: 'post-independence' },
  { id: 'wars', name: 'Indo-Pak & Indo-China Wars', topicId: 'post-independence' },

  // Physical Geography Subtopics
  { id: 'himalayas', name: 'The Himalayas', topicId: 'physical' },
  { id: 'northern-plains', name: 'Northern Plains', topicId: 'physical' },
  { id: 'peninsular-plateau', name: 'Peninsular Plateau', topicId: 'physical' },
  { id: 'coastal-plains', name: 'Coastal Plains', topicId: 'physical' },
  { id: 'islands', name: 'Islands of India', topicId: 'physical' },

  // Climate Subtopics
  { id: 'monsoons', name: 'Monsoon System', topicId: 'climate' },
  { id: 'seasons', name: 'Seasons of India', topicId: 'climate' },
  { id: 'rainfall', name: 'Rainfall Distribution', topicId: 'climate' },
  { id: 'climate-regions', name: 'Climatic Regions', topicId: 'climate' },
  { id: 'climate-change', name: 'Climate Change Impact', topicId: 'climate' },

  // Rivers & Drainage Subtopics
  { id: 'himalayan-rivers', name: 'Himalayan Rivers', topicId: 'rivers' },
  { id: 'peninsular-rivers', name: 'Peninsular Rivers', topicId: 'rivers' },
  { id: 'drainage-patterns', name: 'Drainage Patterns', topicId: 'rivers' },
  { id: 'river-linking', name: 'River Linking Projects', topicId: 'rivers' },
  { id: 'water-resources', name: 'Water Resources', topicId: 'rivers' },

  // Natural Resources Subtopics
  { id: 'minerals', name: 'Mineral Resources', topicId: 'resources' },
  { id: 'energy', name: 'Energy Resources', topicId: 'resources' },
  { id: 'forests', name: 'Forest Resources', topicId: 'resources' },
  { id: 'soil-types', name: 'Soil Types', topicId: 'resources' },
  { id: 'biodiversity', name: 'Biodiversity', topicId: 'resources' },

  // Economic Geography Subtopics
  { id: 'agriculture', name: 'Agriculture', topicId: 'economic' },
  { id: 'industries', name: 'Industrial Regions', topicId: 'economic' },
  { id: 'transport', name: 'Transport Networks', topicId: 'economic' },
  { id: 'trade', name: 'Trade & Commerce', topicId: 'economic' },
  { id: 'population', name: 'Population Distribution', topicId: 'economic' }
];

// Sub-subtopics (3-7 per subtopic)
const SUB_SUBTOPICS: SubSubtopic[] = [
  // ========== POLITY - CONSTITUTION ==========
  // Preamble
  { id: 'preamble-1', name: 'Sovereignty', subtopicId: 'preamble' },
  { id: 'preamble-2', name: 'Socialist', subtopicId: 'preamble' },
  { id: 'preamble-3', name: 'Secular', subtopicId: 'preamble' },
  { id: 'preamble-4', name: 'Democratic', subtopicId: 'preamble' },
  { id: 'preamble-5', name: 'Republic', subtopicId: 'preamble' },
  { id: 'preamble-6', name: 'Justice, Liberty, Equality', subtopicId: 'preamble' },

  // Fundamental Rights
  { id: 'fr-1', name: 'Right to Equality (Art 14-18)', subtopicId: 'fundamental-rights' },
  { id: 'fr-2', name: 'Right to Freedom (Art 19-22)', subtopicId: 'fundamental-rights' },
  { id: 'fr-3', name: 'Right Against Exploitation (Art 23-24)', subtopicId: 'fundamental-rights' },
  { id: 'fr-4', name: 'Right to Religion (Art 25-28)', subtopicId: 'fundamental-rights' },
  { id: 'fr-5', name: 'Cultural & Educational Rights (Art 29-30)', subtopicId: 'fundamental-rights' },
  { id: 'fr-6', name: 'Right to Constitutional Remedies (Art 32)', subtopicId: 'fundamental-rights' },
  { id: 'fr-7', name: 'Right to Privacy', subtopicId: 'fundamental-rights' },

  // DPSP
  { id: 'dpsp-1', name: 'Socialistic Principles', subtopicId: 'dpsp' },
  { id: 'dpsp-2', name: 'Gandhian Principles', subtopicId: 'dpsp' },
  { id: 'dpsp-3', name: 'Liberal-Intellectual Principles', subtopicId: 'dpsp' },
  { id: 'dpsp-4', name: 'Uniform Civil Code', subtopicId: 'dpsp' },
  { id: 'dpsp-5', name: 'Separation of Judiciary', subtopicId: 'dpsp' },

  // Fundamental Duties
  { id: 'fd-1', name: 'Respect Constitution & National Symbols', subtopicId: 'fundamental-duties' },
  { id: 'fd-2', name: 'Cherish Freedom Struggle Ideals', subtopicId: 'fundamental-duties' },
  { id: 'fd-3', name: 'Protect Sovereignty & Integrity', subtopicId: 'fundamental-duties' },
  { id: 'fd-4', name: 'Defend the Country', subtopicId: 'fundamental-duties' },
  { id: 'fd-5', name: 'Promote Harmony', subtopicId: 'fundamental-duties' },
  { id: 'fd-6', name: 'Preserve Heritage & Culture', subtopicId: 'fundamental-duties' },

  // Amendments
  { id: 'amend-1', name: '1st Amendment (1951)', subtopicId: 'amendments' },
  { id: 'amend-2', name: '42nd Amendment (1976)', subtopicId: 'amendments' },
  { id: 'amend-3', name: '44th Amendment (1978)', subtopicId: 'amendments' },
  { id: 'amend-4', name: '73rd & 74th Amendments', subtopicId: 'amendments' },
  { id: 'amend-5', name: '86th Amendment (RTE)', subtopicId: 'amendments' },
  { id: 'amend-6', name: '101st Amendment (GST)', subtopicId: 'amendments' },
  { id: 'amend-7', name: 'Basic Structure Doctrine', subtopicId: 'amendments' },

  // ========== POLITY - PARLIAMENT ==========
  // Lok Sabha
  { id: 'ls-1', name: 'Composition & Strength', subtopicId: 'lok-sabha' },
  { id: 'ls-2', name: 'Speaker & Deputy Speaker', subtopicId: 'lok-sabha' },
  { id: 'ls-3', name: 'Term & Dissolution', subtopicId: 'lok-sabha' },
  { id: 'ls-4', name: 'Money Bills', subtopicId: 'lok-sabha' },
  { id: 'ls-5', name: 'No Confidence Motion', subtopicId: 'lok-sabha' },

  // Rajya Sabha
  { id: 'rs-1', name: 'Composition & Election', subtopicId: 'rajya-sabha' },
  { id: 'rs-2', name: 'Chairman & Deputy Chairman', subtopicId: 'rajya-sabha' },
  { id: 'rs-3', name: 'Special Powers', subtopicId: 'rajya-sabha' },
  { id: 'rs-4', name: 'Nominated Members', subtopicId: 'rajya-sabha' },
  { id: 'rs-5', name: 'Permanent House Concept', subtopicId: 'rajya-sabha' },

  // Parliamentary Procedures
  { id: 'pp-1', name: 'Question Hour', subtopicId: 'parliamentary-procedures' },
  { id: 'pp-2', name: 'Zero Hour', subtopicId: 'parliamentary-procedures' },
  { id: 'pp-3', name: 'Adjournment Motion', subtopicId: 'parliamentary-procedures' },
  { id: 'pp-4', name: 'Calling Attention Motion', subtopicId: 'parliamentary-procedures' },
  { id: 'pp-5', name: 'Censure Motion', subtopicId: 'parliamentary-procedures' },
  { id: 'pp-6', name: 'Cut Motions', subtopicId: 'parliamentary-procedures' },

  // Committees
  { id: 'com-1', name: 'Public Accounts Committee', subtopicId: 'committees' },
  { id: 'com-2', name: 'Estimates Committee', subtopicId: 'committees' },
  { id: 'com-3', name: 'Committee on Public Undertakings', subtopicId: 'committees' },
  { id: 'com-4', name: 'Standing Committees', subtopicId: 'committees' },
  { id: 'com-5', name: 'Joint Parliamentary Committee', subtopicId: 'committees' },

  // Legislation
  { id: 'leg-1', name: 'Ordinary Bills', subtopicId: 'legislation' },
  { id: 'leg-2', name: 'Money Bills', subtopicId: 'legislation' },
  { id: 'leg-3', name: 'Financial Bills', subtopicId: 'legislation' },
  { id: 'leg-4', name: 'Constitutional Amendment Bills', subtopicId: 'legislation' },
  { id: 'leg-5', name: 'Joint Sitting', subtopicId: 'legislation' },
  { id: 'leg-6', name: 'Ordinances', subtopicId: 'legislation' },

  // ========== POLITY - JUDICIARY ==========
  // Supreme Court
  { id: 'sc-1', name: 'Composition & Appointment', subtopicId: 'supreme-court' },
  { id: 'sc-2', name: 'Original Jurisdiction', subtopicId: 'supreme-court' },
  { id: 'sc-3', name: 'Appellate Jurisdiction', subtopicId: 'supreme-court' },
  { id: 'sc-4', name: 'Advisory Jurisdiction', subtopicId: 'supreme-court' },
  { id: 'sc-5', name: 'Collegium System', subtopicId: 'supreme-court' },
  { id: 'sc-6', name: 'Landmark Judgments', subtopicId: 'supreme-court' },

  // High Courts
  { id: 'hc-1', name: 'Composition & Appointment', subtopicId: 'high-courts' },
  { id: 'hc-2', name: 'Original Jurisdiction', subtopicId: 'high-courts' },
  { id: 'hc-3', name: 'Writ Jurisdiction', subtopicId: 'high-courts' },
  { id: 'hc-4', name: 'Appellate Jurisdiction', subtopicId: 'high-courts' },
  { id: 'hc-5', name: 'Administrative Control', subtopicId: 'high-courts' },

  // Subordinate Courts
  { id: 'sub-1', name: 'District Courts', subtopicId: 'subordinate-courts' },
  { id: 'sub-2', name: 'Sessions Courts', subtopicId: 'subordinate-courts' },
  { id: 'sub-3', name: 'Lok Adalats', subtopicId: 'subordinate-courts' },
  { id: 'sub-4', name: 'Family Courts', subtopicId: 'subordinate-courts' },
  { id: 'sub-5', name: 'Consumer Courts', subtopicId: 'subordinate-courts' },

  // Judicial Review
  { id: 'jr-1', name: 'Constitutional Basis', subtopicId: 'judicial-review' },
  { id: 'jr-2', name: 'Scope & Limitations', subtopicId: 'judicial-review' },
  { id: 'jr-3', name: 'Judicial Activism', subtopicId: 'judicial-review' },
  { id: 'jr-4', name: 'Judicial Restraint', subtopicId: 'judicial-review' },

  // PIL
  { id: 'pil-1', name: 'Origin & Development', subtopicId: 'pil' },
  { id: 'pil-2', name: 'Locus Standi', subtopicId: 'pil' },
  { id: 'pil-3', name: 'Landmark PIL Cases', subtopicId: 'pil' },
  { id: 'pil-4', name: 'Criticism & Misuse', subtopicId: 'pil' },

  // ========== POLITY - EXECUTIVE ==========
  // President
  { id: 'pres-1', name: 'Election Process', subtopicId: 'president' },
  { id: 'pres-2', name: 'Executive Powers', subtopicId: 'president' },
  { id: 'pres-3', name: 'Legislative Powers', subtopicId: 'president' },
  { id: 'pres-4', name: 'Judicial Powers', subtopicId: 'president' },
  { id: 'pres-5', name: 'Emergency Powers', subtopicId: 'president' },
  { id: 'pres-6', name: 'Veto Powers', subtopicId: 'president' },

  // Prime Minister
  { id: 'pm-1', name: 'Appointment', subtopicId: 'prime-minister' },
  { id: 'pm-2', name: 'Powers & Functions', subtopicId: 'prime-minister' },
  { id: 'pm-3', name: 'Relationship with President', subtopicId: 'prime-minister' },
  { id: 'pm-4', name: 'PMO Structure', subtopicId: 'prime-minister' },
  { id: 'pm-5', name: 'Cabinet System', subtopicId: 'prime-minister' },

  // Council of Ministers
  { id: 'com-min-1', name: 'Cabinet Ministers', subtopicId: 'council-ministers' },
  { id: 'com-min-2', name: 'Ministers of State', subtopicId: 'council-ministers' },
  { id: 'com-min-3', name: 'Deputy Ministers', subtopicId: 'council-ministers' },
  { id: 'com-min-4', name: 'Collective Responsibility', subtopicId: 'council-ministers' },
  { id: 'com-min-5', name: 'Individual Responsibility', subtopicId: 'council-ministers' },

  // Governor
  { id: 'gov-1', name: 'Appointment & Term', subtopicId: 'governor' },
  { id: 'gov-2', name: 'Executive Powers', subtopicId: 'governor' },
  { id: 'gov-3', name: 'Legislative Powers', subtopicId: 'governor' },
  { id: 'gov-4', name: 'Discretionary Powers', subtopicId: 'governor' },
  { id: 'gov-5', name: 'Role in President\'s Rule', subtopicId: 'governor' },

  // Chief Minister
  { id: 'cm-1', name: 'Appointment', subtopicId: 'chief-minister' },
  { id: 'cm-2', name: 'Powers & Functions', subtopicId: 'chief-minister' },
  { id: 'cm-3', name: 'Relationship with Governor', subtopicId: 'chief-minister' },
  { id: 'cm-4', name: 'State Cabinet', subtopicId: 'chief-minister' },

  // ========== POLITY - FEDERALISM ==========
  // Centre-State Relations
  { id: 'csr-1', name: 'Legislative Relations', subtopicId: 'center-state' },
  { id: 'csr-2', name: 'Administrative Relations', subtopicId: 'center-state' },
  { id: 'csr-3', name: 'Financial Relations', subtopicId: 'center-state' },
  { id: 'csr-4', name: 'Sarkaria Commission', subtopicId: 'center-state' },
  { id: 'csr-5', name: 'Punchhi Commission', subtopicId: 'center-state' },

  // Inter-State Relations
  { id: 'isr-1', name: 'Inter-State Water Disputes', subtopicId: 'inter-state' },
  { id: 'isr-2', name: 'Inter-State Council', subtopicId: 'inter-state' },
  { id: 'isr-3', name: 'Zonal Councils', subtopicId: 'inter-state' },
  { id: 'isr-4', name: 'Full Faith & Credit', subtopicId: 'inter-state' },

  // Finance Commission
  { id: 'fc-1', name: 'Constitutional Provisions', subtopicId: 'finance-commission' },
  { id: 'fc-2', name: 'Composition', subtopicId: 'finance-commission' },
  { id: 'fc-3', name: 'Functions', subtopicId: 'finance-commission' },
  { id: 'fc-4', name: 'Tax Devolution', subtopicId: 'finance-commission' },
  { id: 'fc-5', name: 'Recent Finance Commissions', subtopicId: 'finance-commission' },

  // GST Council
  { id: 'gst-1', name: 'Composition', subtopicId: 'gst-council' },
  { id: 'gst-2', name: 'Voting Mechanism', subtopicId: 'gst-council' },
  { id: 'gst-3', name: 'Functions', subtopicId: 'gst-council' },
  { id: 'gst-4', name: 'GST Rates & Slabs', subtopicId: 'gst-council' },

  // Cooperative Federalism
  { id: 'cf-1', name: 'NITI Aayog', subtopicId: 'cooperative-federalism' },
  { id: 'cf-2', name: 'Governing Council', subtopicId: 'cooperative-federalism' },
  { id: 'cf-3', name: 'Competitive Federalism', subtopicId: 'cooperative-federalism' },
  { id: 'cf-4', name: 'Aspirational Districts', subtopicId: 'cooperative-federalism' },
  { id: 'cf-5', name: 'Centrally Sponsored Schemes', subtopicId: 'cooperative-federalism' },

  // ========== HISTORY - ANCIENT ==========
  // Indus Valley
  { id: 'iv-1', name: 'Harappa & Mohenjo-daro', subtopicId: 'indus-valley' },
  { id: 'iv-2', name: 'Town Planning', subtopicId: 'indus-valley' },
  { id: 'iv-3', name: 'Economic Life', subtopicId: 'indus-valley' },
  { id: 'iv-4', name: 'Art & Craft', subtopicId: 'indus-valley' },
  { id: 'iv-5', name: 'Decline Theories', subtopicId: 'indus-valley' },

  // Vedic Period
  { id: 'vp-1', name: 'Rigvedic Society', subtopicId: 'vedic-period' },
  { id: 'vp-2', name: 'Later Vedic Period', subtopicId: 'vedic-period' },
  { id: 'vp-3', name: 'Varna System', subtopicId: 'vedic-period' },
  { id: 'vp-4', name: 'Political Organization', subtopicId: 'vedic-period' },
  { id: 'vp-5', name: 'Religious Practices', subtopicId: 'vedic-period' },
  { id: 'vp-6', name: 'Literature', subtopicId: 'vedic-period' },

  // Maurya Empire
  { id: 'me-1', name: 'Chandragupta Maurya', subtopicId: 'maurya-empire' },
  { id: 'me-2', name: 'Ashoka the Great', subtopicId: 'maurya-empire' },
  { id: 'me-3', name: 'Administration', subtopicId: 'maurya-empire' },
  { id: 'me-4', name: 'Arthashastra', subtopicId: 'maurya-empire' },
  { id: 'me-5', name: 'Dhamma Policy', subtopicId: 'maurya-empire' },
  { id: 'me-6', name: 'Decline', subtopicId: 'maurya-empire' },

  // Gupta Empire
  { id: 'ge-1', name: 'Samudragupta', subtopicId: 'gupta-empire' },
  { id: 'ge-2', name: 'Chandragupta II', subtopicId: 'gupta-empire' },
  { id: 'ge-3', name: 'Golden Age of India', subtopicId: 'gupta-empire' },
  { id: 'ge-4', name: 'Art & Architecture', subtopicId: 'gupta-empire' },
  { id: 'ge-5', name: 'Science & Literature', subtopicId: 'gupta-empire' },

  // Sangam Age
  { id: 'sa-1', name: 'Chera Dynasty', subtopicId: 'sangam-age' },
  { id: 'sa-2', name: 'Chola Dynasty', subtopicId: 'sangam-age' },
  { id: 'sa-3', name: 'Pandya Dynasty', subtopicId: 'sangam-age' },
  { id: 'sa-4', name: 'Sangam Literature', subtopicId: 'sangam-age' },
  { id: 'sa-5', name: 'Trade & Economy', subtopicId: 'sangam-age' },

  // ========== HISTORY - MEDIEVAL ==========
  // Delhi Sultanate
  { id: 'ds-1', name: 'Slave Dynasty', subtopicId: 'delhi-sultanate' },
  { id: 'ds-2', name: 'Khalji Dynasty', subtopicId: 'delhi-sultanate' },
  { id: 'ds-3', name: 'Tughlaq Dynasty', subtopicId: 'delhi-sultanate' },
  { id: 'ds-4', name: 'Sayyid & Lodi Dynasty', subtopicId: 'delhi-sultanate' },
  { id: 'ds-5', name: 'Administration', subtopicId: 'delhi-sultanate' },
  { id: 'ds-6', name: 'Architecture', subtopicId: 'delhi-sultanate' },

  // Mughal Empire
  { id: 'mug-1', name: 'Babur & Foundation', subtopicId: 'mughal-empire' },
  { id: 'mug-2', name: 'Akbar\'s Reign', subtopicId: 'mughal-empire' },
  { id: 'mug-3', name: 'Jahangir & Shah Jahan', subtopicId: 'mughal-empire' },
  { id: 'mug-4', name: 'Aurangzeb\'s Reign', subtopicId: 'mughal-empire' },
  { id: 'mug-5', name: 'Mansabdari System', subtopicId: 'mughal-empire' },
  { id: 'mug-6', name: 'Mughal Architecture', subtopicId: 'mughal-empire' },
  { id: 'mug-7', name: 'Decline of Mughals', subtopicId: 'mughal-empire' },

  // Vijayanagara
  { id: 'vij-1', name: 'Sangama Dynasty', subtopicId: 'vijayanagara' },
  { id: 'vij-2', name: 'Krishnadevaraya', subtopicId: 'vijayanagara' },
  { id: 'vij-3', name: 'Administration', subtopicId: 'vijayanagara' },
  { id: 'vij-4', name: 'Art & Architecture', subtopicId: 'vijayanagara' },
  { id: 'vij-5', name: 'Battle of Talikota', subtopicId: 'vijayanagara' },

  // Bhakti Movement
  { id: 'bm-1', name: 'Ramanuja', subtopicId: 'bhakti-movement' },
  { id: 'bm-2', name: 'Kabir', subtopicId: 'bhakti-movement' },
  { id: 'bm-3', name: 'Guru Nanak', subtopicId: 'bhakti-movement' },
  { id: 'bm-4', name: 'Chaitanya', subtopicId: 'bhakti-movement' },
  { id: 'bm-5', name: 'Mirabai', subtopicId: 'bhakti-movement' },
  { id: 'bm-6', name: 'Sufi Movement', subtopicId: 'bhakti-movement' },

  // Regional Kingdoms
  { id: 'rk-1', name: 'Marathas', subtopicId: 'regional-kingdoms' },
  { id: 'rk-2', name: 'Rajputs', subtopicId: 'regional-kingdoms' },
  { id: 'rk-3', name: 'Sikhs', subtopicId: 'regional-kingdoms' },
  { id: 'rk-4', name: 'Mysore Kingdom', subtopicId: 'regional-kingdoms' },
  { id: 'rk-5', name: 'Awadh & Bengal', subtopicId: 'regional-kingdoms' },

  // ========== HISTORY - MODERN ==========
  // British Rule
  { id: 'br-1', name: 'East India Company', subtopicId: 'british-rule' },
  { id: 'br-2', name: 'Battle of Plassey', subtopicId: 'british-rule' },
  { id: 'br-3', name: 'Subsidiary Alliance', subtopicId: 'british-rule' },
  { id: 'br-4', name: 'Doctrine of Lapse', subtopicId: 'british-rule' },
  { id: 'br-5', name: 'Crown Rule', subtopicId: 'british-rule' },

  // Socio-Religious Reforms
  { id: 'sr-1', name: 'Raja Ram Mohan Roy', subtopicId: 'socio-religious' },
  { id: 'sr-2', name: 'Brahmo Samaj', subtopicId: 'socio-religious' },
  { id: 'sr-3', name: 'Arya Samaj', subtopicId: 'socio-religious' },
  { id: 'sr-4', name: 'Ramakrishna Mission', subtopicId: 'socio-religious' },
  { id: 'sr-5', name: 'Widow Remarriage', subtopicId: 'socio-religious' },
  { id: 'sr-6', name: 'Abolition of Sati', subtopicId: 'socio-religious' },

  // Revolt 1857
  { id: 'r1857-1', name: 'Causes', subtopicId: 'revolt-1857' },
  { id: 'r1857-2', name: 'Key Leaders', subtopicId: 'revolt-1857' },
  { id: 'r1857-3', name: 'Centers of Revolt', subtopicId: 'revolt-1857' },
  { id: 'r1857-4', name: 'Suppression', subtopicId: 'revolt-1857' },
  { id: 'r1857-5', name: 'Consequences', subtopicId: 'revolt-1857' },

  // Economic Impact
  { id: 'ei-1', name: 'Drain of Wealth', subtopicId: 'economic-impact' },
  { id: 'ei-2', name: 'De-industrialization', subtopicId: 'economic-impact' },
  { id: 'ei-3', name: 'Commercialization of Agriculture', subtopicId: 'economic-impact' },
  { id: 'ei-4', name: 'Land Revenue Systems', subtopicId: 'economic-impact' },
  { id: 'ei-5', name: 'Famines', subtopicId: 'economic-impact' },

  // Education & Press
  { id: 'ep-1', name: 'Wood\'s Despatch', subtopicId: 'education-press' },
  { id: 'ep-2', name: 'Hunter Commission', subtopicId: 'education-press' },
  { id: 'ep-3', name: 'Vernacular Press Act', subtopicId: 'education-press' },
  { id: 'ep-4', name: 'Role of Press', subtopicId: 'education-press' },

  // ========== HISTORY - FREEDOM STRUGGLE ==========
  // INC Formation
  { id: 'inc-1', name: 'A.O. Hume', subtopicId: 'inc-formation' },
  { id: 'inc-2', name: 'Early Nationalists', subtopicId: 'inc-formation' },
  { id: 'inc-3', name: 'Moderates', subtopicId: 'inc-formation' },
  { id: 'inc-4', name: 'Extremists', subtopicId: 'inc-formation' },
  { id: 'inc-5', name: 'Surat Split', subtopicId: 'inc-formation' },

  // Gandhian Era
  { id: 'gandhi-1', name: 'Champaran Satyagraha', subtopicId: 'gandhi-era' },
  { id: 'gandhi-2', name: 'Kheda Satyagraha', subtopicId: 'gandhi-era' },
  { id: 'gandhi-3', name: 'Ahmedabad Mill Strike', subtopicId: 'gandhi-era' },
  { id: 'gandhi-4', name: 'Non-Cooperation Movement', subtopicId: 'gandhi-era' },
  { id: 'gandhi-5', name: 'Khilafat Movement', subtopicId: 'gandhi-era' },
  { id: 'gandhi-6', name: 'Salt Satyagraha', subtopicId: 'gandhi-era' },

  // Civil Disobedience
  { id: 'cd-1', name: 'Dandi March', subtopicId: 'civil-disobedience' },
  { id: 'cd-2', name: 'First Round Table', subtopicId: 'civil-disobedience' },
  { id: 'cd-3', name: 'Gandhi-Irwin Pact', subtopicId: 'civil-disobedience' },
  { id: 'cd-4', name: 'Second Round Table', subtopicId: 'civil-disobedience' },
  { id: 'cd-5', name: 'Poona Pact', subtopicId: 'civil-disobedience' },

  // Quit India
  { id: 'qi-1', name: 'Do or Die Call', subtopicId: 'quit-india' },
  { id: 'qi-2', name: 'Parallel Governments', subtopicId: 'quit-india' },
  { id: 'qi-3', name: 'Underground Movement', subtopicId: 'quit-india' },
  { id: 'qi-4', name: 'INA & Subhas Bose', subtopicId: 'quit-india' },
  { id: 'qi-5', name: 'RIN Mutiny', subtopicId: 'quit-india' },

  // Partition
  { id: 'part-1', name: 'Two Nation Theory', subtopicId: 'partition' },
  { id: 'part-2', name: 'Cabinet Mission', subtopicId: 'partition' },
  { id: 'part-3', name: 'Mountbatten Plan', subtopicId: 'partition' },
  { id: 'part-4', name: 'Independence Act 1947', subtopicId: 'partition' },
  { id: 'part-5', name: 'Communal Violence', subtopicId: 'partition' },

  // ========== HISTORY - POST-INDEPENDENCE ==========
  // Integration
  { id: 'int-1', name: 'Sardar Patel\'s Role', subtopicId: 'integration' },
  { id: 'int-2', name: 'Hyderabad', subtopicId: 'integration' },
  { id: 'int-3', name: 'Junagadh', subtopicId: 'integration' },
  { id: 'int-4', name: 'Kashmir Accession', subtopicId: 'integration' },
  { id: 'int-5', name: 'States Reorganization', subtopicId: 'integration' },

  // Five Year Plans
  { id: 'fyp-1', name: 'First Five Year Plan', subtopicId: 'five-year-plans' },
  { id: 'fyp-2', name: 'Second Plan (Mahalanobis)', subtopicId: 'five-year-plans' },
  { id: 'fyp-3', name: 'Third Plan', subtopicId: 'five-year-plans' },
  { id: 'fyp-4', name: 'Planning Commission', subtopicId: 'five-year-plans' },
  { id: 'fyp-5', name: 'LPG Reforms 1991', subtopicId: 'five-year-plans' },

  // Green Revolution
  { id: 'gr-1', name: 'M.S. Swaminathan', subtopicId: 'green-revolution' },
  { id: 'gr-2', name: 'HYV Seeds', subtopicId: 'green-revolution' },
  { id: 'gr-3', name: 'Impact on Punjab', subtopicId: 'green-revolution' },
  { id: 'gr-4', name: 'Food Security', subtopicId: 'green-revolution' },
  { id: 'gr-5', name: 'Criticisms', subtopicId: 'green-revolution' },

  // Foreign Policy
  { id: 'fp-1', name: 'Non-Alignment', subtopicId: 'foreign-policy' },
  { id: 'fp-2', name: 'Panchsheel', subtopicId: 'foreign-policy' },
  { id: 'fp-3', name: 'Bandung Conference', subtopicId: 'foreign-policy' },
  { id: 'fp-4', name: 'Indo-Soviet Treaty', subtopicId: 'foreign-policy' },

  // Wars
  { id: 'war-1', name: '1962 Indo-China War', subtopicId: 'wars' },
  { id: 'war-2', name: '1965 Indo-Pak War', subtopicId: 'wars' },
  { id: 'war-3', name: '1971 Bangladesh Liberation', subtopicId: 'wars' },
  { id: 'war-4', name: 'Kargil War 1999', subtopicId: 'wars' },
  { id: 'war-5', name: 'Shimla Agreement', subtopicId: 'wars' },

  // ========== GEOGRAPHY - PHYSICAL ==========
  // Himalayas
  { id: 'him-1', name: 'Greater Himalayas', subtopicId: 'himalayas' },
  { id: 'him-2', name: 'Lesser Himalayas', subtopicId: 'himalayas' },
  { id: 'him-3', name: 'Shiwaliks', subtopicId: 'himalayas' },
  { id: 'him-4', name: 'Important Passes', subtopicId: 'himalayas' },
  { id: 'him-5', name: 'Glaciers', subtopicId: 'himalayas' },
  { id: 'him-6', name: 'Trans Himalayas', subtopicId: 'himalayas' },

  // Northern Plains
  { id: 'np-1', name: 'Bhabar', subtopicId: 'northern-plains' },
  { id: 'np-2', name: 'Terai', subtopicId: 'northern-plains' },
  { id: 'np-3', name: 'Bhangar & Khadar', subtopicId: 'northern-plains' },
  { id: 'np-4', name: 'Doabs', subtopicId: 'northern-plains' },
  { id: 'np-5', name: 'Delta Region', subtopicId: 'northern-plains' },

  // Peninsular Plateau
  { id: 'pp-geo-1', name: 'Deccan Plateau', subtopicId: 'peninsular-plateau' },
  { id: 'pp-geo-2', name: 'Western Ghats', subtopicId: 'peninsular-plateau' },
  { id: 'pp-geo-3', name: 'Eastern Ghats', subtopicId: 'peninsular-plateau' },
  { id: 'pp-geo-4', name: 'Malwa Plateau', subtopicId: 'peninsular-plateau' },
  { id: 'pp-geo-5', name: 'Chotanagpur Plateau', subtopicId: 'peninsular-plateau' },

  // Coastal Plains
  { id: 'cp-1', name: 'Konkan Coast', subtopicId: 'coastal-plains' },
  { id: 'cp-2', name: 'Malabar Coast', subtopicId: 'coastal-plains' },
  { id: 'cp-3', name: 'Coromandel Coast', subtopicId: 'coastal-plains' },
  { id: 'cp-4', name: 'Northern Circar', subtopicId: 'coastal-plains' },

  // Islands
  { id: 'isl-1', name: 'Andaman & Nicobar', subtopicId: 'islands' },
  { id: 'isl-2', name: 'Lakshadweep', subtopicId: 'islands' },
  { id: 'isl-3', name: 'Coral Islands', subtopicId: 'islands' },
  { id: 'isl-4', name: 'Volcanic Islands', subtopicId: 'islands' },

  // ========== GEOGRAPHY - CLIMATE ==========
  // Monsoons
  { id: 'mon-1', name: 'Southwest Monsoon', subtopicId: 'monsoons' },
  { id: 'mon-2', name: 'Northeast Monsoon', subtopicId: 'monsoons' },
  { id: 'mon-3', name: 'Monsoon Mechanism', subtopicId: 'monsoons' },
  { id: 'mon-4', name: 'Monsoon Break', subtopicId: 'monsoons' },
  { id: 'mon-5', name: 'El Nino & La Nina', subtopicId: 'monsoons' },

  // Seasons
  { id: 'sea-1', name: 'Winter Season', subtopicId: 'seasons' },
  { id: 'sea-2', name: 'Summer Season', subtopicId: 'seasons' },
  { id: 'sea-3', name: 'Monsoon Season', subtopicId: 'seasons' },
  { id: 'sea-4', name: 'Post-Monsoon', subtopicId: 'seasons' },

  // Rainfall
  { id: 'rain-1', name: 'Orographic Rainfall', subtopicId: 'rainfall' },
  { id: 'rain-2', name: 'Convectional Rainfall', subtopicId: 'rainfall' },
  { id: 'rain-3', name: 'Cyclonic Rainfall', subtopicId: 'rainfall' },
  { id: 'rain-4', name: 'Rainfall Variability', subtopicId: 'rainfall' },
  { id: 'rain-5', name: 'Drought Prone Areas', subtopicId: 'rainfall' },

  // Climate Regions
  { id: 'cr-1', name: 'Tropical Wet', subtopicId: 'climate-regions' },
  { id: 'cr-2', name: 'Tropical Wet & Dry', subtopicId: 'climate-regions' },
  { id: 'cr-3', name: 'Semi-Arid', subtopicId: 'climate-regions' },
  { id: 'cr-4', name: 'Arid', subtopicId: 'climate-regions' },
  { id: 'cr-5', name: 'Mountain Climate', subtopicId: 'climate-regions' },

  // Climate Change
  { id: 'cc-1', name: 'Global Warming Impact', subtopicId: 'climate-change' },
  { id: 'cc-2', name: 'Sea Level Rise', subtopicId: 'climate-change' },
  { id: 'cc-3', name: 'Extreme Weather Events', subtopicId: 'climate-change' },
  { id: 'cc-4', name: 'NAPCC', subtopicId: 'climate-change' },
  { id: 'cc-5', name: 'India\'s NDCs', subtopicId: 'climate-change' },

  // ========== GEOGRAPHY - RIVERS ==========
  // Himalayan Rivers
  { id: 'hr-1', name: 'Indus System', subtopicId: 'himalayan-rivers' },
  { id: 'hr-2', name: 'Ganga System', subtopicId: 'himalayan-rivers' },
  { id: 'hr-3', name: 'Brahmaputra System', subtopicId: 'himalayan-rivers' },
  { id: 'hr-4', name: 'Tributaries', subtopicId: 'himalayan-rivers' },
  { id: 'hr-5', name: 'River Course Changes', subtopicId: 'himalayan-rivers' },

  // Peninsular Rivers
  { id: 'pr-1', name: 'Mahanadi', subtopicId: 'peninsular-rivers' },
  { id: 'pr-2', name: 'Godavari', subtopicId: 'peninsular-rivers' },
  { id: 'pr-3', name: 'Krishna', subtopicId: 'peninsular-rivers' },
  { id: 'pr-4', name: 'Kaveri', subtopicId: 'peninsular-rivers' },
  { id: 'pr-5', name: 'Narmada & Tapti', subtopicId: 'peninsular-rivers' },

  // Drainage Patterns
  { id: 'dp-1', name: 'Dendritic Pattern', subtopicId: 'drainage-patterns' },
  { id: 'dp-2', name: 'Trellis Pattern', subtopicId: 'drainage-patterns' },
  { id: 'dp-3', name: 'Radial Pattern', subtopicId: 'drainage-patterns' },
  { id: 'dp-4', name: 'Centripetal Pattern', subtopicId: 'drainage-patterns' },

  // River Linking
  { id: 'rl-1', name: 'National Perspective Plan', subtopicId: 'river-linking' },
  { id: 'rl-2', name: 'Himalayan Component', subtopicId: 'river-linking' },
  { id: 'rl-3', name: 'Peninsular Component', subtopicId: 'river-linking' },
  { id: 'rl-4', name: 'Ken-Betwa Link', subtopicId: 'river-linking' },
  { id: 'rl-5', name: 'Challenges', subtopicId: 'river-linking' },

  // Water Resources
  { id: 'wr-1', name: 'Groundwater', subtopicId: 'water-resources' },
  { id: 'wr-2', name: 'Surface Water', subtopicId: 'water-resources' },
  { id: 'wr-3', name: 'Rainwater Harvesting', subtopicId: 'water-resources' },
  { id: 'wr-4', name: 'Watershed Management', subtopicId: 'water-resources' },
  { id: 'wr-5', name: 'Water Stress Regions', subtopicId: 'water-resources' },

  // ========== GEOGRAPHY - RESOURCES ==========
  // Minerals
  { id: 'min-1', name: 'Iron Ore', subtopicId: 'minerals' },
  { id: 'min-2', name: 'Coal', subtopicId: 'minerals' },
  { id: 'min-3', name: 'Bauxite', subtopicId: 'minerals' },
  { id: 'min-4', name: 'Manganese', subtopicId: 'minerals' },
  { id: 'min-5', name: 'Mica', subtopicId: 'minerals' },
  { id: 'min-6', name: 'Mineral Belts', subtopicId: 'minerals' },

  // Energy
  { id: 'eng-1', name: 'Thermal Power', subtopicId: 'energy' },
  { id: 'eng-2', name: 'Hydropower', subtopicId: 'energy' },
  { id: 'eng-3', name: 'Nuclear Power', subtopicId: 'energy' },
  { id: 'eng-4', name: 'Solar Energy', subtopicId: 'energy' },
  { id: 'eng-5', name: 'Wind Energy', subtopicId: 'energy' },
  { id: 'eng-6', name: 'Petroleum & Natural Gas', subtopicId: 'energy' },

  // Forests
  { id: 'for-1', name: 'Tropical Evergreen', subtopicId: 'forests' },
  { id: 'for-2', name: 'Tropical Deciduous', subtopicId: 'forests' },
  { id: 'for-3', name: 'Thorn Forests', subtopicId: 'forests' },
  { id: 'for-4', name: 'Montane Forests', subtopicId: 'forests' },
  { id: 'for-5', name: 'Mangrove Forests', subtopicId: 'forests' },

  // Soil Types
  { id: 'soil-1', name: 'Alluvial Soil', subtopicId: 'soil-types' },
  { id: 'soil-2', name: 'Black Soil (Regur)', subtopicId: 'soil-types' },
  { id: 'soil-3', name: 'Red & Yellow Soil', subtopicId: 'soil-types' },
  { id: 'soil-4', name: 'Laterite Soil', subtopicId: 'soil-types' },
  { id: 'soil-5', name: 'Arid Soil', subtopicId: 'soil-types' },
  { id: 'soil-6', name: 'Forest Soil', subtopicId: 'soil-types' },

  // Biodiversity
  { id: 'bio-1', name: 'Biodiversity Hotspots', subtopicId: 'biodiversity' },
  { id: 'bio-2', name: 'Endemic Species', subtopicId: 'biodiversity' },
  { id: 'bio-3', name: 'National Parks', subtopicId: 'biodiversity' },
  { id: 'bio-4', name: 'Wildlife Sanctuaries', subtopicId: 'biodiversity' },
  { id: 'bio-5', name: 'Biosphere Reserves', subtopicId: 'biodiversity' },
  { id: 'bio-6', name: 'Conservation Efforts', subtopicId: 'biodiversity' },

  // ========== GEOGRAPHY - ECONOMIC ==========
  // Agriculture
  { id: 'agri-1', name: 'Rice Cultivation', subtopicId: 'agriculture' },
  { id: 'agri-2', name: 'Wheat Cultivation', subtopicId: 'agriculture' },
  { id: 'agri-3', name: 'Commercial Crops', subtopicId: 'agriculture' },
  { id: 'agri-4', name: 'Plantation Crops', subtopicId: 'agriculture' },
  { id: 'agri-5', name: 'Irrigation Methods', subtopicId: 'agriculture' },
  { id: 'agri-6', name: 'Agricultural Regions', subtopicId: 'agriculture' },

  // Industries
  { id: 'ind-1', name: 'Iron & Steel', subtopicId: 'industries' },
  { id: 'ind-2', name: 'Textile Industry', subtopicId: 'industries' },
  { id: 'ind-3', name: 'IT Industry', subtopicId: 'industries' },
  { id: 'ind-4', name: 'Automobile Industry', subtopicId: 'industries' },
  { id: 'ind-5', name: 'Industrial Corridors', subtopicId: 'industries' },

  // Transport
  { id: 'trans-1', name: 'Railways', subtopicId: 'transport' },
  { id: 'trans-2', name: 'Roadways', subtopicId: 'transport' },
  { id: 'trans-3', name: 'Airways', subtopicId: 'transport' },
  { id: 'trans-4', name: 'Waterways', subtopicId: 'transport' },
  { id: 'trans-5', name: 'Pipelines', subtopicId: 'transport' },
  { id: 'trans-6', name: 'Major Ports', subtopicId: 'transport' },

  // Trade
  { id: 'trade-1', name: 'Export Items', subtopicId: 'trade' },
  { id: 'trade-2', name: 'Import Items', subtopicId: 'trade' },
  { id: 'trade-3', name: 'Trade Partners', subtopicId: 'trade' },
  { id: 'trade-4', name: 'SEZs', subtopicId: 'trade' },
  { id: 'trade-5', name: 'FTAs', subtopicId: 'trade' },

  // Population
  { id: 'pop-1', name: 'Population Density', subtopicId: 'population' },
  { id: 'pop-2', name: 'Rural-Urban Distribution', subtopicId: 'population' },
  { id: 'pop-3', name: 'Migration Patterns', subtopicId: 'population' },
  { id: 'pop-4', name: 'Demographic Transition', subtopicId: 'population' },
  { id: 'pop-5', name: 'Population Policies', subtopicId: 'population' }
];

// ============ HELPER FUNCTIONS ============

const createNode = (
  id: string,
  label: string,
  x: number,
  y: number,
  color: string
): Node<MindMapNodeData> => ({
  id,
  type: 'mindMapNode',
  position: { x, y },
  data: { label, color, isComplete: false }
});

const createEdge = (source: string, target: string): Edge => ({
  id: `e-${source}-${target}`,
  source,
  target,
  type: 'smoothstep',
  animated: false,
  style: { stroke: '#94A3B8', strokeWidth: 2 }
});

// ============ COMPONENT ============

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (name: string, nodes: Node<MindMapNodeData>[], edges: Edge[]) => void;
}

export function TemplateSelector({ isOpen, onClose, onSelectTemplate }: TemplateSelectorProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);

  // Get filtered data
  const filteredTopics = useMemo(() =>
    TOPICS.filter(t => t.subjectId === selectedSubject),
    [selectedSubject]
  );

  const filteredSubtopics = useMemo(() =>
    SUBTOPICS.filter(s => s.topicId === selectedTopic),
    [selectedTopic]
  );

  const currentSubject = SUBJECTS.find(s => s.id === selectedSubject);
  const currentTopic = TOPICS.find(t => t.id === selectedTopic);

  // Reset state when modal closes
  const handleClose = () => {
    setStep(1);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedSubtopics([]);
    onClose();
  };

  // Handle subject selection
  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedTopic(null);
    setSelectedSubtopics([]);
    setStep(2);
  };

  // Handle topic selection
  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setSelectedSubtopics([]);
    setStep(3);
  };

  // Handle subtopic toggle
  const handleSubtopicToggle = (subtopicId: string) => {
    setSelectedSubtopics(prev =>
      prev.includes(subtopicId)
        ? prev.filter(id => id !== subtopicId)
        : [...prev, subtopicId]
    );
  };

  // Generate mind map with 3 levels
  const handleCreate = () => {
    if (!currentTopic || selectedSubtopics.length === 0) return;

    const nodes: Node<MindMapNodeData>[] = [];
    const edges: Edge[] = [];
    const timestamp = Date.now();

    // Root node (Topic) - Blue - centered at top
    const rootId = `root-${timestamp}`;
    const centerX = 1500; // Center point for the map
    nodes.push(createNode(rootId, currentTopic.name, centerX, 50, '#3B82F6'));

    // Calculate subtopic positions - spread out wide
    const subtopicCount = selectedSubtopics.length;
    const subtopicSpacing = 600; // Wide spacing between subtopics
    const totalWidth = (subtopicCount - 1) * subtopicSpacing;
    const startX = centerX - totalWidth / 2;

    // Create subtopics and their sub-subtopics
    selectedSubtopics.forEach((subtopicId, index) => {
      const subtopic = SUBTOPICS.find(s => s.id === subtopicId);
      if (!subtopic) return;

      // Subtopic node - Orange
      const subtopicNodeId = `subtopic-${index}-${timestamp}`;
      const subtopicX = startX + (index * subtopicSpacing);
      nodes.push(createNode(subtopicNodeId, subtopic.name, subtopicX, 250, '#F97316'));
      edges.push(createEdge(rootId, subtopicNodeId));

      // Get sub-subtopics for this subtopic
      const subSubtopics = SUB_SUBTOPICS.filter(ss => ss.subtopicId === subtopicId);

      // Create sub-subtopic nodes - Purple - spread vertically
      const subSubCount = subSubtopics.length;
      const subSubSpacingX = 200; // Horizontal spacing between sub-subtopics
      const subSubSpacingY = 120; // Vertical spacing for staggering
      const subSubTotalWidth = (subSubCount - 1) * subSubSpacingX;
      const subSubStartX = subtopicX - subSubTotalWidth / 2;

      subSubtopics.forEach((subSub, subIndex) => {
        const subSubNodeId = `subsub-${index}-${subIndex}-${timestamp}`;
        const subSubX = subSubStartX + (subIndex * subSubSpacingX);
        // Stagger vertically - alternate between two rows for better visibility
        const subSubY = 450 + (subIndex % 2) * subSubSpacingY;
        nodes.push(createNode(subSubNodeId, subSub.name, subSubX, subSubY, '#8B5CF6'));
        edges.push(createEdge(subtopicNodeId, subSubNodeId));
      });
    });

    const mapName = `${currentTopic.name} - Mind Map`;
    onSelectTemplate(mapName, nodes, edges);
    handleClose();
  };

  // Go back
  const handleBack = () => {
    if (step === 2) {
      setSelectedSubject(null);
      setStep(1);
    } else if (step === 3) {
      setSelectedTopic(null);
      setSelectedSubtopics([]);
      setStep(2);
    }
  };

  // Get sub-subtopic count for a subtopic
  const getSubSubtopicCount = (subtopicId: string) => {
    return SUB_SUBTOPICS.filter(ss => ss.subtopicId === subtopicId).length;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
              {/* Header */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-purple-500/10 to-brand-secondary/10" />
                <div className="relative flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    {step > 1 && (
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleBack}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                      </motion.button>
                    )}
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/30"
                    >
                      <Sparkles className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Create New Mind Map</h2>
                      {/* Breadcrumb */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                        <span className={step >= 1 ? 'text-brand-primary font-medium' : ''}>Subject</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className={step >= 2 ? 'text-brand-primary font-medium' : ''}>Topic</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className={step >= 3 ? 'text-brand-primary font-medium' : ''}>Subtopics</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[55vh]">
                <AnimatePresence mode="wait">
                  {/* Step 1: Subject Selection */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <p className="text-gray-600 mb-6">Select a subject to begin:</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {SUBJECTS.map((subject) => (
                          <motion.button
                            key={subject.id}
                            whileHover={{ scale: 1.03, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSubjectSelect(subject.id)}
                            className="relative group p-6 rounded-2xl border-2 border-gray-100 hover:border-transparent transition-all text-left overflow-hidden"
                          >
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                            />
                            <div
                              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center mb-4 shadow-lg`}
                              style={{ boxShadow: `0 8px 24px -4px ${subject.color}40` }}
                            >
                              <subject.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand-primary transition-colors">
                              {subject.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">5 topics available</p>
                            <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-gray-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Topic Selection */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex items-center gap-2 mb-6">
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentSubject?.gradient} flex items-center justify-center`}
                        >
                          {currentSubject && <currentSubject.icon className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-gray-600">
                          <span className="font-semibold text-gray-900">{currentSubject?.name}</span> - Select a topic:
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredTopics.map((topic) => (
                          <motion.button
                            key={topic.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleTopicSelect(topic.id)}
                            className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all text-left group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-brand-primary/10 flex items-center justify-center transition-colors">
                              <topic.icon className="w-6 h-6 text-gray-500 group-hover:text-brand-primary transition-colors" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
                                {topic.name}
                              </h3>
                              <p className="text-xs text-gray-500">5 subtopics</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Subtopic Selection */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex items-center gap-2 mb-6">
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentSubject?.gradient} flex items-center justify-center`}
                        >
                          {currentSubject && <currentSubject.icon className="w-4 h-4 text-white" />}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">{currentTopic?.name}</span>
                        <span className="text-gray-500">- Select subtopics:</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">
                        Select one or more subtopics. Each includes 3-7 detailed sub-points in the mind map:
                      </p>
                      <div className="space-y-2">
                        {filteredSubtopics.map((subtopic) => {
                          const isSelected = selectedSubtopics.includes(subtopic.id);
                          const subSubCount = getSubSubtopicCount(subtopic.id);
                          return (
                            <motion.button
                              key={subtopic.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleSubtopicToggle(subtopic.id)}
                              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                                isSelected
                                  ? 'border-brand-primary bg-brand-primary/5'
                                  : 'border-gray-100 hover:border-gray-200'
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {isSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                              </div>
                              <div className="flex-1">
                                <span className={`font-medium ${isSelected ? 'text-brand-primary' : 'text-gray-700'}`}>
                                  {subtopic.name}
                                </span>
                                <span className="text-xs text-gray-400 ml-2">
                                  ({subSubCount} sub-points)
                                </span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50" />
                <div className="relative p-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {step === 3 && selectedSubtopics.length > 0 && (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-primary" />
                        {selectedSubtopics.length} subtopic{selectedSubtopics.length !== 1 ? 's' : ''} selected
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClose}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      Cancel
                    </motion.button>
                    {step === 3 && (
                      <motion.button
                        whileHover={{ scale: selectedSubtopics.length > 0 ? 1.05 : 1 }}
                        whileTap={{ scale: selectedSubtopics.length > 0 ? 0.95 : 1 }}
                        onClick={handleCreate}
                        disabled={selectedSubtopics.length === 0}
                        className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                          selectedSubtopics.length > 0
                            ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/25'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Create Mind Map
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
