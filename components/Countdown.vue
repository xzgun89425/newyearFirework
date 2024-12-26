<script setup>
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
dayjs.extend(duration);
const props = defineProps({
    modelValue: {},
    clockFont: {
        type: Object,
        default: {
            size: '24px',
            color: 'white'
        }
    },
    clockWidth: {
        type: String,
        default: '52px'
    },
    clockHeight: {
        type: String,
        default: '52px'
    },
    clockColor: {
        type: String,
        default: 'bg-zinc-800'
    }
});
const emit = defineEmits(['isEnd', 'update'])
const timer = ref(null)
const targetDate = ref('2024-09-21 22:04:00');
const loading = ref(true)
const countdownData = reactive({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
})
onMounted(async () => {
    if (props.modelValue) {
        timer.value = setInterval(async () => {
            await countdown(dayjs(props.modelValue).format("YYYY-MM-DD HH:mm:ss"));
            loading.value = false
        }, 1000);
    }
})
onUnmounted(() => {
    clearInterval(timer.value);
})
function countdown(targetDate) {
    const now = dayjs(); // 取得現在的時間
    const target = dayjs(targetDate); // 目標日期
    const diff = target.diff(now); // 計算差異，單位是毫秒
    if (diff <= 0) {
        clearInterval(timer.value);
        // emit('isEnd', true)
        return "Countdown finished"; // 如果目標日期已經過去
    }
    const remainingTime = dayjs.duration(diff); // 將毫秒轉換為日、時、分、秒
    const days = Math.floor(remainingTime.asDays()); // 取得剩餘的天數
    const hours = remainingTime.hours(); // 剩餘的時數
    const minutes = remainingTime.minutes(); // 剩餘的分鐘數
    const seconds = remainingTime.seconds(); // 剩餘的秒數

    countdownData.days = days;
    countdownData.hours = hours;
    countdownData.minutes = minutes;
    countdownData.seconds = seconds;
    if (days == 0 && hours == 0 && minutes == 0 && seconds == 0) {
        emit('isEnd', true)
    } else {
        emit('update', diff)
        emit('isEnd', false)
    }
    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
}

function getDigits(num) {
    let ones = 0; // 個位數
    let tens = 0 // 十位數
    let hundreds = 0 // 百位數
    if (num && num > 0) {
        ones = num % 10; // 個位數
        tens = Math.floor((num % 100) / 10); // 十位數
        hundreds = Math.floor((num % 1000) / 100); // 百位數

    }
    return {
        ones,     // 個位數
        tens,     // 十位數
        hundreds  // 百位數
    };
}

const clockBGColor = computed(() => {

    if (getDigits(countdownData.days).tens == 0 && getDigits(countdownData.days).ones == 0 &&
        getDigits(countdownData.hours).tens == 0 && getDigits(countdownData.hours).ones == 0 &&
        getDigits(countdownData.minutes).tens == 0 && getDigits(countdownData.minutes).ones == 0 &&
        getDigits(countdownData.seconds).tens < 1 && getDigits(countdownData.seconds).ones < 10) {
        return `bg-red-500`
    } else {
        if (props.clockColor.substr(0, 2) == 'bg') {
            return props.clockColor
        } else {
            return `bg-[${props.clockColor}]`
        }
    }
});
</script>

