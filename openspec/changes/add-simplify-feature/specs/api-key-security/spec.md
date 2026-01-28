# API Key Security Capability

## ADDED Requirements

### Requirement: API Key Encryption

The system SHALL encrypt API keys before storing them.

#### Scenario: Save API key

- **WHEN** user inputs API key in settings
- **THEN** system generates encryption key from device fingerprint
- **AND** encrypts API key using AES-256-GCM
- **AND** stores encrypted key in Chrome Storage (sync)
- **AND** does not store plaintext key

#### Scenario: Retrieve API key

- **WHEN** system needs to use API key
- **THEN** system retrieves encrypted key from Chrome Storage
- **AND** generates encryption key from device fingerprint
- **AND** decrypts API key using AES-256-GCM
- **AND** returns plaintext key for use

#### Scenario: Delete API key

- **WHEN** user deletes API key in settings
- **THEN** system removes encrypted key from Chrome Storage
- **AND** confirms deletion to user

### Requirement: Device Fingerprint Generation

The system SHALL generate a consistent device fingerprint for encryption key derivation.

#### Scenario: Generate device fingerprint

- **WHEN** system needs encryption key
- **THEN** system collects device information (userAgent, hardwareConcurrency, screen dimensions)
- **AND** hashes information using SHA-256
- **AND** derives encryption key from hash

#### Scenario: Device fingerprint changes

- **WHEN** device fingerprint changes (e.g., after OS reinstall)
- **THEN** system cannot decrypt existing API keys
- **AND** prompts user to re-enter API keys

### Requirement: API Key Validation

The system SHALL validate API keys before saving them.

#### Scenario: Validate OpenAI API key

- **WHEN** user saves OpenAI API key
- **THEN** system makes test API call to OpenAI
- **AND** if successful, displays "API key is valid"
- **AND** if failed, displays "Invalid API key"

#### Scenario: Validate Claude API key

- **WHEN** user saves Claude API key
- **THEN** system makes test API call to Anthropic
- **AND** if successful, displays "API key is valid"
- **AND** if failed, displays "Invalid API key"

#### Scenario: Skip validation on user request

- **WHEN** user chooses to skip validation
- **THEN** system saves API key without validation
- **AND** warns user that key may not work

### Requirement: Secure API Key Usage

The system SHALL use API keys securely without exposing them.

#### Scenario: Use API key in request

- **WHEN** system makes cloud AI request
- **THEN** system decrypts API key
- **AND** includes key in request header
- **AND** does not log key value
- **AND** clears key from memory after use

#### Scenario: Handle API key in error messages

- **WHEN** API request fails
- **THEN** system logs error without API key
- **AND** displays error message without API key
- **AND** does not expose key in console

### Requirement: API Key Management UI

The system SHALL provide user interface for managing API keys.

#### Scenario: Display API key input

- **WHEN** user opens Options page
- **THEN** system displays API key input fields
- **AND** masks API key values (shows only last 4 characters)
- **AND** provides "Show/Hide" toggle

#### Scenario: Save API key from UI

- **WHEN** user enters API key and clicks "Save"
- **THEN** system validates key (if not skipped)
- **AND** encrypts and stores key
- **AND** displays success message

#### Scenario: Delete API key from UI

- **WHEN** user clicks "Delete" button
- **THEN** system prompts for confirmation
- **AND** if confirmed, deletes encrypted key
- **AND** displays success message

#### Scenario: Test API key from UI

- **WHEN** user clicks "Test" button
- **THEN** system makes test API call
- **AND** displays result (success or error)
- **AND** does not save key if test fails
