<template>
    <div>
       <h3 style="margin-bottom: 4px; margin-top: 0;">
            {{ display.month }} {{ week }}, {{ display.year }}
        </h3>
        <cool-btn
        buttonText="Next Month"
        color="yellow"
        class="buttons"
        @pushed="$emit('hit', 'up')"
        />
        <cool-btn
        buttonText="Previous Month"
        color="yellow"
        class="buttons"
        @pushed="$emit('hit', 'down')"
        />
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