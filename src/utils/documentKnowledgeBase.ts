import { ProcessedDocument } from './documentProcessor';

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  startIndex: number;
  endIndex: number;
  metadata: {
    pageNumber?: number;
    section?: string;
    type: 'paragraph' | 'heading' | 'list' | 'quote' | 'code';
  };
  embedding?: number[]; // For future semantic search
}

export interface DocumentEntity {
  id: string;
  name: string;
  type: 'person' | 'organization' | 'location' | 'date' | 'concept' | 'term';
  mentions: Array<{
    documentId: string;
    chunkId: string;
    context: string;
  }>;
  relationships: Array<{
    targetEntityId: string;
    relationshipType: string;
    documentId: string;
  }>;
}

export interface KnowledgeGraph {
  entities: Map<string, DocumentEntity>;
  documents: Map<string, ProcessedDocument>;
  chunks: Map<string, DocumentChunk>;
  topics: Map<string, Set<string>>; // topic -> document IDs
  timeline: Array<{
    date: string;
    events: Array<{
      documentId: string;
      description: string;
      entities: string[];
    }>;
  }>;
}

export interface DocumentIndex {
  // Full-text search index
  searchIndex: Map<string, Set<string>>; // term -> chunk IDs
  // Topic categorization
  topicHierarchy: Map<string, Set<string>>; // parent topic -> child topics
  // Document relationships
  documentRelations: Map<string, Set<string>>; // doc ID -> related doc IDs
  // Concept map
  conceptMap: Map<string, {
    definition: string;
    relatedConcepts: Set<string>;
    documentSources: Set<string>;
  }>;
}

class DocumentKnowledgeBase {
  private knowledgeGraph: KnowledgeGraph;
  private documentIndex: DocumentIndex;
  private localStorage: Storage;
  private storageKey = 'edgeup_document_knowledge_base';

  constructor() {
    this.knowledgeGraph = {
      entities: new Map(),
      documents: new Map(),
      chunks: new Map(),
      topics: new Map(),
      timeline: []
    };

    this.documentIndex = {
      searchIndex: new Map(),
      topicHierarchy: new Map(),
      documentRelations: new Map(),
      conceptMap: new Map()
    };

    this.localStorage = window.localStorage;
    this.loadFromStorage();
  }

  // Add a new document to the knowledge base
  async addDocument(document: ProcessedDocument): Promise<void> {
    // Store the document
    this.knowledgeGraph.documents.set(document.id, document);

    // Process content into chunks
    const chunks = this.createDocumentChunks(document);
    chunks.forEach(chunk => {
      this.knowledgeGraph.chunks.set(chunk.id, chunk);
      this.indexChunk(chunk);
    });

    // Extract and index entities
    const entities = this.extractEntities(document, chunks);
    entities.forEach(entity => {
      this.addOrUpdateEntity(entity);
    });

    // Update topic index
    document.topics.forEach(topic => {
      if (!this.knowledgeGraph.topics.has(topic)) {
        this.knowledgeGraph.topics.set(topic, new Set());
      }
      this.knowledgeGraph.topics.get(topic)!.add(document.id);
    });

    // Update timeline if document contains dates
    this.updateTimeline(document);

    // Find relationships with existing documents
    this.findDocumentRelationships(document);

    // Save to storage
    this.saveToStorage();
  }

  // Create chunks from document content
  private createDocumentChunks(document: ProcessedDocument): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const content = document.content;
    
