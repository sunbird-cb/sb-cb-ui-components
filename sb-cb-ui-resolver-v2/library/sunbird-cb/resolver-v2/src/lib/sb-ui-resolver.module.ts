import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SbUiResolverDirective } from './sb-ui-resolver.directive'
import { RestrictedComponent } from './restricted/restricted.component'
import { InvalidRegistrationComponent } from './invalid-registration/invalid-registration.component'
import { InvalidPermissionComponent } from './invalid-permission/invalid-permission.component'
import { UnresolvedComponent } from './unresolved/unresolved.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { NsWidgetResolver } from './sb-ui-resolver.model'
import { SbUiResolverService } from './sb-ui-resolver.service'
import {
  WIDGET_RESOLVER_GLOBAL_CONFIG,
  WIDGET_RESOLVER_SCOPED_CONFIG,
} from './sb-ui-resolver.constant'
import { WidgetBaseComponent } from './sb-ui-base.component'
@NgModule({
    declarations: [
        WidgetBaseComponent,
        SbUiResolverDirective,
        RestrictedComponent,
        InvalidRegistrationComponent,
        InvalidPermissionComponent,
        UnresolvedComponent,
    ],
    imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
    exports: [SbUiResolverDirective, WidgetBaseComponent]
})
export class SbUiResolverModule {
  static forRoot(config: NsWidgetResolver.IRegistrationConfig[]): ModuleWithProviders<SbUiResolverModule> {
    return {
      ngModule: SbUiResolverModule,
      providers: [
        SbUiResolverService,
        {
          provide: WIDGET_RESOLVER_GLOBAL_CONFIG,
          useValue: config,
        },
        {
          provide: WIDGET_RESOLVER_SCOPED_CONFIG,
          useValue: [],
        },
      ],
    }
  }
  static forChild(config: NsWidgetResolver.IRegistrationConfig[]): ModuleWithProviders<SbUiResolverModule> {
    return {
      ngModule: SbUiResolverModule,
      providers: [
        SbUiResolverService,
        {
          provide: WIDGET_RESOLVER_SCOPED_CONFIG,
          useValue: config,
        },
      ],
    }
  }
}
