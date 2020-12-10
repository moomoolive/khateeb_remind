<template>
    <div>
       <h3 style="margin-top: 0px; margin-bottom: 4px;">
            <button @click="$emit('hit', 'up')">Add month</button>
            {{ display.month }} {{ week }}, {{ display.year }}
            <button @click="$emit('hit', 'down')">Less month</button>
        </h3>
    </div>
</template>

<script>
export default {
    name: 'monthIncrementer',
    props: {
        display: {
            type: Object,
            required: true
        },
        week: Number
    }
}
</script>

<style>

</style>