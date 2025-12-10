import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Save,
  FileText,
  Trash2,
  Sparkles,
  Layers,
  MessageSquare,
  Keyboard,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

interface MindMapToolbarProps {
  onAddNode: (type: 'topic' | 'subtopic' | 'detail') => void;
  onSave: () => void;
  onNewMap: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  isSaving: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
}

// Button configurations for node types
const nodeTypes = [
  {
    type: 'topic' as const,
    label: 'Topic',
    icon: Sparkles,
    gradient: 'from-blue-500 to-blue-600',
    hoverGradient: 'from-blue-600 to-blue-700',
    shadow: 'shadow-blue-500/25'
  },
  {
    type: 'subtopic' as const,
    label: 'Subtopic',
    icon: Layers,
    gradient: 'from-orange-500 to-orange-600',
    hoverGradient: 'from-orange-600 to-orange-700',
    shadow: 'shadow-orange-500/25'
  },
  {
    type: 'detail' as const,
    label: 'Detail',
    icon: MessageSquare,
    gradient: 'from-violet-500 to-violet-600',
    hoverGradient: 'from-violet-600 to-violet-700',
    shadow: 'shadow-violet-500/25'
  }
];

export function MindMapToolbar({
  onAddNode,
  onSave,
  onNewMap,
  onDeleteSelected,
  hasSelection,
  isSaving,
  onZoomIn,
  onZoomOut,
  onFitView
}: MindMapToolbarProps) {
  return (
    <div className="relative">
      {/* Main Toolbar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left Side - Add Nodes */}
          <div className="flex items-center gap-3">
            {/* Section Label */}
            <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-gray-200">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Plus className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Add Node</span>
            </div>

            {/* Node Type Buttons */}
            <div className="flex items-center gap-2">
              {nodeTypes.map((nodeType) => (
                <motion.button
                  key={nodeType.type}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAddNode(nodeType.type)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${nodeType.gradient} hover:${nodeType.hoverGradient} text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg ${nodeType.shadow}`}
                >
                  {/* Glossy overlay */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent h-1/2" />
                  </div>
                  <nodeType.icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{nodeType.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            {(onZoomIn || onZoomOut || onFitView) && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-xl mr-2">
                {onZoomOut && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onZoomOut}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4 text-gray-600" />
                  </motion.button>
                )}
                {onZoomIn && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onZoomIn}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4 text-gray-600" />
                  </motion.button>
                )}
                {onFitView && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onFitView}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Fit View"
                  >
                    <Maximize2 className="w-4 h-4 text-gray-600" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Delete Button (shown when nodes selected) */}
            <AnimatePresence>
              {hasSelection && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onDeleteSelected}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 text-sm font-medium rounded-xl border border-red-200 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* New Map Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNewMap}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-all duration-200 shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>New Map</span>
            </motion.button>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: isSaving ? 1 : 1.05, y: isSaving ? 0 : -2 }}
              whileTap={{ scale: isSaving ? 1 : 0.95 }}
              onClick={onSave}
              disabled={isSaving}
              className={`relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-primary/25 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden`}
            >
              {/* Glossy overlay */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent h-1/2" />
              </div>

              {/* Animated Save Icon */}
              <motion.div
                animate={isSaving ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 1, repeat: isSaving ? Infinity : 0, ease: 'linear' }}
              >
                <Save className="w-4 h-4 relative z-10" />
              </motion.div>
              <span className="relative z-10">{isSaving ? 'Saving...' : 'Save'}</span>

              {/* Success animation overlay */}
              {isSaving && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              )}
            </motion.button>
          </div>
        </div>

        {/* Keyboard Shortcut Hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="hidden lg:flex items-center gap-4 mt-3 pt-3 border-t border-gray-100"
        >
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Keyboard className="w-3 h-3" />
            <span>Tips:</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Double-click</kbd>
              <span>to edit</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Drag</kbd>
              <span>to connect</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Hover</kbd>
              <span>to mark complete</span>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
