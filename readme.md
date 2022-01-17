# Summary
`canvas2d-charts` is very simple library used for plotting. It supports six different types of charts, which are configurable according to Your needs. For example, you might set different patterns for charts in order to make them accessible to color-blinded people.

# Installation:
## Downloading:
If you use npm (for example in node.js application) then download package simply by using:
```
npm install canvas2d-charts
```
If you don't use npm, then you might get package bundle from [GitHub repository](https://github.com/decembermoonn/canvasAPI-charts). It is located in `dist` folder. You may also download package source code and bundle it by yourself using any bundler (for example Webpack).

<strong>Caution!</strong> There is no official support for CDN and it won't be included.
## Importing:
There are several approaches for importing this module, depending on used module resolution system (CommonJS, AMD, UMD, SystemJS etc...)

When using ES6 module resolution simply add:
```
import draw from '.../dist/bundle.js';
```

# Usage:

The simplest usage example is following:
```
window.onload = function () {
    const ctx = document.getElementById('canvas').getContext('2d');
    const drawing = Drawing('pie', ctx);
    drawing.draw();
}
```

---

## Creating chart:
In order to create chart use:
```
Drawing(type, context);
```
Where:
* `type` - valid type of chart.  Might be one of::
    * pie
    * bar
    * histogram
    * point
    * line
    * area
* `context` - Canvas2DRenderingContext, HTMLCanvasElement or id of HTMLCanvasElement.

---

Charts can be customized to fit Your needs. Following secion describes available customization.

## Supplying OX data:
Following section specifies type of OX data for every chart.

### Pie, Bar, Histogram:
* Type: ***string[]***
* Example:
    ```
    drawing.X = ["Dogs", "Cats", "Birds"];
    ```
### Area, Line, Point:
* Type: ***number[][]***
* Example:
    ```
    drawing.X = [[1,2,3],[2,3,4]]
    ```
## Supplying OY data:
Following section specifies type of OY data for every chart:

### Pie:
* Type: ***number[]***
* Example:
    ```
    drawing.Y = [1,2,3]
    ```
* Every entry should match OX string which serves as serie    
### Area, Bar, Histogram, Line, Point:
* Type: ***number[][]***
* Example:
    ```
    drawing.Y = [[1,2,3],[2,3,4],[8,9,9]]
* Array should contain arrays of numbers. Each array coresponds to each serie. 

## Setting chart options:
Chart might be configured with following method:
```js
drawing.setChartOptions({
    title: string,
    showTitle: boolean,
    showLegend: boolean,
    showLabels: boolean
});
```
Where object might consist of:
* `title` - title of chart
* `showTitle` - flag indicating whether title should be shown
* `showLegend` - flag indicating whether legend should be shown
* `showLabels` - ***optional*** flag inidcating wherther OX labels should be visible (applies only for bar and histogram charts)

## Setting serie options:
Each serie might be configured via following method:
```js
drawing.setSerieOptions({
        color: string,
        showValue: boolean,
        showOnLegend: boolean
    }, serieNamesArray);
```
`serieNamesArray`:
* May be ommited, which will cause applying settings to all series
* May be ***string[]*** of names of series which settings should be applied to.

Passed object might consist of:
* `color` - color of serie
* `showValue` - flag indicating whether value of serie should be visible
* `showOnLegend` - flag indicating whether serie should be visible on legend

### Additional properties
You can provide additional properties depending on chart.

For pie, bar and histogram:
```js
drawing.setSerieOptions({
        borderWidth: number,
        shape: string
    }, serieNamesArray);
```
* `borderWidth` - width of serie stroke line
* `shape` - pattern of serie which might be one of [those described there](https://github.com/ashiguruma/patternomaly/blob/5ca857ae7888aacaac9ecfc43f6b3e9859e40645/README.md)

For point:
```js
drawing.setSerieOptions({
        pointSize: number,
        pointShape: string
    }, serieNamesArray);
```
* `pointSize` - point size in pixels
* `pointShape` - pattern of points, possible values are the same as for 'shape' for pie, bar and histogram charts.

For line:
```js
drawing.setSerieOptions({
        dash: string | number[],
        dashWidth: number
    }, serieNamesArray);
```
* `dash` - may be one of:
    - 'l'  
    - 'p'  
    - 'ls'
    - 'lls'
    - 'lp'
    - 'lppp'
    - 'lpsp'
    - [] for solid line
    - an array of numbers specifying dash pattern [as described there](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash)
* `dashWidth` - width of dash

Upon supplying charts with OX and OY data series are created with default names:
* In case of *Pie Chart* serie names are the same as those supplied as OX data
* In case of other charts serie names are named with following convention:
    ```js
    ["serie0", "serie1", "serie2", ...]
    ```

---

## Drawing
After configuration chart might be drawn via: 
```js
drawing.draw();
```

# Additional info:
<i>Project follows semantic versioning and conventional commits.
Branch are split in master and development.
Changes are made on development and may be merged into master.</i>
