import { expect } from 'chai';
import utils from '../src/model/utils';

describe('Chart util functions working properly', () => {
    it('Slice and fill properly', () => {
        const numbers = utils.sliceOrFill([1, 2, 3], 5, 8);
        expect(numbers).deep.eq([1, 2, 3, 8, 8]);
        const numbers2 = utils.sliceOrFill([8, 7, 6, 5], 2);
        expect(numbers2).deep.eq([8, 7]);
    });

    it('Should merge right object properly', () => {
        const newOptions = {
            color: 'red',
            lang: 'pl',
            name: 'Jan'
        };
        const actOptions = {
            color: 'blue',
            lang: 'pl'
        };
        utils.mergeRight(newOptions, actOptions);
        expect(actOptions).deep.eq({
            color: 'red',
            lang: 'pl'
        });
    });
});