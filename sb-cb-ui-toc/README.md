# sb-cb-ui-toc

This library contains Table of Contents (TOC) components and modules for Sunbird CB.

## Overview

This package contains all the components, services, models, and resolvers related to the Table of Contents functionality, including:
- TOC home and overview pages
- Content cards and sessions
- Cohorts management
- Analytics and certifications
- Discussion integration
- Enrollment forms and questionnaires

## Installation

```bash
npm install @sunbird-cb/toc
```

## Important Documentation

Before using this package, please review:

1. **[MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)** - Comprehensive guide for migrating from app-toc to this package
2. **[EXTERNAL-DEPENDENCIES.md](./EXTERNAL-DEPENDENCIES.md)** - Detailed list of all external dependencies that must be provided

## Quick Start

### Basic Usage

Import the required modules in your Angular application:

```typescript
import { AppTocModule } from '@sunbird-cb/toc';

@NgModule({
  imports: [
    AppTocModule
  ]
})
export class AppModule { }
```

### Required Dependencies

This package has external dependencies that must be provided by the consuming application. See [EXTERNAL-DEPENDENCIES.md](./EXTERNAL-DEPENDENCIES.md) for the complete list.

**Application Services Required**:
- GeneralGuard
- FormDataResolverService
- MobileAppsService
- NetCoreService
- AppPublicTocResolverService

**Package Services Required** (when properly exported):
- RatingService (from @sunbird-cb/collection)
- ApiService, AccessControlService, EditorService (from @sunbird-cb/author)
- UserProfileService, OtpService (from @sunbird-cb/user-profile)

## Features

### Components

- **Home & Overview**: Display TOC content in various layouts
- **Content Cards**: Show content information with actions
- **Sessions**: Manage learning sessions
- **Cohorts**: Handle cohort enrollment and management
- **Analytics**: Display learning analytics and progress
- **Certification**: Manage certifications
- **Discussion**: Integrated discussion functionality
- **Forms**: Enrollment and survey forms

### Services

- `AppTocService`: Core TOC functionality
- `ActionService`: Handle user actions
- `TitleTagService`: Manage page titles and meta tags
- And more...

### Routing

The package includes a pre-configured routing module (AppTocRoutingModule), but **routing is optional**. You can:

**Option 1: Configure routing in your application** (Recommended)
```typescript
import { Routes } from '@angular/router';
import { AppTocHomeV2Component } from '@sunbird-cb/toc';

const routes: Routes = [
  {
    path: 'toc/:id',
    component: AppTocHomeV2Component,
    // Add your guards, resolvers, etc.
  }
];
```

**Option 2: Use the pre-configured routing module**
```typescript
import { AppTocRoutingModule } from '@sunbird-cb/toc';

@NgModule({
  imports: [
    AppTocRoutingModule // Import only if you want pre-configured routes
  ]
})
export class AppRoutingModule { }
```

**Note**: Pre-configured routes require guards and resolvers (GeneralGuard, FormDataResolverService) which are commented out. See EXTERNAL-DEPENDENCIES.md for details.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via Jest.

## Current Status

⚠️ **Beta Version**: This package is currently in beta. Some external dependencies need to be properly configured:

- Import paths for external services are documented but commented out
- Some services need to be exported from their respective packages
- Integration testing is ongoing

See [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md) for detailed migration steps and current status.

## Contributing

When contributing to this package:

1. Ensure all new components are properly exported in `public-api.ts`
2. Update documentation for any new dependencies
3. Add unit tests for new functionality
4. Update MIGRATION-GUIDE.md if adding external dependencies

## Version

Current version: 0.0.1

## License

See LICENSE file for details.

## Support

For questions or issues:
- Review the MIGRATION-GUIDE.md
- Check EXTERNAL-DEPENDENCIES.md
- Contact the development team
- Create an issue in the repository

