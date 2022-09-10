# ngx-carousel

Scroll carousel library for Angular.

Official documentation: https://astritdemiri.com/ng-library/ngx-carousel

Simple example using ngx-carousel: https://stackblitz.com/github/astritdemiri11/ngx-carousel-example

Get the complete changelog here: https://github.com/astritdemiri11/ngx-carousel/releases

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
  * [Import the CarouselModule](#1-import-the-carouselmodule)
    * [SharedModule](#sharedmodule)
  * [Use the service, the pipe or the directive](#use-the-service-the-pipe-the-component-or-the-directive)

## Installation

First you need to install the npm module:

```sh
npm install ngx-carousel --save
```

Choose the version corresponding to your Angular version:

 Angular       | ngx-carousel
 ------------- | ---------------
 14 (ivy only) | 1.x+           


## Usage

#### 1. Import the `CarouselModule`:

Finally, you can use ngx-carousel in your Angular project. You have to import `CarouselModule` in the root NgModule of your application.

```ts
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CarouselModule} from 'ngx-carousel';

@NgModule({
    imports: [
        CarouselModule,
        BrowserModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

##### SharedModule

If you use a [`SharedModule`](https://angular.io/guide/sharing-ngmodules) that you import in multiple other feature modules,
you can export the `CarouselModule` to make sure you don't have to import it in every module.

```ts
@NgModule({
    exports: [
        CarouselModule,
        CommonModule
    ]
})
export class SharedModule { }
```

> Note: Module services are provided in root `@Injectable({ providedIn: 'root' })`, see [`Dependency Injection`](https://angular.io/guide/dependency-injection).

#### Use the service, the pipe, the component or the directive:

You can either use the `CarouselComponent` exported by library

This is how you use the **component** for rendering only if visible in screen:
```html
<carousel [configs]="carouselConfigs">
  <div *ngFor="let item of items"carouselItem>{{ item }}</div>
</carousel>
```
