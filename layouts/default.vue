<script setup>
import { createClient } from '@supabase/supabase-js'
const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
const table = ref([])
async function getInstruments() {
    const { data } = await supabase.from('FirstTable').select()
    table.value = data
    console.log(data);

}
onMounted(() => {
    getInstruments()
});
</script>

<template>
    <!-- <ul>
        <li v-for="item in table" :key="item.id">{{ item.created_at }}</li>
    </ul> -->
    <slot />
</template>

<style scoped></style>
