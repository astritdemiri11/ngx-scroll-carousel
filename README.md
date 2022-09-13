# ngx-scroll-carousel

Scroll carousel library for Angular.

Official documentation: https://astritdemiri.com/ng-library/ngx-scroll-carousel

Simple example using ngx-scroll-carousel: https://stackblitz.com/github/astritdemiri11/ngx-scroll-carousel-example

Get the complete changelog here: https://github.com/astritdemiri11/ngx-scroll-carousel/releases

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
  * [Import the ScrollCarouselModule](#1-import-the-scrollcarouselmodule)
    * [SharedModule](#sharedmodule)
  * [Use the service, the pipe or the directive](#use-the-service-the-pipe-the-component-or-the-directive)

## Installation

First you need to install the npm module:

```sh
npm install ngx-scroll-carousel --save
```

Choose the version corresponding to your Angular version:

 Angular       | ngx-scroll-carousel
 ------------- | ---------------
 14 (ivy only) | 1.x+           


## Usage

#### 1. Import the `ScrollCarouselModule`:

Finally, you can use ngx-scroll-carousel in your Angular project. You have to import `ScrollCarouselModule` in the root NgModule of your application.

```ts
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ScrollCarouselModule} from 'ngx-scroll-carousel';

@NgModule({
    imports: [
        BrowserModule,
        ScrollCarouselModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

##### SharedModule

If you use a [`SharedModule`](https://angular.io/guide/sharing-ngmodules) that you import in multiple other feature modules,
you can export the `ScrollCarouselModule` to make sure you don't have to import it in every module.

```ts
@NgModule({
    exports: [
        CommonModule,
        ScrollCarouselModule
    ]
})
export class SharedModule { }
```

> Note: Module services are provided in root `@Injectable({ providedIn: 'root' })`, see [`Dependency Injection`](https://angular.io/guide/dependency-injection).

#### Use the service, the pipe, the component or the directive:

You can either use the `CarouselComponent` exported by library

This is how you use the **component** to create the carousel:
```html
<carousel [configs]="carouselConfigs">
  <div *ngFor="let item of items" carouselItem>{{ item }}</div>
</carousel>
```
