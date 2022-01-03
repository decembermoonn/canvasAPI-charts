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
        borderWidth: number,
        showOnLegend: boolean,
        shape: string
    }, serieNamesArray);
```
Where object might consist of:
* `color` - color of serie
* `showValue` - flag indicating whether value of serie should be visible
* `borderWidth` - width of serie stroke line
* `showOnLegend` - flag indicating whether serie should be visible on legend
* `shape` - pattern of serie which might be one of [those described there](https://github.com/ashiguruma/patternomaly/blob/5ca857ae7888aacaac9ecfc43f6b3e9859e40645/README.md)

And `serieNamesArray`:
* May be ommited, which will cause applying settings to all series
* May be ***string[]*** of names of series which settings should be applied to.

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
