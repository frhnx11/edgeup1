import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GripVertical, Edit3, Check, Circle } from 'lucide-react';
import type { MindMapNodeData } from '../../../store/useMindMapStore';
import { COMPLETED_COLOR } from '../../../store/useMindMapStore';

interface CustomNodeProps extends NodeProps<MindMapNodeData> {
  onDelete?: (id: string) => void;
  onLabelChange?: (id: string, newLabel: string) => void;
  onToggleComplete?: (id: string) => void;
}

const CustomNode = memo(({ id, data, selected, onDelete, onLabelChange, onToggleComplete }: CustomNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.label);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(data.label);
  }, [data.label]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (editValue.trim() && editValue !== data.label) {
      onLabelChange?.(id, editValue.trim());
    } else {
      setEditValue(data.label);
    }
  }, [editValue, data.label, id, onLabelChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(data.label);
      setIsEditing(false);
    }
  }, [handleBlur, data.label]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  }, [id, onDelete]);

  const handleToggleComplete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete?.(id);
  }, [id, onToggleComplete]);

  // Use completed color when marked as complete
  const displayColor = data.isComplete ? COMPLETED_COLOR : data.color;

  // Calculate contrasting text color
  const getTextColor = (bgColor: string) => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1F2937' : '#FFFFFF';
  };

  // Get lighter shade for gradient
  const getLighterShade = (color: string, percent: number = 20) => {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + percent);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + percent);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + percent);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const textColor = getTextColor(displayColor);
  const lighterColor = getLighterShade(displayColor, 40);

  // Handle styles
  const handleStyle = {
    width: 12,
    height: 12,
    background: 'linear-gradient(135deg, #fff 0%, #e5e7eb 100%)',
    border: `2px solid ${displayColor}`,
    transition: 'all 0.2s ease',
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative group ${selected ? 'z-10' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
    >
      {/* Connection Handles with enhanced styling */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ ...handleStyle, top: -6 }}
        className="!cursor-crosshair hover:!scale-125 hover:!border-blue-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ ...handleStyle, bottom: -6 }}
        className="!cursor-crosshair hover:!scale-125 hover:!border-blue-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ ...handleStyle, left: -6 }}
        className="!cursor-crosshair hover:!scale-125 hover:!border-blue-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ ...handleStyle, right: -6 }}
        className="!cursor-crosshair hover:!scale-125 hover:!border-blue-500"
      />

      {/* Node Content with glassmorphism effect */}
      <motion.div
        animate={{
          scale: selected ? 1.02 : 1,
          boxShadow: selected
            ? `0 0 0 3px ${displayColor}40, 0 20px 40px -12px rgba(0,0,0,0.25)`
            : isHovered
              ? '0 12px 28px -8px rgba(0,0,0,0.2)'
              : '0 4px 12px -2px rgba(0,0,0,0.1)'
        }}
        transition={{ duration: 0.2 }}
        className="relative overflow-hidden rounded-xl min-w-[140px] max-w-[280px] cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${displayColor} 0%, ${lighterColor} 100%)`,
        }}
      >
        {/* Glossy overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)'
          }}
        />

        {/* Completed checkmark overlay */}
        {data.isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <div className="w-6 h-6 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          </motion.div>
        )}

        {/* Drag indicator */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 transition-opacity">
          <GripVertical className="w-4 h-4" style={{ color: textColor }} />
        </div>

        {/* Content */}
        <div className={`relative px-5 py-3 pl-7 ${data.isComplete ? 'pr-10' : ''}`}>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full bg-white/95 text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner"
              style={{ minWidth: '120px' }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold break-words leading-relaxed ${data.isComplete ? 'line-through opacity-90' : ''}`}
                style={{ color: textColor, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
              >
                {data.label}
              </span>
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-30"
          style={{ background: `linear-gradient(90deg, transparent, ${textColor}, transparent)` }}
        />
      </motion.div>

      {/* Action Buttons */}
      <AnimatePresence>
        {(isHovered || selected) && !isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -5 }}
            className="absolute -top-3 -right-3 flex gap-1"
          >
            {/* Mark as Complete Button */}
            <button
              onClick={handleToggleComplete}
              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border transition-all hover:scale-110 ${
                data.isComplete
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400'
                  : 'bg-white hover:bg-emerald-50 text-emerald-500 border-gray-200'
              }`}
              title={data.isComplete ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {data.isComplete ? (
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              ) : (
                <Circle className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="w-7 h-7 bg-white hover:bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shadow-lg border border-gray-200 transition-all hover:scale-110"
              title="Edit node"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="w-7 h-7 bg-white hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-lg border border-gray-200 transition-all hover:scale-110"
              title="Delete node"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit hint tooltip */}
      <AnimatePresence>
        {isHovered && !isEditing && !selected && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-gray-900/90 text-white text-xs rounded-lg whitespace-nowrap backdrop-blur-sm"
          >
            Double-click to edit
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/90 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
