import { expect } from 'chai';
import 'mocha';
import chartServant from '../src/interface/ChartServant';
import { BarChart } from '../src/model/charts/BarChart';
import { PieChart } from '../src/model/charts/PieChart';
import mockGetContext from './utils/mockGetContext';

describe('Chart Servant (interface) working properly', () => {
    let canvas;

    before(() => {
        mockGetContext();
        canvas = document.createElement('canvas');
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