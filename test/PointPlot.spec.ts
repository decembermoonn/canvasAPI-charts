import { expect } from "chai";
import PointPlot from "../src/plot/plots/PointPlot";
import { ValueToPixelMapperFunc, ValueToPixelMapperOptions } from "../src/plot/types";

class PointPlotMock extends PointPlot {
    public xGetValueToPixelMapperFuncMock(opt: ValueToPixelMapperOptions): ValueToPixelMapperFunc {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return super.xGetValueToPixelMapperFunc(opt);
    }
}

describe('Point plot methods working properly', () => {
    let pointPlot: PointPlotMock;

    before(() => {
        pointPlot = new PointPlotMock(null, 'point');
    });

    it('Should have X mapper function functioning properly', () => {
        const options: ValueToPixelMapperOptions = {
            beginningInPixels: 0,
            widthOrHeightInPixels: 800,
            minValueFromSeries: 10,
            maxValueFromSeries: 26,
        };

        const mapperFunc = pointPlot.xGetValueToPixelMapperFuncMock(options);
        expect(mapperFunc(10)).to.eq(0);
        expect(mapperFunc(18)).to.eq(400);
        expect(mapperFunc(26)).to.eq(800);
    });
});