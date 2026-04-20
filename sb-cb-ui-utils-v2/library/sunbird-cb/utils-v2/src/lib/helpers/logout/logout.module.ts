import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'

import { LogoutComponent } from './logout.component'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
    declarations: [LogoutComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        TranslateModule,
    ]
})
export class LogoutModule { }
