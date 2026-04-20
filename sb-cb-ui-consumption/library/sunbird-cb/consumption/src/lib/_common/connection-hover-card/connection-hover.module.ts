import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { PipeNameTransformModule } from '@sunbird-cb/utils-v2'
import { FormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { ConnectionHoverCardComponent } from './connection-hover-card.component'
import { TooltipDirective } from '../../_directives/tooltip/tooltip.directive'
import { AvatarPhotoLibModule } from '../avatar-photo-lib/avatar-photo-lib.module'

@NgModule({
    declarations: [ConnectionHoverCardComponent, TooltipDirective],
    imports: [
        CommonModule,
        PipeNameTransformModule,
        FormsModule,
        AvatarPhotoLibModule,
        MatIconModule,
        MatCardModule,
    ],
    exports: [ConnectionHoverCardComponent, TooltipDirective],
    providers: []
})
export class ConnectionHoverModule {

}
