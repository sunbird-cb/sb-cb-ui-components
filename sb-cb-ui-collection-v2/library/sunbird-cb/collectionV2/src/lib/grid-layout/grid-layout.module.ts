import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GridLayoutComponent } from './grid-layout.component'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'

@NgModule({
    declarations: [GridLayoutComponent],
    imports: [CommonModule, SbUiResolverModule],
    exports: [GridLayoutComponent]
})
export class GridLayoutModule { }
