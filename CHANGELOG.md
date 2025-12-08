# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
