import { Component, Input } from '@angular/core';

@Component({
  selector: 'sb-uic-knowledge-level',
  templateUrl: './knowledge-level.component.html',
  styleUrls: ['./knowledge-level.component.scss']
})
export class KnowledgeLevelComponent {
  @Input() content: any;
}
