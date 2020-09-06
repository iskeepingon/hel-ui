/**
 * 滚动到距页面顶部指定位置
 * @param {Number} scrollTop 距页面顶部距离（单位：px）
 * @param {Number} time 动画执行时间（单位：ms）
 */
export default function scrollTop(scrollTop = 0, time = 500) {
    const cubic = value => Math.pow(value, 3);
    const easeInOutCubic = value =>
        value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;
    const beginTime = Date.now();
    const beginValue = getScrollTop();
    const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16));
    const frameFunc = () => {
        if (isNaN(+time) || +time === 0) {
            setScrollTop(scrollTop);
            return;
        }
        const progress = (Date.now() - beginTime) / time;
        if (progress < 1) {
            setScrollTop(
                scrollTop + (beginValue - scrollTop) * (1 - easeInOutCubic(progress))
            );
            rAF(frameFunc);
        } else {
            setScrollTop(scrollTop);
        }
    };
    rAF(frameFunc);
}

function getScrollTop() {
    return (document.scrollingElement && document.scrollingElement.scrollTop) ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
}

function setScrollTop(st) {
    if (!st) st = 0;
    document.documentElement.scrollTop = document.body.scrollTop = st;
}