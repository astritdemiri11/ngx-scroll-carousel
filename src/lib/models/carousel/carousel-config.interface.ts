export interface CarouselConfig {
  autoplay?: boolean;
  controls?: boolean;
  controlsActiveClass?: string;
  controlsButtonClass?: string;
  controlsOverClass?: string;
  items: number;
  mobileGestures?: boolean;
  navigation?: boolean;
  navigationIconClass?: string;
  navigationOverClass?: string;
  responsive?: { [mediaQuery: string]: number; }[];
  slide?: number;
  speed?: number;
}
