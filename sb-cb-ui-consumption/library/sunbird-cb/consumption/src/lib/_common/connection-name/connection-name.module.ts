import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionNameComponent } from './connection-name.component';
import { ConnectionHoverModule } from '../connection-hover-card/connection-hover.module'
@NgModule({
  declarations: [ConnectionNameComponent],
  imports: [
    CommonModule,
    ConnectionHoverModule,
  ],
  exports: [ConnectionNameComponent]
})
export class ConnectionNameModule { }
