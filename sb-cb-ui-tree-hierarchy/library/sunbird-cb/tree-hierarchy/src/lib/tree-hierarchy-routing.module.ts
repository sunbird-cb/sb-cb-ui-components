import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TreeViewComponent } from './components/tree-view/tree-view.component'
import { ApprovalComponent } from './components/approval/approval.component'
import { ConfigFrameworkComponent } from './containers/config-framework/config-framework.component'
import { ApproveViewComponent } from './components/approve-view/approve-view.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: TreeViewComponent,
    },
    {
        path:'home', component:ConfigFrameworkComponent
    },
    {
        path:'dashboard', component:TreeViewComponent
    },
    {
        path:'approval',  component:ApprovalComponent
    },
    {
        path:'approval/:id',  component:ApproveViewComponent
    }
]
@NgModule({
    imports: [
      RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
    providers: [],
  })
  export class TreeEditorRoutingModule { }
  