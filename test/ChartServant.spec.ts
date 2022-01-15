import { expect } from 'chai';
import 'mocha';
import chartServant from '../src/interface/ChartServant';
import { BarChart } from '../src/model/charts/BarChart';
import { PieChart } from '../src/model/charts/PieChart';

describe('Chart Servant (interface) working properly', () => {
    let canvas;

    before(() => {
        canvas = document.createElement('canvas');
        // Needed to mock getContext with simple function,
        // to prevent Mocha from spawning errors.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.HTMLCanvasElement.prototype.getContext = (): void => {
            console.warn("Using getContext Mock");
        };
    });

    it('Should initlalize Pie Chart model', () => {
        const model = chartServant('pie', canvas);
        expect(model).not.to.be.false;
        expect(model).instanceOf(PieChart);
        expect(model).not.to.be.instanceOf(BarChart);
    });

    it('Should not initialize any model', () => {
        expect(chartServant.bind(null, "invalid", canvas)).to.throw("invalid chart is not defined.");
    });
});