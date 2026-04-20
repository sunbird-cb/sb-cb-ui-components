import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutTabComponent } from './layout-tab.component'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
@NgModule({
    declarations: [LayoutTabComponent],
    imports: [CommonModule, MatTabsModule, SbUiResolverModule]
})
export class LayoutTabModule {}