    // Split content into meaningful chunks (paragraphs, sections)
    const paragraphs = content.split(/\n\n+/);
    let currentIndex = 0;

    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim().length > 0) {
        const chunk: DocumentChunk = {
          id: `${document.id}-chunk-${index}`,
          documentId: document.id,
          content: paragraph.trim(),
          startIndex: currentIndex,
          endIndex: currentIndex + paragraph.length,
          metadata: {
            type: this.detectChunkType(paragraph)
          }
        };
        chunks.push(chunk);
      }
      currentIndex += paragraph.length + 2; // Account for newlines
    });

    return chunks;
  }

  // Detect the type of content chunk
  private detectChunkType(content: string): 'paragraph' | 'heading' | 'list' | 'quote' | 'code' {
    if (content.match(/^#{1,6}\s/)) return 'heading';
    if (content.match(/^[\*\-\+]\s/) || content.match(/^\d+\.\s/)) return 'list';
    if (content.match(/^```/) || content.match(/^    /)) return 'code';
    if (content.match(/^>/)) return 'quote';
    return 'paragraph';
  }

  // Index a chunk for search
  private indexChunk(chunk: DocumentChunk): void {
    // Simple word-based indexing (can be enhanced with NLP)
    const words = chunk.content.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 2);

    words.forEach(word => {
      if (!this.documentIndex.searchIndex.has(word)) {
        this.documentIndex.searchIndex.set(word, new Set());
      }
      this.documentIndex.searchIndex.get(word)!.add(chunk.id);
    });
  }

  // Extract entities from document
  private extractEntities(document: ProcessedDocument, chunks: DocumentChunk[]): DocumentEntity[] {
    const entities: DocumentEntity[] = [];
    
    // Extract from document's identified entities
    document.entities.forEach(entityName => {
      const entity: DocumentEntity = {
        id: this.generateEntityId(entityName),
        name: entityName,
        type: this.detectEntityType(entityName),
        mentions: [],
        relationships: []
      };

      // Find mentions in chunks
      chunks.forEach(chunk => {
        if (chunk.content.toLowerCase().includes(entityName.toLowerCase())) {
          entity.mentions.push({
            documentId: document.id,
            chunkId: chunk.id,
            context: this.extractContext(chunk.content, entityName)
          });
        }
      });

      entities.push(entity);
    });

    return entities;
  }

  // Add or update entity in the knowledge graph
  private addOrUpdateEntity(entity: DocumentEntity): void {
    const existingEntity = this.knowledgeGraph.entities.get(entity.id);
    
    if (existingEntity) {
      // Merge mentions
      entity.mentions.forEach(mention => {
        if (!existingEntity.mentions.some(m => 
          m.documentId === mention.documentId && m.chunkId === mention.chunkId
        )) {
          existingEntity.mentions.push(mention);
        }
      });
    } else {
      this.knowledgeGraph.entities.set(entity.id, entity);
    }
  }

  // Search across all documents
  search(query: string): Array<{
    document: ProcessedDocument;
    chunks: DocumentChunk[];
    relevanceScore: number;
  }> {
    const results = new Map<string, {
      document: ProcessedDocument;
      chunks: Set<DocumentChunk>;
      score: number;
    }>();

    // Search terms
    const searchTerms = query.toLowerCase().split(/\W+/).filter(term => term.length > 2);

    searchTerms.forEach(term => {
      const chunkIds = this.documentIndex.searchIndex.get(term);
      if (chunkIds) {
        chunkIds.forEach(chunkId => {
          const chunk = this.knowledgeGraph.chunks.get(chunkId);
          if (chunk) {
            const document = this.knowledgeGraph.documents.get(chunk.documentId);
            if (document) {
              if (!results.has(document.id)) {
                results.set(document.id, {
                  document,
                  chunks: new Set(),
                  score: 0
                });
              }
              const result = results.get(document.id)!;
              result.chunks.add(chunk);
              result.score += 1;
            }
          }
        });
      }
    });

    // Convert to array and sort by relevance
    return Array.from(results.values())
      .sort((a, b) => b.score - a.score)
      .map(result => ({
        document: result.document,
        chunks: Array.from(result.chunks),
        relevanceScore: result.score / searchTerms.length
      }));
  }

  // Get related documents
  getRelatedDocuments(documentId: string): ProcessedDocument[] {
    const relatedIds = this.documentIndex.documentRelations.get(documentId);
    if (!relatedIds) return [];

    return Array.from(relatedIds)
      .map(id => this.knowledgeGraph.documents.get(id))
      .filter(doc => doc !== undefined) as ProcessedDocument[];
  }

  // Get all documents by topic
  getDocumentsByTopic(topic: string): ProcessedDocument[] {
    const documentIds = this.knowledgeGraph.topics.get(topic);
    if (!documentIds) return [];

    return Array.from(documentIds)
      .map(id => this.knowledgeGraph.documents.get(id))
      .filter(doc => doc !== undefined) as ProcessedDocument[];
  }

  // Get entity information
  getEntity(entityName: string): DocumentEntity | undefined {
    const entityId = this.generateEntityId(entityName);
    return this.knowledgeGraph.entities.get(entityId);
  }

  // Get all entities
  getAllEntities(): DocumentEntity[] {
    return Array.from(this.knowledgeGraph.entities.values());
  }

  // Get concept definition and related information
  getConcept(conceptName: string): {
    definition: string;
    relatedConcepts: string[];
    sources: ProcessedDocument[];
  } | undefined {
    const concept = this.documentIndex.conceptMap.get(conceptName.toLowerCase());
    if (!concept) return undefined;

    const sources = Array.from(concept.documentSources)
      .map(id => this.knowledgeGraph.documents.get(id))
      .filter(doc => doc !== undefined) as ProcessedDocument[];

    return {
      definition: concept.definition,
      relatedConcepts: Array.from(concept.relatedConcepts),
      sources
    };
  }

  // Get timeline events
  getTimeline(): typeof this.knowledgeGraph.timeline {
    return this.knowledgeGraph.timeline.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  // Helper methods
  private generateEntityId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  private detectEntityType(name: string): DocumentEntity['type'] {
    // Simple heuristics - can be enhanced with NLP
    if (name.match(/\d{4}/)) return 'date';
    if (name.match(/^[A-Z][a-z]+ [A-Z][a-z]+$/)) return 'person';
    if (name.match(/University|College|Institute|Company|Corporation/i)) return 'organization';
    if (name.match(/City|Country|State|Province/i)) return 'location';
    return 'concept';
  }

  private extractContext(content: string, entity: string, contextLength: number = 100): string {
    const index = content.toLowerCase().indexOf(entity.toLowerCase());
    if (index === -1) return '';

    const start = Math.max(0, index - contextLength);
    const end = Math.min(content.length, index + entity.length + contextLength);
    
    let context = content.substring(start, end);
    if (start > 0) context = '...' + context;
    if (end < content.length) context = context + '...';
    
    return context;
  }

  private updateTimeline(document: ProcessedDocument): void {
    // Extract dates from content
    const datePattern = /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|[A-Za-z]+ \d{1,2},? \d{4}|\d{4})\b/g;
    const dates = document.content.match(datePattern) || [];

    dates.forEach(dateStr => {
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const dateKey = date.toISOString().split('T')[0];
          
          let timelineEntry = this.knowledgeGraph.timeline.find(entry => entry.date === dateKey);
          if (!timelineEntry) {
            timelineEntry = { date: dateKey, events: [] };
            this.knowledgeGraph.timeline.push(timelineEntry);
          }

          timelineEntry.events.push({
            documentId: document.id,
            description: `Referenced in ${document.name}`,
            entities: []
          });
        }
      } catch (e) {
        // Invalid date, skip
      }
    });
  }

  private findDocumentRelationships(document: ProcessedDocument): void {
    // Find documents with overlapping topics
    document.topics.forEach(topic => {
      const relatedDocs = this.knowledgeGraph.topics.get(topic);
      if (relatedDocs) {
        relatedDocs.forEach(docId => {
          if (docId !== document.id) {
            if (!this.documentIndex.documentRelations.has(document.id)) {
              this.documentIndex.documentRelations.set(document.id, new Set());
            }
            this.documentIndex.documentRelations.get(document.id)!.add(docId);
          }
        });
      }
    });
  }

  // Storage methods
  private saveToStorage(): void {
    try {
      const data = {
        documents: Array.from(this.knowledgeGraph.documents.entries()),
        chunks: Array.from(this.knowledgeGraph.chunks.entries()),
        entities: Array.from(this.knowledgeGraph.entities.entries()),
        topics: Array.from(this.knowledgeGraph.topics.entries()).map(([k, v]) => [k, Array.from(v)]),
        timeline: this.knowledgeGraph.timeline,
        searchIndex: Array.from(this.documentIndex.searchIndex.entries()).map(([k, v]) => [k, Array.from(v)]),
        documentRelations: Array.from(this.documentIndex.documentRelations.entries()).map(([k, v]) => [k, Array.from(v)])
      };
      this.localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save knowledge base to storage:', e);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = this.localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        
        this.knowledgeGraph.documents = new Map(data.documents);
        this.knowledgeGraph.chunks = new Map(data.chunks);
        this.knowledgeGraph.entities = new Map(data.entities);
        this.knowledgeGraph.topics = new Map(data.topics.map(([k, v]: [string, string[]]) => [k, new Set(v)]));
        this.knowledgeGraph.timeline = data.timeline || [];
        
        this.documentIndex.searchIndex = new Map(data.searchIndex.map(([k, v]: [string, string[]]) => [k, new Set(v)]));
        this.documentIndex.documentRelations = new Map(data.documentRelations.map(([k, v]: [string, string[]]) => [k, new Set(v)]));
      }
    } catch (e) {
      console.error('Failed to load knowledge base from storage:', e);
    }
  }

  // Clear all data
  clear(): void {
    this.knowledgeGraph = {
      entities: new Map(),
      documents: new Map(),
      chunks: new Map(),
      topics: new Map(),
      timeline: []
    };

    this.documentIndex = {
      searchIndex: new Map(),
      topicHierarchy: new Map(),
      documentRelations: new Map(),
      conceptMap: new Map()
    };

    this.localStorage.removeItem(this.storageKey);
  }
}

// Export singleton instance
export const documentKnowledgeBase = new DocumentKnowledgeBase();