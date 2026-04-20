import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
import { AvatarPhotoLibComponent } from './avatar-photo-lib.component'

@NgModule({
    declarations: [AvatarPhotoLibComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatRippleModule,
        SbUiResolverModule,
    ],
    exports: [AvatarPhotoLibComponent]
})
export class AvatarPhotoLibModule { }
