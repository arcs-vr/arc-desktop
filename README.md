# ARCS Vue.js Remote UI

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

This repository provides standard remote controls for A-Frame VR experiences, as well as the UI that allow users to
pair devices.

It provides a desktop remote control (i.e. for controlling VR on a smartphone from a desktop/laptop computer) using WASD/arrow
keys and mouse input, and a touch remote control (i.e. for controlling VR on a smartphone from another smartphone) using
a joystick, and an A/B button simulations.

## Installation

Use one of the following:

```bash
yarn add arcs-vr/arc-vue-remotes
npm install arcs-vr/arc-vue-remotes
```

## Usage

### Vue.js Router

You can import three routes into your [`vuejs/vue-router`](https://github.com/vuejs/vue-router) using the following code:

```js
import Vue        from 'vue'
import Router     from 'vue-router'

Vue.use(Router)

const ArcRemoteSelector = () => import(/* webpackChunkName: "remote-selector" */ 'arc-vue-remotes/src/components/ArcRemoteSelector.vue')
const ArcDesktop        = () => import(/* webpackChunkName: "arc-desktop" */ 'arc-remotes/src/components/ArcDesktop.vue')
const ArcSmartphone     = () => import(/* webpackChunkName: "arc-smartphone" */ 'arc-remotes/src/components/ArcSmartphone.vue')

export const router = new Router({
    routes: [
       {
          path: '/remote',
          name: 'remote-selector',
          component: ArcRemoteSelector,
          props: {
            routeDesktop: 'remote-desktop',
            routeSmartphone: 'remote-smartphone',
          },
        },
        {
          path: '/remote/desktop',
          name: 'remote-desktop',
          component: ArcDesktop,
        },
        {
          path: '/remote/smartphone',
          name: 'remote-smartphone',
          component: ArcSmartphone,
        },
    ]
})
```

You can also embed the components into your own route components.

### A-Frame components

You can use the existing [`arcs-vr/arc-aframe-movement`](https://gihub.com/arcs-vr/arc-aframe-movement) components or create you own following their implementation.

### Configuration

Because the `arc-vue-remotes` are part of a larger system, they can be configured using the [`arcs-vr/arc-vue-options-plugin`](https://github.com/arcs-vr/arc-vue-options-plugin).

## Styling

You can easily replace most of the styling by overriding the [`arcs-vr/arc-cd`](https://github.com/arcs-vr/arc-cd)
package, for example using the [`nerdchacha/module-replace-webpack-plugin`](https://github.com/nerdchacha/module-replace-webpack-plugin)
in webpack.

If you want to use the default styling, you must manually install the [`arcs-vr/arc-cd`](https://github.com/arcs-vr/arc-cd).

## More

Look at the [`arcs-vr/arc-aframe-vue-template`](https://github.com/arcs-vr/arc-aframe-vue-template) for easier setup and at the
[`arcs-vr/arc-demo`](https://github.com/arcs-vr/arc-demo) for example usage.

## Authors and contributors

- Barthélémy Bonhomme, [@barthy-koeln](https://github.com/barthy-koeln/): [post@barthy.koeln](mailto:post@barthy.koeln)
