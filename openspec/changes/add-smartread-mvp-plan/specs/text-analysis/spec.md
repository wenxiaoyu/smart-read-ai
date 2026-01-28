# Text Analysis Capability

## ADDED Requirements

### Requirement: Text Selection Detection

The system SHALL detect when user selects text on a web page.

#### Scenario: User selects text

- **WHEN** user selects text with length ≥ 5 characters
- **THEN** system triggers selection event
- **AND** captures selected text content
- **AND** captures selection position coordinates

#### Scenario: User selects short text

- **WHEN** user selects text with length < 5 characters
- **THEN** system ignores the selection (avoid false triggers)

### Requirement: Long Sentence Simplification

The system SHALL simplify long and complex sentences while preserving professional terminology and core logic.

#### Scenario: Simplify technical documentation

- **WHEN** user requests simplification of a technical sentence
- **THEN** system breaks down the sentence into step-by-step explanations
- **AND** preserves API names and technical keywords
- **AND** maintains the original meaning

#### Scenario: Simplify academic paper

- **WHEN** user requests simplification of an academic sentence
- **THEN** system simplifies while preserving formulas and experimental data
- **AND** explains complex concepts in simpler terms
- **AND** maintains academic rigor

#### Scenario: Local AI unavailable

- **WHEN** local AI (Gemini Nano) is not available
- **THEN** system falls back to rule-based simplification
- **AND** notifies user about degraded mode
- **AND** provides basic sentence splitting

### Requirement: Professional Term Explanation

The system SHALL explain professional terms with concise and accurate definitions.

#### Scenario: Explain technical term

- **WHEN** user selects a technical term (e.g., "Transformer attention mechanism")
- **THEN** system provides definition, core function, and application scenarios
- **AND** suggests related concepts
- **AND** caches the explanation for 24 hours

#### Scenario: Explain cached term

- **WHEN** user selects a previously explained term within 24 hours
- **THEN** system returns cached explanation immediately
- **AND** response time < 0.1 seconds

### Requirement: Code Snippet Analysis

The system SHALL analyze code snippets and explain their functionality.

#### Scenario: Analyze Python code

- **WHEN** user selects Python code snippet
- **THEN** system identifies the programming language
- **AND** explains code functionality
- **AND** breaks down core logic
- **AND** describes key parameters

#### Scenario: Analyze JavaScript code

- **WHEN** user selects JavaScript code snippet
- **THEN** system provides function overview
- **AND** explains async/await patterns if present
- **AND** highlights potential issues

#### Scenario: Unsupported language

- **WHEN** user selects code in unsupported language
- **THEN** system attempts generic code analysis
- **AND** notifies user about limited support

### Requirement: Formula Analysis

The system SHALL analyze mathematical formulas and explain their meaning.

#### Scenario: Analyze LaTeX formula

- **WHEN** user selects LaTeX formula
- **THEN** system explains formula meaning
- **AND** describes each parameter's physical/mathematical significance
- **AND** provides application scenarios

#### Scenario: Analyze formula in image

- **WHEN** user selects formula rendered as image
- **THEN** system attempts OCR recognition (MVP-3)
- **OR** prompts user to input formula manually (MVP-2)

### Requirement: Domain Adaptation

The system SHALL adapt analysis style based on content domain.

#### Scenario: Technical documentation domain

- **WHEN** system detects technical documentation (API docs, GitHub README)
- **THEN** uses technical domain prompt template
- **AND** preserves code syntax and API names
- **AND** focuses on implementation details

#### Scenario: Academic paper domain

- **WHEN** system detects academic paper (arxiv, ScienceDirect)
- **THEN** uses academic domain prompt template
- **AND** preserves formulas and citations
- **AND** focuses on research methodology

#### Scenario: General content domain

- **WHEN** system cannot determine specific domain
- **THEN** uses general prompt template
- **AND** provides balanced analysis
