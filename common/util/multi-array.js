// isLinkage: 传入的多维数组的前一项是后一项的父集，如 [['浦东', '青浦'], [['龙阳路', '张江'], ['朱家角']]]
export function getTargetIndices(multiArray, array, isLinkage = true) {
    if (!array ||!multiArray) {
        return null;
    }
    const length = Math.min(multiArray.length, array.length);
    const indices = [];
    if (isLinkage) {
        const multi = multiArray.concat();
        for (let i = 0; i < length; i += 1) {
            const targetList = multi[i].map(item => item instanceof Object ? item.val : item);
            let index = targetList.indexOf(array[i]);
            if (index < 0) {
                index = 0;
            }
            for (let j = i + 1; j < length; j += 1) {
                multi[j] = multi[j][index];
            }
            indices.push(index);
        }
    } else {
        for (let i = 0; i < length; i += 1) {
            const targetList = multiArray[i].map(item => item instanceof Object ? item.val : item);
            let index = targetList.indexOf(array[i]);
            if (index < 0) {
                index = 0;
            }
            indices.push(index);
        }
    }
    return indices;
}
