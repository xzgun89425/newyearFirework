<script setup>
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import taipei101 from "@/assets/taipei101.jpg"
import tower from "@/assets/85.jpg"
import alimountain from "@/assets/alimountain.jpeg"
import centerpark from "@/assets/centerpark.jpg"

dayjs.extend(duration);
const canvas = ref(null);
const ctx = ref(null);
const countdown = ref(10); // 倒數時間（秒）
const countdownDate = ref('2025-1-1 00:00:00'); // 倒數日期
const timer = ref(null);
const bgIndex = ref(0)
const bgList = reactive([
    { name: '臺北101', alt: 'taipei101', img: taipei101 },
    { name: '高雄85大樓', alt: '85tower', img: tower },
    { name: '嘉義阿里山', alt: 'alimountain', img: alimountain },
    { name: '臺中中央公園', alt: 'centerpark', img: centerpark },
])
// Helper functions
const PI2 = Math.PI * 2;
const random = (min, max) => Math.random() * (max - min + 1) + min | 0;
const timestamp = () => new Date().getTime();

// Firework and Birthday logic
class Firework {
    constructor(x, y, targetX, targetY, shade, offsprings) {
        this.dead = false;
        this.offsprings = offsprings;

        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;

        this.shade = shade;
        this.history = [];
    }

    update(delta) {
        if (this.dead) return;

        const xDiff = this.targetX - this.x;
        const yDiff = this.targetY - this.y;
        if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
            this.x += xDiff * 2 * delta;
            this.y += yDiff * 2 * delta;

            this.history.push({ x: this.x, y: this.y });
            if (this.history.length > 20) this.history.shift();
        } else {
            if (this.offsprings && !this.madeChilds) {
                const babies = this.offsprings / 2;
                for (let i = 0; i < babies; i++) {
                    const targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0;
                    const targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0;

                    birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0));
                }
            }
            this.madeChilds = true;
            this.history.shift();
        }

        if (this.history.length === 0) {
            this.dead = true;
        } else {
            for (let i = 0; i < this.history.length; i++) {
                const point = this.history[i];
                ctx.value.beginPath();
                ctx.value.fillStyle = `hsl(${this.shade},100%,${this.offsprings ? i : 50}%)`;
                ctx.value.arc(point.x, point.y, 1, 0, PI2, false);
                ctx.value.fill();
            }
        }
    }
}

class Birthday {
    constructor() {
        this.resize();
        this.fireworks = [];
        this.counter = 0;
    }

    resize() {
        canvas.value.width = window.innerWidth;
        this.width = canvas.value.width;
        const center = this.width / 2 | 0;
        this.spawnA = center - center / 4 | 0;
        this.spawnB = center + center / 4 | 0;

        canvas.value.height = window.innerHeight;
        this.height = canvas.value.height;
        this.spawnC = this.height * 0.1;
        this.spawnD = this.height * 0.5;
    }

    onClick(evt) {
        const x = evt.clientX || (evt.touches && evt.touches[0].pageX);
        const y = evt.clientY || (evt.touches && evt.touches[0].pageY);

        const count = random(3, 10);
        for (let i = 0; i < count; i++) {
            this.fireworks.push(new Firework(
                random(this.spawnA, this.spawnB),
                this.height,
                x,
                y,
                random(0, 260),
                random(30, 110)
            ));
        }

        this.counter = -1;
    }

    update(delta) {
        ctx.value.globalCompositeOperation = 'hard-light';
        ctx.value.fillStyle = `rgba(0,0,0,${7 * delta})`;
        ctx.value.fillRect(0, 0, this.width, this.height);

        ctx.value.globalCompositeOperation = 'lighter';
        for (const firework of this.fireworks) firework.update(delta);

        this.counter += delta * 3;
        if (this.counter >= 1) {
            this.fireworks.push(new Firework(
                random(this.spawnA, this.spawnB),
                this.height,
                random(0, this.width),
                random(this.spawnC, this.spawnD),
                random(0, 360),
                random(30, 110)
            ));
            this.counter = 0;
        }

        if (this.fireworks.length > 1000) {
            this.fireworks = this.fireworks.filter(firework => !firework.dead);
        }
    }
}

