import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AvatarPhotoComponent } from "./avatar-photo.component";
import { PipeCertificateImageURLModule } from "@sunbird-cb/utils-v2";

@NgModule({
  declarations: [AvatarPhotoComponent],
  imports: [CommonModule, PipeCertificateImageURLModule],
  exports: [AvatarPhotoComponent]
})
export class AvatarPhotoModule {}
