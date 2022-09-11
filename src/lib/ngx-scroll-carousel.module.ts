import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CarouselComponent } from './components/carousel/carousel.component';
import { CarouselItemDirective } from './directives/carousel-item/carousel-item.directive';



@NgModule({
  declarations: [
    CarouselComponent,
    CarouselItemDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CarouselComponent,
    CarouselItemDirective
  ]
})
export class ScrollCarouselModule { }
