import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';

// Types
export interface MindMapNodeData {
  label: string;
  color: string;
  notes?: string;
  isComplete?: boolean;
}

// Completed node color (same as subtopic green)
export const COMPLETED_COLOR = '#10B981';

export interface MindMap {
  id: string;
  name: string;
  nodes: Node<MindMapNodeData>[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

interface MindMapStore {
  mindMaps: MindMap[];
  currentMapId: string | null;

  // Actions
  createMindMap: (name: string, nodes?: Node<MindMapNodeData>[], edges?: Edge[]) => string;
  saveMindMap: (id: string, nodes: Node<MindMapNodeData>[], edges: Edge[]) => void;
  deleteMindMap: (id: string) => void;
  renameMindMap: (id: string, newName: string) => void;
  setCurrentMap: (id: string | null) => void;
  getCurrentMap: () => MindMap | null;
  loadFromStorage: () => void;
}

const STORAGE_KEY = 'mindMapStudio';

// Helper to generate UUID
const generateId = () => {
  return 'map_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper to save to localStorage
const saveToStorage = (mindMaps: MindMap[], currentMapId: string | null) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      mindMaps,
      lastOpenedMapId: currentMapId
    }));
  } catch (error) {
    console.error('Failed to save mind maps to localStorage:', error);
  }
};

// Helper to load from localStorage
const loadFromStorageHelper = (): { mindMaps: MindMap[]; lastOpenedMapId: string | null } => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load mind maps from localStorage:', error);
  }
  return { mindMaps: [], lastOpenedMapId: null };
};

export const useMindMapStore = create<MindMapStore>((set, get) => ({
  mindMaps: [],
  currentMapId: null,

  createMindMap: (name: string, nodes?: Node<MindMapNodeData>[], edges?: Edge[]) => {
    const id = generateId();
    const now = new Date().toISOString();

    const newMap: MindMap = {
      id,
      name,
      nodes: nodes || [
        {
          id: 'root',
          type: 'mindMapNode',
          position: { x: 400, y: 50 },
          data: { label: name, color: '#3B82F6' }
        }
      ],
      edges: edges || [],
      createdAt: now,
      updatedAt: now
    };

    set((state) => {
      const newMindMaps = [...state.mindMaps, newMap];
      saveToStorage(newMindMaps, id);
      return {
        mindMaps: newMindMaps,
        currentMapId: id
      };
    });

    return id;
  },

  saveMindMap: (id: string, nodes: Node<MindMapNodeData>[], edges: Edge[]) => {
    set((state) => {
      const newMindMaps = state.mindMaps.map((map) =>
        map.id === id
          ? { ...map, nodes, edges, updatedAt: new Date().toISOString() }
          : map
      );
      saveToStorage(newMindMaps, state.currentMapId);
      return { mindMaps: newMindMaps };
    });
  },

  deleteMindMap: (id: string) => {
    set((state) => {
      const newMindMaps = state.mindMaps.filter((map) => map.id !== id);
      const newCurrentId = state.currentMapId === id
        ? (newMindMaps.length > 0 ? newMindMaps[0].id : null)
        : state.currentMapId;
      saveToStorage(newMindMaps, newCurrentId);
      return {
        mindMaps: newMindMaps,
        currentMapId: newCurrentId
      };
    });
  },

  renameMindMap: (id: string, newName: string) => {
    set((state) => {
      const newMindMaps = state.mindMaps.map((map) =>
        map.id === id
          ? { ...map, name: newName, updatedAt: new Date().toISOString() }
          : map
      );
      saveToStorage(newMindMaps, state.currentMapId);
      return { mindMaps: newMindMaps };
    });
  },

  setCurrentMap: (id: string | null) => {
    set((state) => {
      saveToStorage(state.mindMaps, id);
      return { currentMapId: id };
    });
  },

  getCurrentMap: () => {
    const state = get();
    return state.mindMaps.find((map) => map.id === state.currentMapId) || null;
  },

  loadFromStorage: () => {
    const { mindMaps, lastOpenedMapId } = loadFromStorageHelper();
    set({
      mindMaps,
      currentMapId: lastOpenedMapId
    });
  }
}));

// Color palette for nodes
export const NODE_COLORS = [
  { name: 'Blue', value: '#3B82F6', description: 'Main topics' },
  { name: 'Orange', value: '#F97316', description: 'Subtopics' },
  { name: 'Purple', value: '#8B5CF6', description: 'Details' },
  { name: 'Orange', value: '#F59E0B', description: 'Important' },
  { name: 'Red', value: '#EF4444', description: 'Critical' },
  { name: 'Gray', value: '#6B7280', description: 'Neutral' }
];
