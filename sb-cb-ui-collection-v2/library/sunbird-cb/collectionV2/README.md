# @sunbird-cb/collectionV2

## Overview
This is a comprehensive collection library that combines components from both the UI Components library and the Creation Portal library. It provides a unified set of reusable Angular components for building Sunbird applications.

## Version
v0.0.1-cbrelease-5.0.0

## Features

### Component Categories

#### Common Components (90+ components)
- **Dialogs**: App tour, Certificate, Confirmation, Content rating
- **User Components**: Avatar, Profile image, User autocomplete, User image
- **Content Components**: Content picker, Content progress, Content TOC, Skeleton loader
- **Display Components**: Content type, Content type icon, Content display
- **Rating Components**: User content rating, Rating summary, Detailed rating
- **UI Elements**: Completion spinner, Language selector, Tour guide, Tips for learner
- **Attendance**: Attendance card, Attendance helper
- **Connection**: Connection hover card, Connection name

#### Button Components (30+ components)
- Navigation: Apps, Call, Catalog, Page back (admin/nav variants)
- Analytics: Channel analytics, KB analytics
- Content Actions: Download, Feedback (v1/v2), Like, Share, Mail me
- Social Share: Facebook, LinkedIn, Twitter
- Features: Follow, Fullscreen, Goals, KB, Playlist, Preview, Profile, Settings

#### Card Components (25+ components)
- **Activity & Network**: Activity card, Network card, Network home
- **Content**: Content card (v1/v2), Breadcrumb, Competency, Table, Rating comment
- **Business Specific**: Browse course, Carrier, Channel (v1/v2), Course, Discuss, Hubs list, Knowledge, Learn, Welcome

#### Content Components
- Content strips: Multiple, Single, Vertical, With tabs, New multiple
- Activity strips, Carrier strips, Discuss strips, Network strips
- Content assignment

#### Layout Components
- Grid layout, New grid layout
- Layout linear, Layout tab
- Left menu (v1/v2, without logo, scrollspy variant)
- Image map responsive, Intranet selector

#### Player Components
- Audio, Video, PDF, Slides, YouTube, Web pages, AMP, Survey

#### Profile Components
- Academics, Career, Competencies, Certifications, Departments, Hobbies

#### Business Components
- Challenge, Channel hub, Breadcrumbs org
- Discussion forum (with social actions: like, delete, vote)
- Tree, Tree catalog
- UI tables (admin, org v1/v2)

#### Form & Survey Components
- File upload control
- Group checkbox
- Survey player, Survey form question, Survey form section

#### Utility Components
- Gallery view, Graph general
- Selector responsive
- Sliders (standard, mobile, dynamic)
- Error resolver, Element HTML, Embedded page
- Page, Picker content
- Release notes

## Installation

```bash
npm install @sunbird-cb/collectionV2
```

## Peer Dependencies

This library requires the following peer dependencies:

```json
{
  "@angular/animations": "^16.2.12",
  "@angular/cdk": "^16.2.14",
  "@angular/common": "^16.2.12",
  "@angular/compiler": "^16.2.12",
  "@angular/core": "^16.2.12",
  "@angular/forms": "^16.2.12",
  "@angular/material": "^16.2.14",
  "@angular/platform-browser": "^16.2.12",
  "@angular/platform-browser-dynamic": "^16.2.12",
  "@angular/router": "^16.2.12",
  "@sunbird-cb/design-system": "0.0.1",
  "chart.js": "^2.9.4",
  "hammerjs": "^2.0.8",
  "moment": "^2.29.1",
  "ngx-image-cropper": "^3.3.4",
  "ngx-quill": "^7.1.2",
  "pdfjs-dist": "^2.6.347",
  "quill": "^1.3.7",
  "rxjs": "~6.5.2",
  "video.js": "^7.10.2"
}
```

## Usage

Import the modules you need in your Angular application:

```typescript
import { CardContentModule } from '@sunbird-cb/collectionV2';
import { BtnContentLikeModule } from '@sunbird-cb/collectionV2';
import { DiscussionForumModule } from '@sunbird-cb/collectionV2';

@NgModule({
  imports: [
    CardContentModule,
    BtnContentLikeModule,
    DiscussionForumModule,
    // ... other modules
  ]
})
export class AppModule { }
```

## What's New in V2

### Added from Reference Collection
- **__mocks__** directory for better testing support
- **_directives/** directory for custom directives
- **New Common Components**: Skeleton loader, Confirm dialog, Certificate dialog, Content TOC, Rating summary, Tips for learner, Attendance components, Connection components
- **New Card Components**: Card competency, Card content v2, Card rating comment
- **New Layout**: Left menu v1/v2, New grid layout
- **Survey Support**: Player survey, Survey form components
- **Enhanced Content**: Content strip with tabs
- **Dynamic Sliders**: Sliders dynamic component

### Retained from Workspace Collection
- All business-specific card components (20+ cards)
- Activity card and related components
- Breadcrumbs org, Challenge, Channel hub
- Group checkbox, Scrollspy left menu
- Video wrapper, Left menu without logo
- All custom business logic and services

## Component Count

- **Total Components**: 118+ directories
- **Common Components**: 32
- **Button Components**: 30+
- **Card Components**: 25+
- **Player Components**: 8
- **Layout Components**: 10+

## Building

```bash
ng build @sunbird-cb/collectionV2
```

## Testing

```bash
ng test @sunbird-cb/collectionV2
```

## Contributing

Please follow the contribution guidelines for adding new components or updating existing ones.

## License

MIT

## Support

For issues and questions, please refer to the main Sunbird CB repository.
