import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TreeHierarchyComponent } from './tree-hierarchy.component';
import { MaterialModule } from '../material.module';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { ApprovalComponent } from './components/approval/approval.component';
import { ApproveViewComponent } from './components/approve-view/approve-view.component';
import { CategoriesPreviewComponent } from './components/categories-preview/categories-preview.component';
import { ConforamtionPopupComponent } from './components/conforamtion-popup/conforamtion-popup.component';
import { ConnectorComponent } from './components/connector/connector.component';
import { CreateCategoriesComponent } from './components/create-categories/create-categories.component';
import { CreateTermFromFrameworkComponent } from './components/create-term-from-framework/create-term-from-framework.component';
import { CreateTermComponent } from './components/create-term/create-term.component';
import { PendingApprovalComponent } from './components/pending-approval/pending-approval.component';
import { TreeColumnViewComponent } from './components/tree-column-view/tree-column-view.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { TermCardComponent } from './components/term-card/term-card.component';
import { ConfigFrameworkComponent } from './containers/config-framework/config-framework.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { TreeEditorRoutingModule } from './tree-hierarchy-routing.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';
import { FrameworkService } from './services/framework.service';
import { ConnectorService } from './services/connector.service';
import { LocalConnectionService } from './services/local-connection.service';
import { OdcsService } from './services/odcs.service';
import { IConnectionType } from './models/connection-type.model';
import { ENVIRONMENT } from './services/connection.service';
import { OrgHierarchyAddModalComponent } from './components/org-hierarchy-add-modal/org-hierarchy-add-modal.component';
import { TreeHierarchyService } from './tree-hierarchy.service';
import { CategoryEditModuleComponent } from './components/category-edit/category-edit-module/category-edit-module.component';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    TreeHierarchyComponent,
    DashboardComponent,
    ConfigFrameworkComponent,
    CreateCategoriesComponent,
    ConfigFrameworkComponent,
    TreeViewComponent,
    TermCardComponent,
    TreeColumnViewComponent,
    CategoriesPreviewComponent,
    CategoriesPreviewComponent,
    CreateTermComponent,
    ConnectorComponent,
    ActionBarComponent,
    ApprovalComponent,
    PendingApprovalComponent,
    ApproveViewComponent,
    OrderByPipe,
    ConforamtionPopupComponent,
    CreateTermFromFrameworkComponent,
    OrgHierarchyAddModalComponent,
    CategoryEditModuleComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TreeEditorRoutingModule,
    MatChipsModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
    { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '0ms' } },
    FrameworkService,
    ConnectorService,
    LocalConnectionService,
    OdcsService,
    TreeHierarchyService
  ],
  exports: [
    TreeHierarchyComponent,
    CreateCategoriesComponent,
    ConfigFrameworkComponent,
    TreeViewComponent,
    TermCardComponent,
    CategoriesPreviewComponent
  ]
})
export class TreeHierarchyModule { 
  static forRoot(config: IConnectionType): ModuleWithProviders<TreeHierarchyModule> {
    return {
      ngModule: TreeHierarchyModule,
      providers: [
        // LocalConnectionService,
        {
          provide: ENVIRONMENT,
          useValue: config
        }
      ]
    };
  }
}