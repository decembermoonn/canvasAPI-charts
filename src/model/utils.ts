export default class {
    /**
     * If needed, slice 'array' to 'len' items or fill to 'len' items using 'fillWith'.
     * @param array - array to slice or fill.
     * @param len - the resulting length of array.
     * @param fillWith - number with which array should be filled.
     * @returns sliced or filled array.
    */
    public static sliceOrFill(array: number[], len: number, fillWith?: number): number[] {
        if (array.length === len) return array;
        if (array.length > len) return array.slice(0, len);
        if (array.length < len)
            while (array.length !== len)
                array.push(fillWith ?? 0);
        return array;
    }

    /**
     * Merge properties from 'newOptions' to 'actualOptions' (right-join like).
     * @param newOptions - some option properties for type T.
     * @param actualOptions - all option properties for type T.
    */
    public static mergeRight<T>(newOptions: Partial<T>, actualOptions: T): void {
        const keys = Object.keys(actualOptions);
        Object.entries(newOptions).forEach(pair => {
            const key = pair[0];
            if (keys.includes(key)) {
                const value = pair[1];
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
                // @ts-ignore
                actualOptions[key] = value;
            }
        });
    }
}