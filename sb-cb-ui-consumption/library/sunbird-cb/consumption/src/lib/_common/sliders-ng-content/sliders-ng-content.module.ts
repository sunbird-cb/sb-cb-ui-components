import { NgModule, Injectable } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SlidersNgContentLibComponent } from './sliders-ng-content.component'
import { RouterModule } from '@angular/router'
import {  ImageResponsiveModule } from '../../_directives/image-responsive/image-responsive.module'
// import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser'
/* tslint:disable */
// import  Hammer from 'hammerjs'
import { NavigationModule } from '../../_directives/navigation/navigation.module'
/* tslint:enable */
@Injectable()
// export class MyHammerConfig extends HammerGestureConfig {
//   buildHammer(element: HTMLElement) {
//     const mc = new Hammer(element, {
//       touchAction: 'pan-y',
//     })
//     return mc
//   }
// }

// tslint:disable-next-line: max-classes-per-file
@NgModule({
    declarations: [SlidersNgContentLibComponent],
    imports: [
        CommonModule,
        RouterModule,
        NavigationModule,
        ImageResponsiveModule,
    ],
    exports: [SlidersNgContentLibComponent],
    providers: [
    // {
    //   provide: HAMMER_GESTURE_CONFIG,
    //   useClass: MyHammerConfig,
    // },
    ]
})
export class SlidersNgContentLibModule { }
