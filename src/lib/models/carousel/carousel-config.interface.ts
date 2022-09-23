export interface CarouselConfig {
  autoplay?: boolean;
  controls?: boolean;
  controlsActiveClass?: string;
  controlsButtonClass?: string;
  controlsOverClass?: string;
  controlsWrapperClasses?: string[];
  items: number;
  mobileGestures?: boolean;
  navigation?: boolean;
  navigationIconClass?: string;
  navigationOutset?: boolean;
  navigationOverClass?: string;
  navigationWrapperClasses?: string[];
  responsive?: { [mediaQuery: string]: number; }[];
  slide?: number;
  speed?: number;
  verticalVersion?: boolean;
}
