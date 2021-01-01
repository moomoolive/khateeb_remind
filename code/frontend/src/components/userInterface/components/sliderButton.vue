<template>
    <div class="top">
        <p>{{ offMsg }}</p>
        <label class="switch" :aria-label="altText">
            <input type="checkbox" v-model="isToggled">
            <span 
                :class="`slider round ${untoggledColor}`" 
                @click="$emit('toggled', !isToggled)"
            ></span>
        </label>
        <p>{{ onMsg }}</p>
    </div>
</template>

<script>
export default {
    name: 'sliderButton',
    props: {
        offMsg: {
            type: String,
            required: false
        },
        onMsg: {
            type: String,
            required: false
        },
        altText: {
          type: String,
          required: false
        },
        basedOn: {
            type: Boolean,
            required: true
        },
        untoggledColor: {
            type: String,
            required: false,
            default: 'grey'
        }
    },
    data() {
        return {
            isToggled: null
        }
    },
    created() {
        this.isToggled = this.basedOn
    }
}
</script>

<style lang="scss" scoped>
@import "~@/scss/components/sliderButton.scss";
</style>