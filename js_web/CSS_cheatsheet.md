# CSS Cheatsheet

### CSS Libraries and links
  | Name                                                | Description                                                                               |                    
  | ----------------------------------------------------|-------------------------------------------------------------------------------------------|
  | [Font Awesome](https://fontawesome.com/)            | Most popular icon set and toolkit                                                         |
  | [JQuery](https://code.jquery.com/)                  | Library designed to simplify HTML DOM tree traversal and manipulation,  CSS animation etc | 
  | [Bootstrap](https://getbootstrap.com/)              | CSS framework for responsive web                                                          |
  | [Materialize](https://materializecss.com/)          | A modern responsive front-end/CSS framework                                               |
  | [Foundation](https://get.foundation/)               | Most popular rival to Bootsrap                                                            |
  | [Skeleton](http://getskeleton.com/)                 | Super lightweight CSS boilterplate                                                        |
  | [Bootswatch](https://bootswatch.com)                | Free themes for Bootsrap                                                                  |
  
<hr>

### CDN
- To include external libraries you'll use the CDN - a Content Delivery Network allows for a quick transfer of assets needed to load content such as HTML pages, javascript files, stylesheets, images etc
- To include a library link do a Google search for the CDN (e.g. "font awesome cdn")

### Display types: block, inlne elements and none
- A `block` level element always starts on a new line and takes up the full width of a page, from left to right. A block-level element can take up one line or multiple lines and has a line break before and after the element.
- By default, `inline` elements do not force a new line to begin in the document flow.
- By setting an element to display to `none` then it is hidden

### Selecting by `id`
- Style the h2 with an `id` attribute called primary-heading
<pre>
    h2#primary-heading{ ... }
</pre>

### Selecting by `class`
- Style the h2 with a `class` attribute called primary-heading
<pre>
    h2.primary-heading{ ... }
</pre>

### Selecting any element by id
- Style any element with `id` 
<pre>
    #foo{ ... }
</pre>

### Selecting elements by multiple ids
- Style any element with `id` of foo or bar 
<pre>
    #foo #bar { ... }
</pre>


### Selecting elements by multiple classes
- Style any element with `class` of foo or bar 
<pre>
    .foo .bar { ... }
</pre>

### Selected a nested element
- e.g. Style the paragraph element inside the div with id called welcome
<pre>
    #welcome p{...}
</pre>