<template>
    <div>
       <h3 style="margin-bottom: 4px; margin-top: 0;">
            {{ display.month }} {{ week }}, {{ display.year }}
        </h3>
        <button
            class="yellow"
            @click="$emit('hit', 'up')"
        >
            Next Month
        </button>
        <button
            class="yellow"
            @click="$emit('hit', 'down')"
        >
            Previous Month
        </button>
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
        week: {
            type: [Number, String],
            required: true
        }
    }
}
</script>

<style>
.buttons {
    display: inline;
    margin: 3px;
}
</style>