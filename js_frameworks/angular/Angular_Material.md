# ANGULAR MATERIAL

The source for these notes are the [FreeCodeCamp.org's Learn Angular Material](https://www.youtube.com/watch?v=jUfEn032IL8) course
See also [Angular Material Course 2022](https://www.youtube.com/watch?v=DaE_RpWRlJI)

## Setting up an Angular Project
- Create a new project using Angular CLI `ng new <project-name>`
- Angular Material uses [schematics](https://angular.io/guide/schematics) so you add Angular Material to a project using the CLI with `ng add @angular/material` - asks for options for styling (which gets added to `styles` array in `angular.json`), HammerJS for gestures and browser animations
- Changes: adds material imports to index.html, styles.css (css rest to body tag> and adds modules to `app.modules.ts` adds `BrowserModule` and `BrowserAnimationsModule` (make sure latter is after the former)
- 
