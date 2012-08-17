# AnythingSlider FX Builder Bookmarklet

## Features ([Demo](http://css-tricks.github.com/AnythingSlider-Fx-Builder/))
* Bookmarklet that can be run on any page containing an [AnythingSlider](http://css-tricks.github.com/AnythingSlider)
* This builder allows you to add and test any of the available built-in effects (Fx) from the [AnythingSlider Fx extension](http://css-tricks.github.com/AnythingSlider/demos.html).
* No coding knowledge is needed, although some knowledge of [jQuery selectors](http://api.jquery.com/category/selectors/) would be extremely helpful.
* Play a single fx or all of them with one button.
* When done building the list of fx, click the fx code button that you can copy then paste directly into the slider fx initialization code.

## Using the Builder

### Bookmarklet
* Start by dragging the AnythingSlider FX Builder link (on this page) into your browser bookmark bar.
* Click on the bookmarklet when on a page containing <u>one</u> AnythingSlider - at this time, the builder will only work on the first AnythingSlider on the page.

### Elements and Selectors
* Choose an element from the drop down list, if you can't find the element you want, then choose "{none}" and add your custom selector in the next cell.
* Add a custom jQuery selector in the "Custom Selector" cell. This can be used to target any element inside the slider or to limit or specify the element(s) from the first cell.
* A selector must be included in either or both the first and second cells.
* The custom selector cell is added to the element selector without any spaces, so if you want to target the first list item, choose "LI" from the element drop down, then enter ":first" or ":eq(0)" in the custom selector. But if you choose "UL" from the element list and enter "LI" in the custom selector, the result is "ULLI" so be sure to add a space in front of the LI, like this " LI".

### FX

![img](http://css-tricks.github.com/AnythingSlider-Fx-Builder/images/fx-samples.gif)

* A selection in the FX cell is also required.
 * Choose from one or more of the FX listed in the dropdown (click inside the input to see it).
 * Choosing both `left` and `right` or `top` and `bottom` would result in the second fx in the list overriding the first. So combine fx that don't oppose each other, like `top` and `left`.
 * The `listLR` fx is intended to be used on multiple elements, like a list. The "LR" means that odd numbered elements will come in from the left and even numbered elements will come in from the right.
 * The `listRL` fx is the opposite of the `listLR` effect.
 * The `expand` fx is meant to be used on a panel that contains only one image. In the latest update, you can set the final size (the size of the image without the fx applied) of the image (but it needs to be as a percentage). Follow this format: `'10%, 80%'` ('fx size, final size').
 * The `grow` fx is similar to the `expand` fx except it applies to the font. Just add the font size of the text's final size (e.g. `'24px'`). If you want to set the grown size (it's `80px` by default), add a comma and then add the larger/smaller font size, like this: `'24px, 80px'` (this is opposite of the way `expand` sets the sizes).
 * To use any of the four `caption` fx, the following CSS needs to be included before they will work properly. The css is included with the bookmarklet, but the appropriate css will also need to be included in the final slider - modify the css in any way you wish:

    ```css
/* captions */
/* set to position: relative here in case javascript is disabled, script sets captions to position: absolute */
.caption-top,
.caption-right,
.caption-bottom,
.caption-left { background: #000; color: #fff; padding: 10px; margin: 0; position: relative; z-index: 10; opacity: .8; filter: alpha(opacity=80); }
/* Top caption - padding is included in the width (480px here, 500px in the script), same for height */
.caption-top { left: 0; top: 0; width: 480px; height: 30px; }
/* Right caption - padding is included in the width (130px here, 150px in the script), same for height */
.caption-right { right: 0; bottom: 0; width: 130px; height: 180px;  }
/* Bottom caption  - padding is included in the width (480px here, 500px in the script), same for height */
.caption-bottom { left: 0; bottom: 0; width: 480px; height: 30px; }
/* Left caption - padding is included in the width (130px here, 150px in the script), same for height */
.caption-left { left: 0; bottom: 0; width: 130px; height: 180px;  }
 ```

 * Please look at the required HTML needed to set up the captions as well on [this page](http://css-tricks.github.com/AnythingSlider/demos.html) at the bottom.

### Distance/Size
* Enter a distance you want the element to move.
* Or enter a change in size (like the expand fx) which is "10%" in the demo.
* This information is options, but by default the distance is set to the width and/or height of the first slide. The animation is usually fast enough that most of the time it doesn't matter how far it travels, but if you want the effect to be more specific then enter a value in number of pixels (px).
* When using the expand fx, the range is set to from whatever number you enter to "100%", so to work properly you must enter a number with a percent sign (%) after.
* To better understand how the FX extension works, the distance is how far from the starting point the animation effect moves. So the out effect (outFx) is this distance and the in effect (inFx) is the final position of the element (where the element is located when no Fx are applied).

### Time
* Enter the time in milliseconds (1000 milliseconds = 1 second) that the animation fx takes to complete
* This value is optional. If not set, the in Fx animation is 400 milliseconds (ms) and the out Fx is about 200 ms (half of the in Fx).

### Easing
* Choose from any of the easing functions from the drop down list.
* If you don't know what easing means, think of it as how the animation gets from point A to point B.
 * Going straight from point A to point B is the "linear" setting.
 * The easings are named by the math formula used: Expo uses exponential functions, Cubic uses cubed functions, Quad uses a quadratic formula, Circ uses a circular function. The rest are combinations of these.
 * To see how they behave, check out [this demo](http://jquery-ui.googlecode.com/svn/trunk/demos/effect/easing.html) provided by the jQuery UI team.
 * To include the easing formulas on your page, include either the easing plugin provided with AnythingSlider, or include jQuery UI which has them built in.

### Add, Test, Test All and Delete
* The "+ Add" button adds the current selections into the table below the input area along with a test and delete button.
* When the FX is added to the list, it can then me tested by pressing the test button in that row - it looks like a play button. If nothing happens or the slider goes to the first panel, then there might be a problem with the selector.
* If you need to delete that FX row, click the "X" button.
* To test all of the FX in the list, press the "> All" button, above the add button. This adds all of the Fx from the list of Fx you set up, then starts the slideshow.
* If you have multiple entries that effect the same element, the lowest one in the list is the one that is applied to the slider.

### List
* When you are done building your FX list, press the "<fx>" button and a window will popup containing the javascript code needed to add the fx to your slider.
* The output fx code will look something like this:

    ```javascript
.anythingSliderFx({
  ".panel3 img.expand" : [ "expand", "10%", "", "easeOutBounce" ]
});
```

* So if your AnythingSlider code looks something like this:

    ```javascript
// AnythingSlider code
$('#slider').anythingSlider({
  // add slider options here
});
```

* Remove the semi-colon ";" from the end and paste in the FX code:

    ```javascript
$('#slider').anythingSlider({
  // add slider options here
}).anythingSliderFx({
  ".panel3 img.expand" : [ "expand", "10%", "", "easeOutBounce" ]
});
```

## Change Log

### Version 1.0.1
* Updated links to point to the repo's new location on CSS-Tricks
* Updated demo to use CSS-Tricks' version of AnythingSlider

### Version 1.0
* Practice what you preach... set the image dimensions in the main demo\
* I guess it's been out there long enough without any problems to take it out of beta :)

### Version 1.0.3beta
* Added new `grow` fx to the list.
* Added an image to the readme to better illustrate the fx functions.

### Version 1.0.2beta
* Fixed a bug so the builder works with IE7 and IE8.

### Version 1.0.1beta
* Fixed an element selector bug.
* Added a random element to the list on startup, as an example.

### Version 1.0beta
* Initial build
