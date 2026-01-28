# Knowledge Management Capability

## ADDED Requirements

### Requirement: Knowledge Node Storage

The system SHALL store collected knowledge nodes in local IndexedDB.

#### Scenario: Save knowledge node

- **WHEN** user collects a text snippet or AI result
- **THEN** system creates knowledge node with:
  - Unique ID (UUID)
  - Type (term/code/formula/conclusion)
  - Content text
  - Source URL
  - Creation timestamp
  - Auto-generated tags (AI-based)
- **AND** saves node to IndexedDB
- **AND** completes within 0.5 seconds

#### Scenario: Save with duplicate content

- **WHEN** user collects content that already exists
- **THEN** system checks for duplicates by content hash
- **AND** updates existing node's timestamp if duplicate
- **OR** creates new node if content differs

#### Scenario: Storage limit reached

- **WHEN** knowledge base reaches 1000 nodes
- **THEN** system warns user about storage limit
- **AND** suggests cleaning old nodes
- **AND** allows user to proceed or cancel

### Requirement: Knowledge Node Retrieval

The system SHALL retrieve knowledge nodes efficiently.

#### Scenario: Get all nodes

- **WHEN** user opens knowledge graph view
- **THEN** system retrieves all nodes from IndexedDB
- **AND** completes within 1 second for 1000 nodes
- **AND** returns nodes sorted by creation time (newest first)

#### Scenario: Get nodes by type

- **WHEN** user filters by node type (e.g., "code")
- **THEN** system retrieves only nodes of that type
- **AND** returns filtered results within 0.5 seconds

#### Scenario: Get node by ID

- **WHEN** system needs specific node details
- **THEN** retrieves node by ID from IndexedDB
- **AND** returns node within 0.1 seconds

### Requirement: Simple Keyword Search

The system SHALL support basic keyword search in knowledge base.

#### Scenario: Search by exact keyword

- **WHEN** user searches for "Transformer"
- **THEN** system searches node content and tags
- **AND** returns nodes containing exact keyword
- **AND** completes search within 1 second

#### Scenario: Search with multiple keywords

- **WHEN** user searches for "Python async await"
- **THEN** system searches for nodes containing any keyword
- **AND** ranks results by number of matching keywords
- **AND** returns top 10 results

#### Scenario: No search results

- **WHEN** search query matches no nodes
- **THEN** system displays "No results found" message
- **AND** suggests trying different keywords

### Requirement: Knowledge Node Tagging

The system SHALL automatically generate tags for knowledge nodes.

#### Scenario: Generate tags for term

- **WHEN** user collects a technical term
- **THEN** system uses AI to extract key concepts
- **AND** generates 3-5 relevant tags
- **AND** saves tags with node

#### Scenario: Generate tags for code

- **WHEN** user collects code snippet
- **THEN** system extracts programming language
- **AND** identifies key functions/patterns
- **AND** generates tags like "python", "async", "error-handling"

#### Scenario: Manual tag editing (MVP-3)

- **WHEN** user edits node tags in UI
- **THEN** system updates node with new tags
- **AND** saves changes to IndexedDB

### Requirement: Knowledge Graph Construction (MVP-3)

The system SHALL automatically build knowledge graph from collected nodes.

#### Scenario: Build graph on new node

- **WHEN** user adds new knowledge node
- **THEN** system calculates TF-IDF vectors for all nodes
- **AND** computes cosine similarity with existing nodes
- **AND** creates relations where similarity > 0.3
- **AND** completes within 5 seconds for 100 nodes

#### Scenario: Infer relation type

- **WHEN** system creates relation between nodes
- **THEN** analyzes content to infer relation type:
  - "contains" if one concept includes another
  - "improves" if one is enhancement of another
  - "relates" if concepts are related but not hierarchical
  - "contradicts" if concepts conflict
- **AND** assigns confidence weight (0-1)

#### Scenario: Update graph incrementally

- **WHEN** new node is added to existing graph
- **THEN** system only computes relations for new node
- **AND** does not recompute entire graph
- **AND** completes within 2 seconds

### Requirement: Natural Language Search (MVP-3)

The system SHALL support natural language queries for knowledge search.

#### Scenario: Search with natural language

- **WHEN** user enters "find information about Transformer attention mechanism"
- **THEN** system uses local AI to extract intent and keywords
- **AND** computes query vector
- **AND** performs vector similarity search
- **AND** returns top 5 most relevant nodes
- **AND** completes within 2 seconds

#### Scenario: Search with question

- **WHEN** user enters "how does async/await work in Python?"
- **THEN** system identifies question type
- **AND** searches for nodes explaining the concept
- **AND** prioritizes nodes with code examples
- **AND** returns ranked results

