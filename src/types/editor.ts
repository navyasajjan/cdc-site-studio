// CDC Admin Dashboard Types

export type UserRole = 'cdc_admin' | 'cdc_editor' | 'practitioner' | 'receptionist';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface SiteSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  locked: boolean;
  order: number;
  content: Record<string, any>;
}

export type SectionType = 
  | 'hero'
  | 'about'
  | 'services'
  | 'therapists'
  | 'gallery'
  | 'booking'
  | 'analytics'
  | 'testimonials'
  | 'pricing'
  | 'learning'
  | 'contact'
  | 'footer';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  ageRange: string;
  therapistIds: string[];
  visible: boolean;
  order: number;
}

export interface Therapist {
  id: string;
  name: string;
  photo: string;
  specialization: string;
  experience: string;
  credentials: string;
  type: 'in-house' | 'visiting';
  visible: boolean;
  serviceIds: string[];
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  alt: string;
  tags: string[];
  order: number;
}

export interface Review {
  id: string;
  rating: number;
  content: string;
  date: string;
  approved: boolean;
  featured: boolean;
  reply?: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  type: 'session' | 'monthly' | 'assessment' | 'custom';
  price: number;
  description: string;
  features: string[];
  visible: boolean;
}

export interface SiteVersion {
  id: string;
  createdAt: string;
  createdBy: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduledFor?: string;
  sections: SiteSection[];
}

export interface EditorState {
  selectedSectionId: string | null;
  selectedElementId: string | null;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  zoom: number;
  isDragging: boolean;
  hasUnsavedChanges: boolean;
}

export interface CDCData {
  name: string;
  logo: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  workingHours: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}
