## Angular & Typescript Tips and Gotchas

###  Configuring `tsconfig.js`
- If you have multiple apps then prefer to use `tsconfig.app.json`
- To avoid specifying `| undefined` or `| null` then set strict to false in `compilerOptions`
```json
  "compilerOptions": {
    "strictPropertyInitialization": false,
    "strict": false,
    },
```

###  Angular Material
- To avoid weird layout issues, make sure you have a theme in `styles.css` e.g.
```scss
  @import "../node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css";
```

### Angular's `BrowserModule` and `BrowserAnimations` Module
= Always make sure you add `BrowserAnimationsModule` after the `BrowserModule`

###  Debugging
- Use [`typeof`](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html) in debug to assert the type of an object
- Can also find the type of the class via the constructor e.g. 
```typescript
    console.log(`type of date ` + (selectedDate.constructor.name));
```
- Use [`ngProbe`](https://subscription.packtpub.com/book/web-development/9781788299572/10/ch10lvl1sec36/debugging-with-ngprobe)
- Debug in the browser console by select the element in the browser and use the elements tab = see [article](https://mobiarch.wordpress.com/2020/07/08/ng-probe-no-more/)
- In the Chrome console log, click on the class name to enter the class and set a breakpoing
