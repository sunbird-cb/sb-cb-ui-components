import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeRelativeTimePipe } from './pipe-relative-time/pipe-relative-time.pipe'
import { NumberShortenerPipe } from './number-shortener/number-shortener.pipe'
import { FilterSearchPipe } from './filter-search/filter-search.pipe'
import { PluralPipe } from './plural/plural.pipe'
import { MentionHighlightPipe } from './mention-highlight.pipe'


@NgModule({
  declarations: [PipeRelativeTimePipe, NumberShortenerPipe, FilterSearchPipe, PluralPipe, MentionHighlightPipe],
  imports: [
    CommonModule,
  ],
  exports: [PipeRelativeTimePipe, NumberShortenerPipe, FilterSearchPipe, PluralPipe, MentionHighlightPipe],
})
export class PipesModule { }
