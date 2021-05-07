<template>
    <div>
        <span :class="color">
            <fa-icon 
                :icon="icon"
                :style ="`font-size: ${fontSize}px;`"
            />
        </span>
    </div>
</template>

<script>
export default {
    name: "dropdownArrow",
    props: {
        faceDown: {
            type: Boolean,
            required: true
        },
        color: {
            type: String,
            required: false,
            default: 'grey'
        },
        fontSize: {
            type: Number,
            required: false,
            default: 15,
        }
    },
    computed: {
        icon() {
            return this.faceDown ? 'chevron-down' : 'chevron-right'
        }
    }
}
</script>

<style lang="scss" scoped>

</style>