let birthday;
let then = timestamp();

const loop = () => {
    requestAnimationFrame(loop);

    const now = timestamp();
    const delta = (now - then) / 1000;
    then = now;

    birthday.update(delta);
};
const fireworksAudio = ref(null);
onMounted(async () => {
    await checkDate()
    const countdownInterval = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            fireworksAudio.value?.play();
            clearInterval(countdownInterval);

            ctx.value = canvas.value.getContext('2d');
            birthday = new Birthday();

            window.addEventListener('resize', birthday.resize.bind(birthday));
            document.addEventListener('click', birthday.onClick.bind(birthday));
            document.addEventListener('touchstart', birthday.onClick.bind(birthday));

            loop();
        }
    }, 1000);
});

function checkDate(params) {
    const now = dayjs(); // 取得現在的時間
    const target = dayjs(countdownDate.value); // 目標日期
    const diff = target.diff(now); // 計算差異，單位是毫秒
    if (diff <= 0) {
        clearInterval(timer.value);
        countdown.value = 0 // 如果目標日期已經過去
    } else {
        countdown.value = Math.floor(dayjs.duration(diff).asSeconds())
    }
}

onUnmounted(() => {
    window.removeEventListener('resize', birthday.resize.bind(birthday));
    document.removeEventListener('click', birthday.onClick.bind(birthday));
    document.removeEventListener('touchstart', birthday.onClick.bind(birthday));
});

function changePlace(params) {
    if (countdown.value <= 0 && params == 'bg') {
        return
    }
    if (bgIndex.value == 3) {
        bgIndex.value = 1;
    } else {
        bgIndex.value++
    }
}
</script>

<template>
    <div @click="changePlace('bg')" class="bg-black cursor-pointer w-screen h-[100dvh]">
        <img :src="bgList[bgIndex].img" :class="[countdown > 0 ? 'opacity-50' : 'opacity-20']"
            class="fixed top-0 left-0 z-50 w-screen h-[100dvh] object-cover duration-500" :alt="bgList[bgIndex].alt" />
        <canvas ref="canvas"></canvas>
        <h1 :class="[countdown > 0 ? 'opacity-0' : 'opacity-100']"
            class="w-full text-center text-3xl md:text-5xl duration-500 font-bold mb-4 absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
            <p class="mb-4">2025 新年快樂</p>
            <p>祝大家大紅大紫</p>
        </h1>
        <div v-if="countdown > 0"
            class="text-white absolute top-1/2 left-1/2 z-[60] -translate-x-1/2 -translate-y-1/2 text-xl w-full flex flex-col items-center">
            <h1 class="text-center text-3xl md:text-5xl font-bold mb-4">2025 跨年倒數計時</h1>
            <Countdown v-model="countdownDate"></Countdown>
        </div>
        <audio hidden="true" ref="fireworksAudio">
            <source src="/fireworks.mp3" type="audio/mpeg" />
        </audio>

        <button @click.stop="changePlace('btn')"
            class="font-bold text-lg text-white bg-rose-500 hover:bg-rose-600 shadow-lg py-2 w-60 rounded-md absolute bottom-10 left-1/2 z-50 -translate-x-1/2">
            點我換地點：{{ bgList[bgIndex].name }}
        </button>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&family=Noto+Sans+TC:wght@100..900&display=swap');

canvas {
    display: block;
    position: relative;
    z-index: 40;
}

h1 {
    font-family: "M PLUS Rounded 1c", serif;
    text-shadow: 0px 0px 20px #f43f5e,
        0px 0px 20px #f43f5e,
        0px 0px 20px #f43f5e,
        0px 0px 20px #f43f5e;
}

.font {
    font-family: "M PLUS Rounded 1c", serif;
}
</style>