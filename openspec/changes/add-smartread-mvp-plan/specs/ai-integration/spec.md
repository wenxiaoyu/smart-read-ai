# AI Integration Capability

## ADDED Requirements

### Requirement: Local AI Detection

The system SHALL detect Chrome's built-in Gemini Nano availability on startup.

#### Scenario: Gemini Nano available

- **WHEN** Chrome version ≥ 119 and Gemini Nano is enabled
- **THEN** system initializes local AI engine
- **AND** sets local AI status to "available"
- **AND** enables local AI features

#### Scenario: Gemini Nano unavailable

- **WHEN** Chrome version < 119 or Gemini Nano is disabled
- **THEN** system sets local AI status to "unavailable"
- **AND** activates fallback rule engine
- **AND** displays upgrade prompt to user

### Requirement: Local AI Processing

The system SHALL process text using local AI with response time ≤ 1 second.

#### Scenario: Simplify text locally

- **WHEN** user requests text simplification
- **THEN** system sends request to Gemini Nano
- **AND** receives response within 1 second
- **AND** displays result in injected UI

#### Scenario: Explain term locally

- **WHEN** user requests term explanation
- **THEN** system checks cache first
- **AND** if not cached, queries Gemini Nano
- **AND** caches result for 24 hours
- **AND** returns explanation within 1 second

### Requirement: Fallback Rule Engine

The system SHALL provide basic text processing when local AI is unavailable.

#### Scenario: Rule-based simplification

- **WHEN** local AI is unavailable and user requests simplification
- **THEN** system applies rule-based processing:
  - Split sentences longer than 50 characters
  - Identify parallel structures (and, or)
  - Extract main clause structure
- **AND** returns simplified result
- **AND** displays "basic mode" indicator

#### Scenario: Rule-based term lookup

- **WHEN** local AI is unavailable and user requests term explanation
- **THEN** system searches built-in term dictionary
- **AND** returns definition if found
- **OR** suggests online search if not found

### Requirement: Cloud AI Integration

The system SHALL integrate cloud AI models with unified interface.

#### Scenario: Call GPT-4 API

- **WHEN** user requests cloud AI feature with GPT-4 selected
- **THEN** system sends request to OpenAI API
- **AND** includes user's API key in request header
- **AND** receives response within 10 seconds
- **AND** counts tokens used

#### Scenario: Call Claude API

- **WHEN** user requests cloud AI feature with Claude selected
- **THEN** system sends request to Anthropic API
- **AND** uses Claude-specific message format
- **AND** handles streaming response
- **AND** counts tokens used

#### Scenario: Call Wenxin API

- **WHEN** user requests cloud AI feature with Wenxin selected
- **THEN** system sends request to Baidu API
- **AND** handles Chinese-specific encoding
- **AND** receives response within 10 seconds
- **AND** counts tokens used

### Requirement: API Key Management

The system SHALL securely store and manage API keys.

#### Scenario: Save API key

- **WHEN** user inputs API key in settings
- **THEN** system encrypts key using AES-256-GCM
- **AND** stores encrypted key in Chrome Storage
- **AND** derives encryption key from device fingerprint

#### Scenario: Validate API key

- **WHEN** user saves API key
- **THEN** system makes test API call
- **AND** validates key is working
- **AND** displays success or error message

#### Scenario: Use API key

- **WHEN** system needs to call cloud AI
- **THEN** retrieves encrypted key from storage
- **AND** decrypts key using device fingerprint
- **AND** includes key in API request

### Requirement: Token Counting

The system SHALL accurately count tokens consumed by cloud AI calls.

#### Scenario: Count GPT-4 tokens

- **WHEN** GPT-4 API returns response
- **THEN** system extracts token usage from response
- **AND** adds to monthly total for GPT-4
- **AND** updates token usage display

#### Scenario: Count Claude tokens

- **WHEN** Claude API returns response
- **THEN** system calculates tokens based on response metadata
- **AND** adds to monthly total for Claude
- **AND** updates token usage display

#### Scenario: Estimate tokens before call

- **WHEN** user initiates cloud AI request
- **THEN** system estimates token cost
- **AND** checks against remaining budget
- **AND** warns if exceeds budget

### Requirement: Error Handling

The system SHALL handle AI API errors gracefully.

#### Scenario: Network timeout

- **WHEN** cloud AI request times out after 10 seconds
- **THEN** system displays timeout error message
- **AND** offers retry option
- **AND** suggests checking network connection

#### Scenario: Invalid API key

- **WHEN** cloud AI returns authentication error
- **THEN** system displays "Invalid API key" message
- **AND** prompts user to check settings
- **AND** provides link to API key configuration

#### Scenario: Rate limit exceeded

- **WHEN** cloud AI returns rate limit error
- **THEN** system displays rate limit message
- **AND** suggests waiting before retry
- **AND** shows estimated wait time

#### Scenario: Local AI error

- **WHEN** Gemini Nano returns error
- **THEN** system falls back to rule engine
- **AND** logs error for debugging
- **AND** notifies user of degraded mode

### Requirement: Model Selection

The system SHALL allow users to select and switch between AI models.

#### Scenario: Set default model

- **WHEN** user selects default model in settings
- **THEN** system saves preference
- **AND** uses selected model for future requests
- **AND** displays current model in UI

#### Scenario: Switch model for specific request

- **WHEN** user manually selects model before request
- **THEN** system uses selected model for that request only
- **AND** reverts to default model for next request

#### Scenario: Auto-recommend model

- **WHEN** system detects Chinese technical documentation
- **THEN** recommends Wenxin model
- **AND** allows user to override recommendation

#### Scenario: Auto-recommend model for English

- **WHEN** system detects English academic paper
- **THEN** recommends Claude model
- **AND** allows user to override recommendation
