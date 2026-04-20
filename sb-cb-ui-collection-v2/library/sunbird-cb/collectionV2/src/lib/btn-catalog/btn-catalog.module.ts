import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'

import { BtnCatalogComponent } from './btn-catalog.component'
import { TreeCatalogModule } from '../tree-catalog/tree-catalog.module'

@NgModule({
    declarations: [BtnCatalogComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        TreeCatalogModule,
    ]
})
export class BtnCatalogModule { }
