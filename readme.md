# Importing 
Create bundle via:

```bash
npm run build
```

When using ES6 simply add:

```
import Drawing from '../dist/bundle.js';
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
* type - valid type of chart.  Might be one of::
    * pie
    * bar
    * histogram
    * point
    * line
    * area
* context - Canvas2DRenderingContext, HTMLCanvasElement or id of HTMLCanvasElement.

---

Charts can be customized to fit Your needs. Following secion describes available customization.

## Supplying OX data:
Data may be array of strings or even array of number arrays depending on type of chart. Following section specifies type of OX data for every chart.

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
Data for OY axis should be adequate to number of used series, etc. Following section specifies type of OY data for every chart:

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
* Array should contain arrays of numbers. Each array coresponds for each serie. 

## Setting chart options:
Chart might be configured via following method:
```js
drawing.setChartOptions({
    title: string,
    showTitle: boolean,
    showLegend: boolean,
});
```
Where object might consist of:
* `title` - title of chart
* `showTitle` - flag indicating whether title should be shown
* `showLegend` - flag indicating whether legend should be shown

## Setting serie options:
Each serie might be configured via following method:
```js
drawing.setSerieOptions({
        edgeThickness: 6,
        color: 'red',
        shape: 'diamond',
    }, serieNamesArray);
```
Where object might consist of:
* `edgeThickness` - width of serie stroke line
* `color` - color of serie
* `shape` - pattern of serie which might be one of [described there](https://github.com/ashiguruma/patternomaly/blob/5ca857ae7888aacaac9ecfc43f6b3e9859e40645/README.md)
* `showOnLegend` - flag indicating whether serie should be visible on legend
* `showLabels` - flag indicating whether serie values labels should be visible on chart 

And `serieNamesArray`:
* May be ommited, which will cause applying settings to all specified series
* May be ***string[]*** with names of series which settings should be applied to.

Upon supplying charts with OX and OY data series are created with default names:
* In case of *Pie Chart* serie names are the same as passed as OX dta
* In case of other charts serie names are named *serie<number>* where number is incremented from 1 to *n* for *n* series. For example:
    ```js
    ["serie1", "serie2", "serie3"]
    ```

---

## Drawing
After specifying data, chart options and series options chart might be drawn via: 
```js
drawing.draw();
```

# Additional info:
<i>Project follows semantic versioning and conventional commits.
Branch are split in master and development.
Changes are made on development and may be merged into master.</i>
