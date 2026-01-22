import { useEditor } from '@/contexts/EditorContext';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { SectionNavigator } from '@/components/editor/SectionNavigator';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';

export default function SiteEditorPage() {
  return (
    <div className="h-full flex flex-col bg-editor-canvas">
      {/* Toolbar */}
      <EditorToolbar />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Section Navigator */}
        <div className="w-[260px] flex-shrink-0">
          <SectionNavigator />
        </div>

        {/* Canvas */}
        <EditorCanvas />

        {/* Properties Panel */}
        <div className="w-[300px] flex-shrink-0">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}
