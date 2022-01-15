import { expect } from 'chai';
import { getTickInfo } from '../src/plot/utils';

describe('Plot util functions working properly', () => {
    it('getTickInfo working properly', () => {
        const { tickCount, tickHeight } = getTickInfo(10, 0, 100);
        expect(tickHeight).to.eq(15);
        expect(tickCount).to.eq(7);
    });
});