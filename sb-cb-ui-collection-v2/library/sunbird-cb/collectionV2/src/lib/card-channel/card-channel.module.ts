import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardChannelComponent } from './card-channel.component'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { RouterModule } from '@angular/router'

@NgModule({
    declarations: [CardChannelComponent],
    imports: [
        CommonModule,
        RouterModule,
        // Material Imports
        MatCardModule,
        MatIconModule,
    ],
    exports: [CardChannelComponent]
})
export class CardChannelModule { }
