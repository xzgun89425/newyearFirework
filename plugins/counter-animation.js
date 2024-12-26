const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

const setupCounterAnimation = (element, endValue, duration, threshold = 0.1) => {
    if (process.client) {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateValue(entry.target, 0, endValue, duration);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: threshold }
        );

        observer.observe(element);
    }
};

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('counter-animate', {
        mounted(el, binding) {
            // 從 binding.value、元素屬性或默認值中獲取 endValue 和 duration
            const config = binding.value || {};
            const endValue = parseInt(config.endValue || el.getAttribute('data-end-value') || '100', 10);
            const duration = parseInt(config.duration || el.getAttribute('data-duration') || '2000', 10);

            // 確保 endValue 和 duration 都是有效的數字
            if (isNaN(endValue) || isNaN(duration)) {
                console.error('Invalid endValue or duration for counter animation');
                return;
            }

            setupCounterAnimation(el, endValue, duration);
        },
    });
});

// plugins/counter-animation.js
