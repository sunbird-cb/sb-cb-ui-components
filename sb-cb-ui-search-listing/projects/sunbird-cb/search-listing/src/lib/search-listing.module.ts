import { importProvidersFrom, NgModule } from "@angular/core";
import { SearchListingComponent } from "./search-listing.component";
import { GlobalSearchComponent } from "./routes/global-search/global-search.component";
import { LearnSearchComponent } from "./routes/learn-search/learn-search.component";
import { SearchFiltersComponent } from "./_components/search-filters/search-filters.component";
import { SearchInputHomeComponent } from "./_components/search-input-home/search-input-home.component";
import { SearchEventCardComponent } from "./_components/search-event-card/search-event-card.component";
import { PeopleConnectionCardComponent } from "./_components/people-connection-card/people-connection-card.component";
import { CommunityContentCardComponent } from "./_components/community-content-card/community-content-card.component";
import { CourseContentCardComponent } from "./_components/course-content-card/course-content-card.component";
import { NumberShortenerPipe } from "./_pipes/number-shortener.pipe";
import { PluralPipe } from "./_pipes/plural.pipe";
import { PaginationComponent } from "./_components/pagination/pagination.component";
import { SearchSortInputComponent } from "./_components/search-sort-input/search-sort-input.component";
import { SkeletonLoaderContentComponent } from "./_components/skeleton-loader-content/skeleton-loader-content.component";
import { CommonModule } from "@angular/common";
import { SearchListingRoutingModule } from "./search-listing-routing.module";

import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatLegacyChipsModule as MatChipsModule } from "@angular/material/legacy-chips";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyListModule as MatListModule } from "@angular/material/legacy-list";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacySlideToggleModule as MatSlideToggleModule } from "@angular/material/legacy-slide-toggle";
import { MatLegacyTabsModule as MatTabsModule } from "@angular/material/legacy-tabs";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatLegacyOptionModule as MatOptionModule } from "@angular/material/legacy-core";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { DefaultThumbnailModule, HorizontalScrollerModule, PipeDurationTransformModule, PipePublicURLModule } from "@sunbird-cb/utils-v2";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatLegacyRadioModule as MatRadioModule } from "@angular/material/legacy-radio";
import { SkeletonLoaderComponent } from "./_components/skeleton-loader/skeleton-loader.component";
import { TranslateModule } from "@ngx-translate/core";
import { SkeletonLoaderPeoplesComponent } from "./_components/skeleton-loader-peoples/skeleton-loader-peoples.component";
import { AvatarPhotoModule } from "./_components/avatar-photo/avatar-photo.module";
import { DesignationCardComponent } from "./_components/designation-card/designation-card.component";
import { TrainingPlansCardComponent } from "./_components/training-plans-card/training-plans-card.component";
import { UsersCardComponent } from "./_components/users-card/users-card.component";
import { DefaultMatCalendarRangeStrategy, MatDatepickerModule, MatRangeDateSelectionModel } from "@angular/material/datepicker";
import { UserUpdateModule, DialogComponentsModule } from '@sunbird-cb/consumption'
import { MatLegacyDialogModule } from "@angular/material/legacy-dialog";

@NgModule({
  declarations: [
    SearchListingComponent,
    GlobalSearchComponent,
    LearnSearchComponent,
    SearchFiltersComponent,
    SearchInputHomeComponent,
    CourseContentCardComponent,
    SearchEventCardComponent,
    PeopleConnectionCardComponent,
    CommunityContentCardComponent,
    NumberShortenerPipe,
    PluralPipe,
    PaginationComponent,
    SearchSortInputComponent,
    SkeletonLoaderContentComponent,
    SkeletonLoaderPeoplesComponent,
    SkeletonLoaderComponent,
    DesignationCardComponent,
    TrainingPlansCardComponent,
    UsersCardComponent
  ],
  imports: [
    CommonModule,
    SearchListingRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatListModule,
    MatSelectModule,
    MatCardModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatRippleModule,
    DefaultThumbnailModule,
    MatTooltipModule,
    PipeDurationTransformModule,
    PipePublicURLModule,
    HorizontalScrollerModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    AvatarPhotoModule,
    MatRadioModule,
    TranslateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    UserUpdateModule,
    DialogComponentsModule,
    MatLegacyDialogModule
  ],
  exports: [SearchListingComponent, SearchInputHomeComponent],
  providers: [importProvidersFrom(MatNativeDateModule), MatRangeDateSelectionModel, DefaultMatCalendarRangeStrategy]
})
export class SearchListingModule {}
