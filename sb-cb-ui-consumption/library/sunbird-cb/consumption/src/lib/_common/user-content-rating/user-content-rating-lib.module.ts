import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { UserContentRatingLibComponent } from './user-content-rating-lib.component';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';
import { SlidersLibModule } from '../sliders/sliders.module';
import { RatingService } from '../../_services/rating.service';
import { CardsModule } from '../cards/cards.module';
import { AvatarPhotoLibModule } from '../avatar-photo-lib/avatar-photo-lib.module';
import { SlidersNgContentLibModule } from '../sliders-ng-content/sliders-ng-content.module';
import { ScrollableItemModule } from '../../_directives/scrollable-item/scrollable-item.module';
import { UserContentRatingLibService } from './user-content-rating-lib.service';



@NgModule({
  declarations: [UserContentRatingLibComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    SkeletonLoaderLibModule,
    SlidersLibModule,
    CardsModule,
    AvatarPhotoLibModule,
    SlidersNgContentLibModule,
    ScrollableItemModule
  ],
  exports: [UserContentRatingLibComponent],
  providers: [RatingService, UserContentRatingLibService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class UserContentRatingLibModule { }
