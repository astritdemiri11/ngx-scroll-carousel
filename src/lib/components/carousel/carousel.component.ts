import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { interval, Subscription, timer } from 'rxjs';

import { CarouselItemDirective } from '../../directives/carousel-item/carousel-item.directive';
import { CarouselConfig as CarouselConfigInterface } from '../../models/carousel/carousel-config.interface';
import { CarouselConfig } from '../../models/carousel/carousel-config.model';

@Component({
  selector: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, OnChanges, AfterContentInit, AfterContentChecked, OnDestroy {
  @Output() scroll: EventEmitter<number>;
  @Input() configs?: CarouselConfigInterface;
  @ViewChild('carouselContainer') carouselContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('control', { static: false }) control?: ElementRef;
  @ViewChildren('navigation') navigation?: QueryList<ElementRef>;
  @ContentChildren(CarouselItemDirective, { read: ElementRef }) carouselItems?: QueryList<ElementRef>;
  data: CarouselConfig;
  index: number;
  controls: number[];
  scrolling: boolean;

  private content: string;
  private itemsLength: number;
  private scrollDuration: number;
  private changesApplied: boolean;
  private subscriptions: Subscription[];
  private interval$?: Subscription;

  constructor(public renderer2: Renderer2) {
    this.scroll = new EventEmitter();
    this.data = new CarouselConfig({ items: 0 });
    this.controls = [];

    this.content = '';
    this.index = 0;
    this.itemsLength = 0;
    this.scrollDuration = 500;
    this.changesApplied = false;
    this.scrolling = false;
    this.subscriptions = [];
  }

  onPrev(event: Event) {
    event.preventDefault();

    if (!this.controls.length) {
      return;
    }

    if (this.interval$) {
      this.interval$.unsubscribe();
    }

    this.goToPrev();

    if (this.data.autoplay) {
      this.startCarousel();
    }
  }

  onNext(event: Event) {
    event.preventDefault();

    if (!this.controls.length) {
      return;
    }

    if (this.interval$) {
      this.interval$.unsubscribe();
    }

    this.goToNext(1, true);

    if (this.data.autoplay) {
      this.startCarousel();
    }
  }

  onControl(index: number) {
    if (this.scrolling || !this.controls.length) {
      return;
    }

    if (this.interval$) {
      this.interval$.unsubscribe();
    }

    if (this.index > index) {
      this.goToPrev(this.index - index);
    } else {
      this.goToNext(index - this.index);
    }

    if (this.data.autoplay) {
      this.startCarousel();
    }
  }

  onControlsOver(event: Event) {
    this.renderer2.addClass(event.currentTarget, this.data.controlsOverClass);
  }

  onControlsLeave(event: Event) {
    this.renderer2.removeClass(event.currentTarget, this.data.controlsOverClass);
  }

  onNavigationOver(event: Event) {
    this.renderer2.addClass(event.currentTarget, this.data.navigationOverClass);
  }

  onNavigationLeave(event: Event) {
    this.renderer2.removeClass(event.currentTarget, this.data.navigationOverClass);
  }

  getControlsActiveClass(control: number) {
    if (this.index === control) {
      return this.data.controlsActiveClass;
    }

    return '';
  }

  ngAfterContentInit() {
    if (this.carouselContainer) {
      this.content = this.carouselContainer.nativeElement.innerHTML;
    }
  }

  ngAfterContentChecked() {
    if (!this.carouselItems) {
      return;
    }

    if (this.carouselContainer) {
      if (this.content === this.carouselContainer.nativeElement.innerHTML) {
        return;
      }

      this.content = this.carouselContainer.nativeElement.innerHTML;
    }

    if (!this.configs) {
      return;
    }

    if (!this.configs.omitChanges || !this.changesApplied) {
      this.restart();
      this.changesApplied = true;
    }
  }

  ngOnInit() {
    if (!this.configs) {
      throw new Error(`carousel component, [configs] attribute is required`);
    }

    this.data = new CarouselConfig(this.configs);
    this.restart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['configs']) {
      this.configs = changes['configs'].currentValue;
    }

    if (!this.configs) {
      throw new Error(`carousel component, [configs] attribute is required`);
    }

    this.data = new CarouselConfig(this.configs);

    this.restart();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private startCarousel() {
    this.interval$ = interval(this.data.speed).subscribe(() => this.goToNext(1, true));
    this.subscriptions.push(this.interval$);
  }

  private restart() {
    if (this.interval$) {
      this.interval$.unsubscribe();
    }

    if (!this.carouselItems || !this.carouselContainer) {
      return;
    }

    if (this.data.verticalVersion) {
      this.carouselContainer.nativeElement.scrollTop = 0;
    } else {
      this.carouselContainer.nativeElement.scrollLeft = 0;
    }

    this.itemsLength = this.carouselItems.length;

    let itemsLength = this.data.items;

    if (itemsLength > this.itemsLength) {
      itemsLength = this.itemsLength;
    }

    let itemsGap = 0;

    if (this.data.itemsGapPX) {
      itemsGap = this.data.itemsGapPX;
    }

    this.index = 0;

    this.carouselItems.forEach((carouselItem: ElementRef, index: number) => {
      const elem = carouselItem.nativeElement;

      if (itemsLength > 1) {
        this.renderer2.setStyle(elem, 'flex', `0 0 calc(${(100 / itemsLength)}% - ${itemsGap * (itemsLength - 1) / itemsLength}px)`);
      } else {
        this.renderer2.setStyle(elem, 'flex', `0 0 100%`);
      }

      if (this.data.itemsGapPX && index + 1 < this.itemsLength) {
        if (this.data.verticalVersion) {
          this.renderer2.setStyle(elem, 'margin-bottom', this.data.itemsGapPX + 'px');
        } else {
          this.renderer2.setStyle(elem, 'margin-right', this.data.itemsGapPX + 'px');
        }
      }
    });

    if (this.data.autoplay) {
      this.startCarousel();
    }

    if (this.itemsLength > 0) {
      const length = this.itemsLength - Math.floor(this.data.items) + 1;

      if (length > 1) {
        this.controls = Array(length).fill(0).map((_x, i) => i);
      }
    }

    if (this.navigation) {
      this.navigation.forEach(navigation => {
        this.data.navigationWrapperClasses.forEach(className => {
          this.renderer2.addClass(navigation.nativeElement, className);
        });
      });
    }

    this.data.controlsWrapperClasses.forEach(className => {
      if (this.control) {
        this.renderer2.addClass(this.control.nativeElement, className);
      }
    });
  }

  private goToNext(step: number = 1, restart: boolean = false) {
    this.scrolling = true;

    if (this.carouselContainer) {
      const elem = this.carouselContainer.nativeElement;

      let condition = elem.offsetWidth + elem.scrollLeft + 1 >= elem.scrollWidth;

      if (this.data.verticalVersion) {
        condition = elem.offsetHeight + elem.scrollTop + 1 >= elem.scrollHeight
      }

      if (restart && condition) {
        if (this.data.verticalVersion) {
          elem.scrollTop = 0;
        } else {
          elem.scrollLeft = 0;
        }

        this.index = 0;
        this.scroll.emit(this.index);
      } else {
        if (this.carouselItems) {
          const firstItem = this.carouselItems.get(0);

          if (firstItem) {
            if (this.data.verticalVersion) {
              elem.scrollTop += ((firstItem.nativeElement.offsetHeight + this.data.itemsGapPX) * this.data.slide * step);
            } else {
              elem.scrollLeft += ((firstItem.nativeElement.offsetWidth + this.data.itemsGapPX) * this.data.slide * step);
            }

            this.index += step;
            this.scroll.emit(this.index);
          }
        }
      }
    };

    timer(this.scrollDuration).subscribe(() => {
      this.scrolling = false;
    });
  }

  private goToPrev(step: number = 1) {
    this.scrolling = true;

    if (this.carouselContainer) {
      const elem = this.carouselContainer.nativeElement;

      let condition = elem.scrollLeft > 0;

      if (this.data.verticalVersion) {
        condition = elem.scrollTop > 0;
      }

      if (condition && this.carouselItems) {
        const firstItem = this.carouselItems.get(0);

        if (firstItem) {
          if (this.data.verticalVersion) {
            elem.scrollTop -= ((firstItem.nativeElement.offsetHeight + this.data.itemsGapPX) * this.data.slide * step);
          } else {
            elem.scrollLeft -= ((firstItem.nativeElement.offsetWidth + this.data.itemsGapPX) * this.data.slide * step);
          }

          this.index -= step;
          this.scroll.emit(this.index);
        }
      }
    }

    timer(this.scrollDuration).subscribe(() => {
      this.scrolling = false;
    });
  }
}
