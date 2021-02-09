<template>
    <div>
        <msg-with-pic
            v-if="isLoading || !externalFinishSignal"
            :msg="`Loading...`"
            :gif="`loading`"
            :textColor="textColor"
        />
        <div v-if="!isLoading && externalFinishSignal">
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
            default: 700
        },
        externalFinishSignal: {
            type: Boolean,
            required: false,
            default: true
        },
        textColor: {
            required: false,
            type: String,
            default: 'default'
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