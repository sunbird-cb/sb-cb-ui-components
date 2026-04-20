import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { MatLegacyTooltip as MatTooltip } from '@angular/material/legacy-tooltip'

@Directive({
  selector: '[dV2MultiLineElipsis]',
  providers: [MatTooltip] 
})
export class MultiLineEllipsisDirective implements AfterViewInit, OnDestroy {
  private tooltip: MatTooltip;
  private resizeObserver: ResizeObserver;

  constructor(
    private elementRef: ElementRef,
    tooltip: MatTooltip
  ) {
    this.tooltip = tooltip;
    this.resizeObserver = new ResizeObserver(() => this.checkTooltip());
    this.elementRef.nativeElement.addEventListener('mouseenter', () => {
      if (!this.tooltip.disabled) {
        this.tooltip.show();
      }
    });

    this.elementRef.nativeElement.addEventListener('mouseleave', () => {
      this.tooltip.hide();
    });
  }

  ngAfterViewInit() {
    this.resizeObserver.observe(this.elementRef.nativeElement);
    this.checkTooltip();
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
  }

  private checkTooltip() {
    const element = this.elementRef.nativeElement;
    const isEllipsisActive = element.scrollHeight > element.clientHeight;

    if (isEllipsisActive) {
      this.tooltip.message = element.textContent;
      this.tooltip.disabled = false;
    } else {
      this.tooltip.disabled = true;
    }
  }
}



