# Functional Requirements - phenotypeActions

## FR-RW-001: Multi-Wave Review Orchestration
The workflow SHALL execute review bots in configurable sequential waves.

## FR-RW-002: Bot Configuration
The workflow SHALL accept comma-separated bot lists per wave via inputs.

## FR-PG-001: Policy Gate Enforcement
The workflow SHALL block PR merge when policy violations exceed configured severity.

## FR-SG-001: Security Scanning
The security guard workflow SHALL run shell-based security checks on PR diffs.

## FR-SG-002: Hook Audit
The hook audit workflow SHALL verify security guard hooks are properly installed.

## FR-TS-001: Template Synchronization
The template sync action SHALL distribute workflow templates to target repos.

## FR-VP-001: Action Metadata Validation
The packaging validator SHALL verify action.yml files have required fields (name, description, inputs, outputs).

## FR-VP-002: Shellcheck Compliance
All shell scripts SHALL pass shellcheck without errors.
