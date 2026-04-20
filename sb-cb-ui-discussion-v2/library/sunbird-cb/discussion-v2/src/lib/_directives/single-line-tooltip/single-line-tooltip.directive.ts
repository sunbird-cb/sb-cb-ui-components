
import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { MatLegacyTooltip as MatTooltip } from '@angular/material/legacy-tooltip'

@Directive({
  selector: '[dV2SingleLineTooltip]',
  providers: [MatTooltip] 
})
export class SingleLineTooltipDirective implements AfterViewInit, OnDestroy {
  private resizeObserver: ResizeObserver;
  private tooltip: MatTooltip;

  constructor(
    private el: ElementRef,
    tooltip: MatTooltip
  ) {
    this.tooltip = tooltip;
    this.resizeObserver = new ResizeObserver(() => this.checkForEllipsis());
     // Add hover listeners
     this.el.nativeElement.addEventListener('mouseenter', () => {
      if (!this.tooltip.disabled) {
        this.tooltip.show();
      }
    });

    this.el.nativeElement.addEventListener('mouseleave', () => {
      this.tooltip.hide();
    });
  }

  ngAfterViewInit() {
    this.resizeObserver.observe(this.el.nativeElement);
    this.checkForEllipsis();
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
  }

  private checkForEllipsis() {
    const element = this.el.nativeElement;
    const isEllipsisActive = element.offsetWidth < element.scrollWidth;
    
    if (isEllipsisActive ) {
      this.tooltip.message = element.textContent;
      this.tooltip.disabled = false;
      // this.tooltip.show();

    } else {
      this.tooltip.disabled = true;
    }
  }
}