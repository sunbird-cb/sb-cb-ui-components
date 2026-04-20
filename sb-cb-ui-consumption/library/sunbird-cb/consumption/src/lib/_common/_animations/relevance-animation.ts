import { trigger, state, style, transition, animate } from '@angular/animations';

export const relevanceAnimation = trigger('toggleRelevance', [
  state('normal', style({
    transform: 'translateX(0)',
    width: '*'
  })),
  state('center', style({
    transform: 'translateX(50px)',
    width: 'auto'
  })),
  transition('normal <=> center', [
    animate('0.5s ease-in-out')
  ])
]);
