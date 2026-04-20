// Ambient type declarations for third-party libraries

// Fix for ckeditor5 module resolution
declare module 'ckeditor5' {
  export * from '@ckeditor/ckeditor5-core'
  export * from '@ckeditor/ckeditor5-engine'
  export * from '@ckeditor/ckeditor5-ui'
  export * from '@ckeditor/ckeditor5-utils'
}

// Fix for ckeditor5-watchdog
declare module '@ckeditor/ckeditor5-watchdog/src/watchdog' {
  const WatchdogConfig: any
  export default WatchdogConfig
}

// Fix for Chart.js type
declare const Chart: any

// Fix for HammerJS type
declare const HammerManager: any

// Fix for ngx-quill ModuleWithProviders
declare module 'ngx-quill' {
  import { ModuleWithProviders } from '@angular/core'

  export interface QuillConfig {
    [key: string]: any
  }

  export class QuillModule {
    static forRoot(config?: QuillConfig): ModuleWithProviders<QuillModule>
  }

  export class QuillEditorComponent {
    [key: string]: any
  }
}
