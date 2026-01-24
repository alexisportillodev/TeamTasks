import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightRisk]',
  standalone: true
})
export class HighlightRiskDirective implements OnInit {
  @Input() appHighlightRisk: number = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.appHighlightRisk === 1) {
      this.renderer.addClass(this.el.nativeElement, 'high-risk-row');
    }
  }
}
