import { Component, Input, OnInit } from '@angular/core';
import { FrameworkService } from './services/framework.service';

@Component({
  selector: 'd-v2-tree-hierarchy',
  templateUrl: './tree-hierarchy.component.html',
  styleUrls: ['./tree-hierarchy.component.scss'],
})
export class TreeHierarchyComponent implements OnInit {
  @Input() environment: any;
  @Input() taxonomyConfig: any;
  
  constructor(private frameworkService: FrameworkService) { 
  }

  ngOnInit(): void {
    this.frameworkService.updateEnvironment(this.environment);
    this.frameworkService.setConfig(this.taxonomyConfig);
  }
}
