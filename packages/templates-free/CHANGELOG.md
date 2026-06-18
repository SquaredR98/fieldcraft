# Changelog

All notable changes to `@squaredr/fieldcraft-templates-free` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-06-18

### Added
- CHANGELOG.md with retroactive entries for all published versions
- README.md with full template catalog, install instructions, and usage examples

## [1.1.0] - 2026-06-08

### Added
- 11 new production-ready form schemas (16 total):
  - **General:** Event Registration, Lead Generation, Feature Request, Quick Poll, Product Knowledge Quiz
  - **HR:** Job Application, Onboarding Checklist, Exit Interview, 360° Performance Review, Time Off Request, Expense Report
- Template metadata system with `TemplateMeta` type (id, name, description, category, fieldCount, sectionCount, tags)
- `TemplateCategory` type: `general`, `feedback`, `marketing`, `support`, `hr`, `ecommerce`, `healthcare`
- `allTemplates` collection export for browsing all templates
- Templates use advanced features: conditional logic, Likert scales, NPS fields, draft saving, progress bars

### Fixed
- Likert scale options added to feedback survey template

## [1.0.0] - 2026-05-25

### Added
- Initial release with 5 form schema templates:
  - Contact Form (2 sections, 5 fields)
  - Feedback Survey (3 sections, 12 fields)
  - NPS Survey (2 sections, 5 fields)
  - Newsletter Signup (1 section, 3 fields)
  - Bug Report (2 sections, 8 fields)
- Each template exports `schema`, `meta`, and combined `Template` object
- TypeScript types for `Template`, `TemplateMeta`, `TemplateCategory`
