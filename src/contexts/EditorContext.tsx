import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { EditorState, SiteSection, SectionType } from '@/types/editor';
import { siteSections as initialSections, cdcData } from '@/data/mockData';

export interface SiteSettings {
  logo: string;
  logoPosition: 'left' | 'center' | 'right';
  logoSize: 'small' | 'medium' | 'large';
  showLogoInHero: boolean;
  showLogoInHeader: boolean;
  heroLogoPosition: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

interface EditorContextType {
  state: EditorState;
  sections: SiteSection[];
  siteSettings: SiteSettings;
  setSelectedSection: (id: string | null) => void;
  setSelectedElement: (id: string | null) => void;
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  setZoom: (zoom: number) => void;
  updateSection: (id: string, updates: Partial<SiteSection>) => void;
  updateSectionContent: (id: string, content: Record<string, any>) => void;
  updateSectionStyle: (id: string, style: Partial<SiteSection['style']>) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  toggleSectionVisibility: (id: string) => void;
  duplicateSection: (id: string) => void;
  setHasUnsavedChanges: (value: boolean) => void;
  saveDraft: () => void;
  publish: () => void;
  undo: () => void;
  redo: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const initialSiteSettings: SiteSettings = {
  logo: cdcData.logo,
  logoPosition: 'left',
  logoSize: 'medium',
  showLogoInHero: true,
  showLogoInHeader: true,
  heroLogoPosition: 'top-left',
};

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EditorState>({
    selectedSectionId: null,
    selectedElementId: null,
    previewMode: 'desktop',
    zoom: 100,
    isDragging: false,
    hasUnsavedChanges: false,
  });

  const [sections, setSections] = useState<SiteSection[]>(initialSections);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [history, setHistory] = useState<SiteSection[][]>([initialSections]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushToHistory = useCallback((newSections: SiteSection[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSections);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const setSelectedSection = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedSectionId: id, selectedElementId: null }));
  }, []);

  const setSelectedElement = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedElementId: id }));
  }, []);

  const setPreviewMode = useCallback((mode: 'desktop' | 'tablet' | 'mobile') => {
    setState(prev => ({ ...prev, previewMode: mode }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.min(200, Math.max(50, zoom)) }));
  }, []);

  const updateSection = useCallback((id: string, updates: Partial<SiteSection>) => {
    setSections(prev => {
      const newSections = prev.map(section =>
        section.id === id ? { ...section, ...updates } : section
      );
      pushToHistory(newSections);
      return newSections;
    });
    setState(prev => ({ ...prev, hasUnsavedChanges: true }));
  }, [pushToHistory]);

  const updateSectionContent = useCallback((id: string, content: Record<string, any>) => {
    setSections(prev => {
      const newSections = prev.map(section =>
        section.id === id ? { ...section, content: { ...section.content, ...content } } : section
      );
      pushToHistory(newSections);
      return newSections;
    });
    setState(prev => ({ ...prev, hasUnsavedChanges: true }));
  }, [pushToHistory]);

  const updateSectionStyle = useCallback((id: string, style: Partial<SiteSection['style']>) => {
    setSections(prev => {
      const newSections = prev.map(section =>
        section.id === id ? { 
          ...section, 
          style: { 
            ...(section.style || {
              paddingTop: 64,
              paddingBottom: 64,
              paddingLeft: 24,
              paddingRight: 24,
              textAlign: 'center' as const,
              backgroundColor: 'transparent',
              backgroundType: 'color' as const,
            }), 
            ...style 
          } 
        } : section
      );
      pushToHistory(newSections);
      return newSections;
    });
    setState(prev => ({ ...prev, hasUnsavedChanges: true }));
  }, [pushToHistory]);

  const updateSiteSettings = useCallback((settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...settings }));
    setState(prev => ({ ...prev, hasUnsavedChanges: true }));
  }, []);

  const reorderSections = useCallback((startIndex: number, endIndex: number) => {
    setSections(prev => {
      const newSections = [...prev];
      const [removed] = newSections.splice(startIndex, 1);
      newSections.splice(endIndex, 0, removed);
      const reordered = newSections.map((section, index) => ({
        ...section,
        order: index + 1,
      }));
      pushToHistory(reordered);
      return reordered;
    });
    setState(prev => ({ ...prev, hasUnsavedChanges: true }));
  }, [pushToHistory]);

  const toggleSectionVisibility = useCallback((id: string) => {
    setSections(prev => {
      const newSections = prev.map(section =>
        section.id === id ? { ...section, visible: !section.visible } : section
      );
      pushToHistory(newSections);
      return newSections;
    });
    setState(prev => ({ ...prev, hasUnsavedChanges: true }));
  }, [pushToHistory]);

  const duplicateSection = useCallback((id: string) => {
    setSections(prev => {
      const sectionIndex = prev.findIndex(s => s.id === id);
      if (sectionIndex === -1) return prev;

      const section = prev[sectionIndex];
      const newSection: SiteSection = {
        ...section,
        id: `${section.id}-copy-${Date.now()}`,
        title: `${section.title} (Copy)`,
        locked: false,
      };

      const newSections = [
        ...prev.slice(0, sectionIndex + 1),
        newSection,
        ...prev.slice(sectionIndex + 1),
      ].map((s, index) => ({ ...s, order: index + 1 }));

      pushToHistory(newSections);
      return newSections;
    });
    setState(prev => ({ ...prev, hasUnsavedChanges: true }));
  }, [pushToHistory]);

  const setHasUnsavedChanges = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, hasUnsavedChanges: value }));
  }, []);

  const saveDraft = useCallback(() => {
    // In a real app, this would save to backend
    console.log('Saving draft...', sections);
    setState(prev => ({ ...prev, hasUnsavedChanges: false }));
  }, [sections]);

  const publish = useCallback(() => {
    // In a real app, this would publish to production
    console.log('Publishing...', sections);
    setState(prev => ({ ...prev, hasUnsavedChanges: false }));
  }, [sections]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setSections(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setSections(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  return (
    <EditorContext.Provider
      value={{
        state,
        sections,
        siteSettings,
        setSelectedSection,
        setSelectedElement,
        setPreviewMode,
        setZoom,
        updateSection,
        updateSectionContent,
        updateSectionStyle,
        updateSiteSettings,
        reorderSections,
        toggleSectionVisibility,
        duplicateSection,
        setHasUnsavedChanges,
        saveDraft,
        publish,
        undo,
        redo,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
