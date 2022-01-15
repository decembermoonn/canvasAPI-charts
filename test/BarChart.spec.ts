import { expect } from "chai";
import { BarChart } from "../src/model/charts/BarChart";
import mockGetContext from './utils/mockGetContext';

class MockBarChart extends BarChart {
    public override seriesData;
}

describe('BarChart methods and properties working properly', () => {
    let barChart: MockBarChart;
    let canvas;

    before(() => {
        mockGetContext();
        canvas = document.createElement('canvas');
        barChart = new MockBarChart(canvas, 'bar');
    });

    it('Should throw error when trying to add Y before X', () => {
        try {
            barChart.Y = [[1, 2, 3]];
        } catch (e) {
            expect(e.message).to.eq('Values on "X" axis must be specified before setting "Y" values.');
        }
    });

    it('Should properly set X and Y', () => {
        barChart.X = ['dogs', 'cats'];
        barChart.Y = [[5, 8]];
        const seriesData = barChart.seriesData;
        expect(seriesData).to.have.length(1);
        expect(seriesData[0].name).to.eq('serie0');
        expect(seriesData[0].values).deep.eq([5, 8]);
    });
});