# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-01-02

### Changed

- **Migrated from Create React App to Vite** for faster build times and better developer experience
- **Upgraded React** from v18 to v19
- **Migrated backend to TypeScript** for improved type safety and maintainability
- Major dependencies upgrade;
  - `apollo-server-express` 2 → 3
  - `graphql` 15 → 16
  - `mongoose` 5 → 9
  - `@apollo/client` 3 → 4
  - `react-router-dom` 6 → 7

### Added

- Sliding session management with automatic token refresh
- Session expiration warning modal with countdown
- Password strength indicator on signup with validation feedback
- Zod schema validation
- Custom hooks for cleaner state management
- GraphQL error handling

### Fixed

- Project title input reverting when attempting to clear field during update
- Build output directories (`dist/`) removed from git tracking

## [2.0.1] - 2025-12-08

### Fixed

- Moved Tailwind output to public folder to bypass Create React App's CSS processing

## [2.0.0] - 2025-12-07

### Added

- Recent projects feature on home dashboard (displays 3 most recently opened projects)
- Floating label inputs with dynamic placeholder text
- Hover effects on project cards with lift and shadow animations
- `lastOpenedAt` timestamp tracking for projects
- Floating Action Button (FAB) for mobile project creation
- Comprehensive ARIA labels and accessibility improvements

### Changed

- **Complete UI migration from Bootstrap to Tailwind CSS v4**
- Optimized responsive design for mobile devices
- Improved form layouts with better vertical spacing
- Enhanced input focus states with teal accent colors
- Updated project cards with completion percentage display
- Performance optimizations with useMemo for expensive calculations
- Modal confiramtions with clear action labels

### Fixed

- Apollo cache issues causing stale data on navigation
- Date parsing for project timestamps
- Input validation and error handling in password recovery flow
- Mobile spacing issues

### Removed

- Bootstrap dependency and related CSS
- Unused font imports
- ScaleLoader library (replaced with CSS spinner)

## [1.0.0] - 2025-08-17

### Added

- Initial MVP of the task manager.
- CRUD functionality for tasks.
- User auth and basic dashboard.
