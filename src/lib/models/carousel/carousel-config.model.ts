import { CarouselConfig as CarouselConfigInterface } from './carousel-config.interface';

export class CarouselConfig implements CarouselConfigInterface {
  autoplay: boolean;
  controls: boolean;
  controlsActiveClass: string;
  controlsButtonClass: string;
  controlsOverClass: string;
  items: number;
  mobileGestures: boolean;
  navigation: boolean;
  navigationIconClass: string;
  navigationOverClass: string;
  responsive: { [mediaQuery: string]: number; }[]
  slide: number;
  speed: number;

  constructor(public config: CarouselConfigInterface) {
    this.autoplay = true;

    if(config.autoplay != null) {
      this.autoplay = config.autoplay;
    }

    this.controls = true;

    if(config.controls != null) {
      this.controls = config.controls;
    }

    this.controlsActiveClass = config.controlsActiveClass || 'controls-active-class';
    this.controlsButtonClass = config.controlsButtonClass || 'controls-button-class';
    this.controlsOverClass = config.controlsOverClass || 'controls-over-class';
    this.items = config.items || 0;

    this.navigation = true;

    if(config.navigation != null) {
      this.navigation = config.navigation;
    }

    this.mobileGestures = false;

    if(config.mobileGestures != null) {
      this.mobileGestures = config.mobileGestures;
    }

    this.navigationIconClass = config.navigationIconClass || 'navigation-icon-class';
    this.navigationOverClass = config.navigationOverClass || 'navigation-over-class';
    this.responsive = config.responsive || [];
    this.slide = config.slide || 1;
    this.speed = config.speed || 2500;
  }
}