<template>
    <div v-if="loading" class="mt-2 flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            class="w-10 h-10 animate-spin fill-current text-gray-200">
            <path
                d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
        </svg>
    </div>
    <div v-if="!loading" class="flex items-center text-inherit gap-2">
        <div :style="{ width: clockWidth, height: clockHeight }" :class="[clockBGColor]"
            class="rounded-md flex justify-center items-center font-bold shadow-md">
            <div v-if="getDigits(countdownData.days).hundreds > 0" class="overflow-hidden h-full"
                :style="{ color: clockFont.color, fontSize: clockFont.size }">
                <div class="h-full duration-200"
                    :style="{ transform: `translateY(${getDigits(countdownData.days).hundreds * -100}%)` }">
                    <div v-for="i in 10" :key="i" class="h-full flex items-center">{{ i - 1 }}</div>
                </div>
            </div>
            <div v-if="getDigits(countdownData.days).tens > 0" class="overflow-hidden h-full"
                :style="{ color: clockFont.color, fontSize: clockFont.size }">
                <div class="h-full duration-200"
                    :style="{ transform: `translateY(${getDigits(countdownData.days).tens * -100}%)` }">
                    <div v-for="i in 10" :key="i" class="h-full flex items-center">{{ i - 1 }}</div>
                </div>
            </div>
            <div :style="{ color: clockFont.color, fontSize: clockFont.size }" class="overflow-hidden h-full">
                <div class="h-full duration-200"
                    :style="{ transform: `translateY(${getDigits(countdownData.days).ones * -100}%)` }">
                    <div v-for="i in 10" :key="i" class="h-full flex items-center">{{ i - 1 }}</div>
                </div>
            </div>
        </div>
        <div class="text-inherit font-bold">天</div>
        <div :style="{ width: clockWidth, height: clockHeight }" :class="[clockBGColor]"
            class="rounded-md flex justify-center font-bold shadow-md">
            <div v-if="getDigits(countdownData.hours).tens > 0" class="overflow-hidden h-full"
                :style="{ color: clockFont.color, fontSize: clockFont.size }">
                <div class="h-full duration-200"
                    :style="{ transform: `translateY(${getDigits(countdownData.hours).tens * -100}%)` }">
                    <div v-for="i in 10" :key="i" class="h-full flex items-center">{{ i - 1 }}</div>
                </div>
            </div>
            <div :style="{ color: clockFont.color, fontSize: clockFont.size }" class="overflow-hidden h-full">
                <div class="h-full duration-200"
                    :style="{ transform: `translateY(${getDigits(countdownData.hours).ones * -100}%)` }">
                    <div v-for="i in 10" :key="i" class="h-full flex items-center">{{ i - 1 }}</div>
                </div>
            </div>
        </div>
        <div class="text-inherit font-bold">時</div>
        <div :style="{ width: clockWidth, height: clockHeight }" :class="[clockBGColor]"
            class="rounded-md flex justify-center font-bold shadow-md">
            <div v-if="getDigits(countdownData.minutes).tens > 0" class="overflow-hidden h-full"
                :style="{ color: clockFont.color, fontSize: clockFont.size }">
                <div class="h-full duration-200"
                    :style="{ transform: `translateY(${getDigits(countdownData.minutes).tens * -100}%)` }">
                    <div v-for="i in 10" :key="i" class="h-full flex items-center">{{ i - 1 }}</div>
                </div>
            </div>
            <div :style="{ color: clockFont.color, fontSize: clockFont.size }" class="overflow-hidden h-full">
                <div class="h-full duration-200"
                    :style="{ transform: `translateY(${getDigits(countdownData.minutes).ones * -100}%)` }">
                    <div v-for="i in 10" :key="i" class="h-full flex items-center">{{ i - 1 }}</div>
                </div>
            </div>
        </div>
        <div class="text-inherit font-bold">分</div>
        <div :style="{ width: clockWidth, height: clockHeight }" :class="[clockBGColor]"
            class="rounded-md flex justify-center font-bold shadow-md">
            <div v-if="getDigits(countdownData.seconds).tens > 0" class="overflow-hidden h-full"
                :style="{ color: clockFont.color, fontSize: clockFont.size }">
                <div class="h-full duration-200"
                    :style="{ transform: `translateY(${getDigits(countdownData.seconds).tens * -100}%)` }">
                    <div v-for="i in 10" :key="i" class="h-full flex items-center">{{ i - 1 }}</div>
                </div>
            </div>
            <div :style="{ color: clockFont.color, fontSize: clockFont.size }" class="overflow-hidden h-full">
                <div class="h-full duration-200"
                    :style="{ transform: `translateY(${getDigits(countdownData.seconds).ones * -100}%)` }">
                    <div v-for="i in 10" :key="i" class="h-full flex items-center">{{ i - 1 }}</div>
                </div>
            </div>
        </div>
        <div class="text-inherit font-bold">秒</div>
    </div>
</template>

<style></style>