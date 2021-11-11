export default class DrawUtils {
    identityMatrix(): number[] {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    }
    projectionMatrix(width: number, height: number): number[] {
        return [
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1
        ];
    }
    translationMatrix(tx: number, ty: number): number[] {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    }
    rotationMatrix(degrees: number): number[] {
        const radians = degrees / 180 * Math.PI;
        const s = Math.sin(radians);
        const c = Math.cos(radians);
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    }
    scaleMatrix(sx: number, sy: number): number[] {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    }

    private arrayToMatrix(arr: number[], size: number): number[][] {
        const res: number[][] = [];
        for (let i = 0; i < arr.length; i += size)
            res.push(arr.slice(i, i + size));
        return res;
    }

    // use math.js if needed - code by Jan Turoň
    multiplyMatrices(F: number[], S: number[]): number[] {
        if (F.length === S.length && [1, 4, 9, 16].includes(F.length)) {
            const pow = Math.sqrt(F.length);
            const A = this.arrayToMatrix(F, pow);
            const B = this.arrayToMatrix(S, pow);
            return A.map((row, i) =>
                B[0].map((_, j) =>
                    row.reduce((acc, _, n) =>
                        acc + A[i][n] * B[n][j], 0
                    )
                )
            ).flat(1);
        }
    }
}