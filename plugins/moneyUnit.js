import { Decimal } from 'decimal.js';
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('money-unit', {
        mounted(el, binding) {
            el.innerHTML = truncateToTwoDecimalsString(binding.value);
        },

        beforeUpdate(el, binding) {
            el.innerHTML = truncateToTwoDecimalsString(binding.value);
        },
    });

    function truncateToTwoDecimalsString(numStr) {
        const amount = parseFloat(numStr);
        if (amount >= 0) {
            if (amount < 1000) {
                return amount.toString();
            } else if (amount >= 1000 && amount < 10000) {
                let num = new Decimal(amount).div(1000);
                return `${Math.floor(num * 100) / 100}k`;
            } else if (amount >= 10000 && amount < 1000000) {
                let num = new Decimal(amount).div(10000);
                return `${Math.floor(num * 100) / 100}w`;
            } else if (amount >= 1000000) {
                let num = new Decimal(amount).div(1000000);
                return `${Math.floor(num * 100) / 100}m`;
            }
        } else {
            if (amount > -1000) {
                return amount.toString();
            } else if (amount <= -1000 && amount > -10000) {
                let num = new Decimal(amount).div(1000);
                return `${Math.floor(num * 100) / 100}k`;
            } else if (amount <= -10000 && amount > -1000000) {
                let num = new Decimal(amount).div(10000);
                return `${Math.floor(num * 100) / 100}w`;
            } else if (amount <= -1000000) {
                let num = new Decimal(amount).div(1000000);
                return `${Math.floor(num * 100) / 100}m`;
            }
        }
    }
});
