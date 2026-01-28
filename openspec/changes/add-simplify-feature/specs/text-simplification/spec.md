# Text Simplification Capability

## ADDED Requirements

### Requirement: Text Preprocessing

The system SHALL preprocess selected text before simplification.

#### Scenario: Clean text with extra whitespace

- **WHEN** user selects text with multiple spaces and newlines
- **THEN** system removes extra whitespace
- **AND** preserves single spaces between words
- **AND** processing time is less than 10ms

#### Scenario: Detect Chinese text

- **WHEN** user selects text containing Chinese characters
- **THEN** system detects language as 'zh'
- **AND** returns cleaned text

#### Scenario: Detect English text

- **WHEN** user selects text containing only English characters
- **THEN** system detects language as 'en'
- **AND** returns cleaned text

#### Scenario: Detect mixed language text

- **WHEN** user selects text containing both Chinese and English
- **THEN** system detects language as 'mixed'
- **AND** returns cleaned text

### Requirement: Cloud AI Simplification

The system SHALL use cloud AI providers for text simplification.

#### Scenario: Call OpenAI GPT-4

- **WHEN** user has configured GPT-4 API key
- **AND** user requests text simplification
- **THEN** system sends request to OpenAI API
- **AND** includes API key in Authorization header
- **AND** receives response within 10 seconds
- **AND** returns SimplifyResult with provider='gpt4'

#### Scenario: Call Anthropic Claude

- **WHEN** user has configured Claude API key
- **AND** user requests text simplification
- **THEN** system sends request to Anthropic API
- **AND** includes API key in x-api-key header
- **AND** receives response within 10 seconds
- **AND** returns SimplifyResult with provider='claude'

#### Scenario: Call Baidu Wenxin

- **WHEN** user has configured Wenxin API key
- **AND** user requests text simplification
- **THEN** system sends request to Baidu API
- **AND** receives response within 10 seconds
- **AND** returns SimplifyResult with provider='wenxin'

#### Scenario: No API key configured

- **WHEN** user requests text simplification
- **AND** no API key is configured
- **THEN** system displays error message "请先配置 API 密钥"
- **AND** provides link to Options page

#### Scenario: Invalid API key

- **WHEN** cloud AI returns authentication error
- **THEN** system displays error message "API 密钥无效，请检查设置"
- **AND** provides link to Options page

#### Scenario: Network error

- **WHEN** cloud AI request fails due to network error
- **THEN** system displays error message "网络连接失败，请检查网络"
- **AND** suggests retrying

#### Scenario: Request timeout

- **WHEN** cloud AI request exceeds 10 seconds
- **THEN** system cancels request
- **AND** displays error message "请求超时，请重试"

#### Scenario: Rate limit exceeded

- **WHEN** cloud AI returns rate limit error
- **THEN** system displays error message "API 调用次数已达上限"
- **AND** suggests waiting before retry

### Requirement: Domain-Aware Simplification

The system SHALL adapt simplification strategy based on detected domain.

#### Scenario: Simplify technical documentation

- **WHEN** AI detects domain as "technical documentation"
- **THEN** system preserves API names and code syntax
- **AND** breaks down complex sentences
- **AND** maintains technical accuracy

#### Scenario: Simplify academic paper

- **WHEN** AI detects domain as "academic paper"
- **THEN** system preserves formulas and citations
- **AND** explains complex concepts in simpler terms
- **AND** maintains academic rigor

#### Scenario: Simplify code snippet

- **WHEN** AI detects domain as "code"
- **THEN** system preserves code syntax
- **AND** explains code functionality
- **AND** highlights key logic

#### Scenario: Simplify general text

- **WHEN** AI detects domain as "general text"
- **THEN** system uses balanced simplification strategy
- **AND** replaces complex words with simpler ones
- **AND** maintains original meaning

### Requirement: UI Integration

The system SHALL integrate simplification feature into existing UI components.

#### Scenario: Click simplify button

- **WHEN** user selects text and clicks "简化" button
- **THEN** system displays loading state in button
- **AND** calls SimplifyService
- **AND** displays result or error in ResultCard

#### Scenario: Display simplification result

- **WHEN** simplification completes successfully
- **THEN** system displays simplified text in ResultCard
- **AND** displays domain and confidence
- **AND** displays processing time and provider used
- **AND** enables copy button

#### Scenario: Display error message

- **WHEN** simplification fails
- **THEN** system displays error message in ResultCard
- **AND** provides actionable suggestions
- **AND** hides metadata section

### Requirement: API Key Configuration

The system SHALL provide user interface for configuring API keys.

#### Scenario: Configure API key in Options

- **WHEN** user opens Options page
- **THEN** system displays API key configuration section
- **AND** shows input fields for each provider
- **AND** masks API key values (shows only last 4 characters)

#### Scenario: Save API key

- **WHEN** user enters API key and clicks "Save"
- **THEN** system validates key (optional)
- **AND** encrypts and stores key
- **AND** displays success message

#### Scenario: Test API key

- **WHEN** user clicks "Test" button
- **THEN** system makes test API call
- **AND** displays result (success or error)
- **AND** shows detailed error message if failed
