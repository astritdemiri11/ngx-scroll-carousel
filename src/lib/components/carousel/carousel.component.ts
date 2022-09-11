import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
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
  @Input() configs?: CarouselConfigInterface;
  @ViewChild('carouselContainer') carouselContainer?: ElementRef<HTMLDivElement>;
  @ContentChildren(CarouselItemDirective, { read: ElementRef }) carouselItems?: QueryList<ElementRef>;

  data: CarouselConfig;
  index: number;
  controls: number[];

  private content: string;
  private itemsLength: number;
  private scrollDuration: number;
  private scrolling: boolean;
  private subscriptions: Subscription[];
  private interval$?: Subscription;

  constructor(public renderer2: Renderer2) {
    this.data = new CarouselConfig({ items: 0 });
    this.controls = [];

    this.content = '';
    this.index = 0;
    this.itemsLength = 0;
    this.scrollDuration = 500;
    this.scrolling = false;
    this.subscriptions = [];
  }

  onPrev() {
    if (this.interval$) {
      this.interval$.unsubscribe();
    }

    this.goToPrev();
    this.startCarousel();
  }

  onNext() {
    if (this.interval$) {
      this.interval$.unsubscribe();
    }

    this.goToNext(1, true);
    this.startCarousel();
  }

  onControl(index: number) {
    if (this.interval$) {
      this.interval$.unsubscribe();
    }

    if (this.index > index) {
      this.goToPrev(this.index - index);
    } else {
      this.goToNext(index - this.index);
    }

    this.startCarousel();
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

    this.restart();
  }

  ngOnInit() {
    if (!this.configs) {
      throw new Error(`carousel component, [configs] attribute is required`);
    }

    this.data = new CarouselConfig(this.configs);
    this.restart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.data = new CarouselConfig(changes['configs'].currentValue);
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

    this.carouselContainer.nativeElement.scrollLeft = 0;
    this.itemsLength = this.carouselItems.length;
    this.index = 0;

    this.carouselItems.forEach(carouselItem => {
      const elem = carouselItem.nativeElement;
      this.renderer2.setStyle(elem, 'flex', `0 0 ${100 / this.data.items}%`);
    });

    if (this.data.autoplay) {
      this.startCarousel();
    }

    if (this.itemsLength > 0) {
      const length = this.itemsLength - this.data.items + 1;

      if (length > 0) {
        this.controls = Array(length).fill(0).map((_x, i) => i);
      }
    }
  }

  private goToNext(step: number = 1, restart: boolean = false) {
    if (this.scrolling) {
      return;
    }

    this.scrolling = true;

    if (this.carouselContainer) {
      const elem = this.carouselContainer.nativeElement;

      if (restart && elem.offsetWidth + elem.scrollLeft >= elem.scrollWidth) {
        this.carouselContainer.nativeElement.scrollLeft = 0;
        this.index = 0;
      } else {
        if (this.carouselItems) {
          const firstItem = this.carouselItems.get(0);

          if (firstItem) {
            this.carouselContainer.nativeElement.scrollLeft += (firstItem.nativeElement.offsetWidth * this.data.slide * step);
            this.index += step;
          }
        }
      }
    };

    timer(this.scrollDuration).subscribe(() => {
      this.scrolling = false;
    });
  }

  private goToPrev(step: number = 1) {
    if (this.scrolling) {
      return;
    }

    this.scrolling = true;

    if (this.carouselContainer && this.carouselContainer.nativeElement.scrollLeft > 0 && this.carouselItems) {
      const firstItem = this.carouselItems.get(0);

      if (firstItem) {
        this.carouselContainer.nativeElement.scrollLeft -= (firstItem.nativeElement.offsetWidth * this.data.slide * step);
        this.index -= step;
      }
    }

    timer(this.scrollDuration).subscribe(() => {
      this.scrolling = false;
    });
  }
}
