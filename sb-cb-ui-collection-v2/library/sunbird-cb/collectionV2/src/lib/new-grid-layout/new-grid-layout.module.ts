import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NewGridLayoutComponent } from './new-grid-layout.component'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'

@NgModule({
    declarations: [NewGridLayoutComponent],
    imports: [CommonModule, SbUiResolverModule],
    exports: [NewGridLayoutComponent]
})
export class NewGridLayoutModule { }
