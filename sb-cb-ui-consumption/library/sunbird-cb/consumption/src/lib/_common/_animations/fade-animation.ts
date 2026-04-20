import { trigger, transition, style, animate } from "@angular/animations";

export const fadeAnimation = trigger("fadeInOut", [
  transition(":enter", [
    style({ opacity: 0 }),
    animate("0.1s ease-in", style({ opacity: 1 })),
  ]),
  transition(":leave", [
    animate("0.1s ease-out", style({ opacity: 0 })),
  ]),
]);