#### Scenario: Search with context

- **WHEN** user searches while reading related content
- **THEN** system considers current page context
- **AND** boosts relevance of related nodes
- **AND** returns context-aware results

### Requirement: Knowledge Node Management

The system SHALL allow users to manage their knowledge nodes.

#### Scenario: Delete knowledge node

- **WHEN** user deletes a node
- **THEN** system removes node from IndexedDB
- **AND** removes all relations involving that node
- **AND** updates graph structure
- **AND** shows deletion confirmation

#### Scenario: Edit knowledge node

- **WHEN** user edits node content or tags
- **THEN** system updates node in IndexedDB
- **AND** recalculates relations if content changed significantly
- **AND** saves changes immediately

#### Scenario: Bulk delete nodes

- **WHEN** user selects multiple nodes for deletion
- **THEN** system shows confirmation with count
- **AND** deletes all selected nodes if confirmed
- **AND** updates graph structure
- **AND** shows deletion summary

### Requirement: Knowledge Data Export

The system SHALL allow users to export their knowledge data.

#### Scenario: Export as JSON

- **WHEN** user clicks "Export Data" button
- **THEN** system retrieves all nodes and relations
- **AND** generates JSON file with structure:
  ```json
  {
    "version": "1.0",
    "exportDate": "2026-01-27T10:00:00Z",
    "nodes": [...],
    "relations": [...]
  }
  ```
- **AND** triggers file download
- **AND** completes within 2 seconds for 1000 nodes

#### Scenario: Export filtered data

- **WHEN** user exports with active filters (e.g., only "code" type)
- **THEN** system exports only filtered nodes
- **AND** includes only relations between exported nodes
- **AND** indicates filter in filename

### Requirement: Knowledge Data Import (MVP-3)

The system SHALL allow users to import previously exported knowledge data.

#### Scenario: Import JSON file

- **WHEN** user selects JSON file to import
- **THEN** system validates file format
- **AND** checks for duplicate nodes
- **AND** merges new nodes with existing data
- **AND** rebuilds graph relations
- **AND** shows import summary (X nodes added, Y duplicates skipped)

#### Scenario: Import invalid file

- **WHEN** user selects invalid JSON file
- **THEN** system displays error message
- **AND** explains expected format
- **AND** does not modify existing data

### Requirement: Cross-Session Context Memory (MVP-3)

The system SHALL remember reading context across browser sessions.

#### Scenario: Save session context

- **WHEN** user reads multiple related pages in one session
- **THEN** system tracks page URLs and key concepts
- **AND** stores session context in memory
- **AND** associates new nodes with session context

#### Scenario: Recall session context

- **WHEN** user returns to related topic in new session
- **THEN** system retrieves relevant session context
- **AND** suggests related nodes from previous sessions
- **AND** provides "You previously read about..." hints

#### Scenario: Clear session context

- **WHEN** user manually clears session context
- **THEN** system removes temporary context data
- **AND** keeps permanent knowledge nodes
- **AND** shows confirmation message

### Requirement: Knowledge Graph Visualization (MVP-3)

The system SHALL visualize knowledge graph for user exploration.

#### Scenario: Display knowledge graph

- **WHEN** user opens knowledge graph view
- **THEN** system renders interactive graph with:
  - Nodes as circles (sized by importance)
  - Relations as lines (thickness by weight)
  - Color-coded by node type
- **AND** supports zoom and pan
- **AND** renders within 3 seconds for 100 nodes

#### Scenario: Explore node connections

- **WHEN** user clicks on a node
- **THEN** system highlights connected nodes
- **AND** shows relation types on hover
- **AND** displays node details in side panel

#### Scenario: Filter graph view

- **WHEN** user applies filters (e.g., show only "code" nodes)
- **THEN** system updates graph to show filtered nodes
- **AND** hides unrelated relations
- **AND** updates view smoothly with animation

### Requirement: Storage Management

The system SHALL provide tools for managing storage usage.

#### Scenario: View storage statistics

- **WHEN** user opens storage management page
- **THEN** displays total nodes count
- **AND** shows storage size used
- **AND** breaks down by node type
- **AND** shows oldest and newest nodes

#### Scenario: Clear old nodes

- **WHEN** user clicks "Clear nodes older than 6 months"
- **THEN** system shows confirmation with count
- **AND** deletes old nodes if confirmed
- **AND** updates graph structure
- **AND** shows cleanup summary

#### Scenario: Clear all data

- **WHEN** user clicks "Clear all knowledge data"
- **THEN** system shows strong warning
- **AND** requires confirmation
- **AND** deletes all nodes and relations if confirmed
- **AND** resets storage to empty state
