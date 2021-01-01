<template>
    <div>
        <msg-with-pic
            v-if="isLoading"
            :msg="`Loading...`"
            :gif="`loading`"
        />
        <div v-if="!isLoading">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'loading',
    props: {
        loadingTime: {
            type: Number,
            required: false,
            default: 600
        }
    },
    data() {
        return {
            isLoading: true
        }
    },
    created() {
        window.setTimeout(() => this.isLoading = false, this.loadingTime)  
    }
}
</script>