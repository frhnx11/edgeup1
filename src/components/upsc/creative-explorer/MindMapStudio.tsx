import { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  MiniMap,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import type { Connection, Node, Edge, NodeChange } from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  FolderOpen,
  Clock,
  Sparkles,
  Map,
  Layers,
  PanelLeftClose,
  PanelLeft,
  Search,
  Edit2
} from 'lucide-react';

import CustomNode from './CustomNode';
import { MindMapToolbar } from './MindMapToolbar';
import { TemplateSelector } from './TemplateSelector';
import { useMindMapStore, NODE_COLORS, COMPLETED_COLOR } from '../../../store/useMindMapStore';
import type { MindMapNodeData } from '../../../store/useMindMapStore';

// Define custom node types
const nodeTypes = {
  mindMapNode: CustomNode
};

// Default edge options with better styling
const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  style: {
    stroke: '#94A3B8',
    strokeWidth: 2,
    strokeLinecap: 'round' as const
  }
};

function MindMapStudioInner() {
  // Store
  const {
    mindMaps,
    currentMapId,
    createMindMap,
    saveMindMap,
    deleteMindMap,
    setCurrentMap,
    getCurrentMap,
    loadFromStorage
  } = useMindMapStore();

  // React Flow instance for zoom controls
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  // Local state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Load current map when it changes
  useEffect(() => {
    const currentMap = getCurrentMap();
    if (currentMap) {
      setNodes(currentMap.nodes);
      setEdges(currentMap.edges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [currentMapId, getCurrentMap, setNodes, setEdges]);

  // Filter mind maps based on search
  const filteredMindMaps = useMemo(() => {
    if (!searchQuery) return mindMaps;
    return mindMaps.filter(map =>
      map.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mindMaps, searchQuery]);

  // Handle connection between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, ...defaultEdgeOptions }, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const onSelectionChange = useCallback(({ nodes: selectedNodesList }: { nodes: Node[] }) => {
    setSelectedNodes(selectedNodesList.map((n) => n.id));
  }, []);

  // Generate unique ID for new nodes
  const generateNodeId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add new node
  const handleAddNode = useCallback(
    (type: 'topic' | 'subtopic' | 'detail') => {
      const colors = {
        topic: NODE_COLORS[0].value,
        subtopic: NODE_COLORS[1].value,
        detail: NODE_COLORS[2].value
      };

      const labels = {
        topic: 'New Topic',
        subtopic: 'New Subtopic',
        detail: 'New Detail'
      };

      const newNode: Node<MindMapNodeData> = {
        id: generateNodeId(),
        type: 'mindMapNode',
        position: {
          x: 200 + Math.random() * 300,
          y: 100 + Math.random() * 200
        },
        data: {
          label: labels[type],
          color: colors[type],
          isComplete: false
        }
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  // Delete node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  // Delete selected nodes
  const handleDeleteSelected = useCallback(() => {
    if (selectedNodes.length > 0) {
      setNodes((nds) => nds.filter((n) => !selectedNodes.includes(n.id)));
      setEdges((eds) =>
        eds.filter(
          (e) => !selectedNodes.includes(e.source) && !selectedNodes.includes(e.target)
        )
      );
      setSelectedNodes([]);
    }
  }, [selectedNodes, setNodes, setEdges]);

  // Update node label
  const handleLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n
        )
      );
    },
    [setNodes]
  );

  // Toggle node complete status
  const handleToggleComplete = useCallback(
    (nodeId: string) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, isComplete: !n.data.isComplete } }
            : n
        )
      );
    },
    [setNodes]
  );

  // Save current map
  const handleSave = useCallback(() => {
    if (currentMapId) {
      setIsSaving(true);
      saveMindMap(currentMapId, nodes, edges);
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [currentMapId, nodes, edges, saveMindMap]);

  // Create new map from template
  const handleCreateFromTemplate = useCallback(
    (name: string, templateNodes: Node<MindMapNodeData>[], templateEdges: Edge[]) => {
      const idMap: Record<string, string> = {};
      const newNodes = templateNodes.map((node) => {
        const newId = generateNodeId();
        idMap[node.id] = newId;
        return { ...node, id: newId };
      });

      const newEdges = templateEdges.map((edge) => ({
        ...edge,
        id: `e-${idMap[edge.source]}-${idMap[edge.target]}`,
        source: idMap[edge.source],
        target: idMap[edge.target]
      }));

      createMindMap(name, newNodes.length > 0 ? newNodes : undefined, newEdges.length > 0 ? newEdges : undefined);
    },
    [createMindMap]
  );

  // Handle node changes
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  // Custom node with callbacks
  const customNodeTypes = useMemo(
    () => ({
      mindMapNode: (props: any) => (
        <CustomNode
          {...props}
          onDelete={handleDeleteNode}
          onLabelChange={handleLabelChange}
          onToggleComplete={handleToggleComplete}
        />
      )
    }),
    [handleDeleteNode, handleLabelChange, handleToggleComplete]
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // MiniMap node color - show green for completed nodes
  const nodeColor = (node: Node) => {
    const data = node.data as MindMapNodeData;
    if (data?.isComplete) {
      return COMPLETED_COLOR;
    }
    return data?.color || '#3B82F6';
  };

  return (
    <div className="h-[calc(100vh-200px)] min-h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden flex shadow-inner">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              opacity: { duration: 0.2 }
            }}
            className="bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-lg overflow-hidden"
          >
            {/* Inner wrapper to maintain content width during animation */}
            <div className="w-72 min-w-[288px] flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-5 border-b border-gray-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20">
                  <Map className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">My Mind Maps</h3>
                  <p className="text-xs text-gray-500">{mindMaps.length} saved maps</p>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search maps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                />
              </div>

              {/* New Map Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTemplateSelector(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30"
              >
                <Plus className="w-4 h-4" />
                New Mind Map
              </motion.button>
            </div>

            {/* Maps List */}
            <div className="flex-1 overflow-y-auto p-3">
              {filteredMindMaps.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    {searchQuery ? 'No maps found' : 'No mind maps yet'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {searchQuery ? 'Try a different search' : 'Click "New Mind Map" to get started'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredMindMaps.map((map, index) => (
                    <motion.div
                      key={map.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setCurrentMap(map.id)}
                      className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 group ${
                        currentMapId === map.id
                          ? 'bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border-2 border-brand-primary shadow-md'
                          : 'bg-white hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 shadow-sm hover:shadow'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Layers className={`w-4 h-4 ${currentMapId === map.id ? 'text-brand-primary' : 'text-gray-400'}`} />
                            <h4 className={`font-semibold text-sm truncate ${
                              currentMapId === map.id ? 'text-brand-primary' : 'text-gray-800'
                            }`}>
                              {map.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {formatDate(map.updatedAt)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                              {map.nodes.length} nodes
                            </span>
                          </div>
                        </div>

                        {/* Actions Dropdown */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Delete this mind map?')) {
                                deleteMindMap(map.id);
                              }
                            }}
                            className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>

                      {/* Active indicator */}
                      {currentMapId === map.id && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-primary rounded-r-full"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Templates Section */}
            <div className="p-4 border-t border-gray-200/50 bg-gray-50/50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Templates</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Polity', color: '#3B82F6' },
                  { name: 'History', color: '#F59E0B' },
                  { name: 'Geography', color: '#10B981' }
                ].map((template) => (
                  <motion.button
                    key={template.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTemplateSelector(true)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white hover:shadow-md border border-gray-100 transition-all"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${template.color}20` }}
                    >
                      <Map className="w-4 h-4" style={{ color: template.color }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{template.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Toggle Sidebar Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute left-3 top-3 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 hover:bg-white transition-all"
        >
          {showSidebar ? (
            <PanelLeftClose className="w-5 h-5 text-gray-600" />
          ) : (
            <PanelLeft className="w-5 h-5 text-gray-600" />
          )}
        </motion.button>

        {currentMapId ? (
          <>
            {/* Toolbar */}
            <MindMapToolbar
              onAddNode={handleAddNode}
              onSave={handleSave}
              onNewMap={() => setShowTemplateSelector(true)}
              onDeleteSelected={handleDeleteSelected}
              hasSelection={selectedNodes.length > 0}
              isSaving={isSaving}
              onZoomIn={() => zoomIn()}
              onZoomOut={() => zoomOut()}
              onFitView={() => fitView({ padding: 0.2 })}
            />

            {/* React Flow Canvas */}
            <div className="flex-1 relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onSelectionChange={onSelectionChange}
                nodeTypes={customNodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                deleteKeyCode={['Backspace', 'Delete']}
                multiSelectionKeyCode={['Control', 'Meta']}
                selectionOnDrag
                panOnScroll
                zoomOnScroll
                zoomOnPinch
                minZoom={0.2}
                maxZoom={2}
                className="bg-[#FAFBFC]"
              >
                <MiniMap
                  position="bottom-left"
                  nodeColor={nodeColor}
                  maskColor="rgba(0,0,0,0.08)"
                  className="!bg-white/90 !backdrop-blur-sm !border !border-gray-200/50 !rounded-xl !shadow-lg"
                  style={{ width: 150, height: 100 }}
                />
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={24}
                  size={1.5}
                  color="#E2E8F0"
                />
              </ReactFlow>

              {/* Watermark */}
              <div className="absolute bottom-4 right-32 flex items-center gap-2 px-3 py-1.5 bg-white/50 backdrop-blur-sm rounded-lg text-xs text-gray-400">
                <Sparkles className="w-3 h-3" />
                Mind Map Studio
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-lg px-8"
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/30">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Mind Map Studio
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Create visual concept maps to organize your thoughts and study UPSC topics effectively.
                Start with a template or create from scratch.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTemplateSelector(true)}
                  className="px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/40"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Your First Mind Map
                  </span>
                </motion.button>
              </div>

              {/* Feature highlights */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                {[
                  { icon: Layers, label: 'Drag & Drop' },
                  { icon: Edit2, label: 'Easy Editing' },
                  { icon: Map, label: 'UPSC Templates' }
                ].map((feature) => (
                  <div key={feature.label} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Template Selector Modal */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleCreateFromTemplate}
      />
    </div>
  );
}

// Wrapper component with ReactFlowProvider for zoom controls
export function MindMapStudio() {
  return (
    <ReactFlowProvider>
      <MindMapStudioInner />
    </ReactFlowProvider>
  );
}
