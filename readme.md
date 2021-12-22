# Library for plotting using Canvas API.

<p style="color: lightblue; font-weight: bold">This version is alpha and contains almost nothing yet.</p>

Create bundle via:

```
npm run build
```

Copy folder to node_modules (i guess?).
Then import module in your package:

```
import Chart from 'library'
```

Example usage:

```
window.onload = function () {
    const ctx = document.getElementById('canvas').getContext('2d');
    new Chart().drawF(ctx);
}
```

<i>Project follows semantic versioning and conventional commits.
Branch are split in master and development.
Changes are made on development and may be merged into master.</i>
