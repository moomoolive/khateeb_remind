<template>
    <div>
        <div 
            v-if="isLoading || !externalFinishSignal" 
            class="loading-container"
        >
            <div>
                <img 
                    src="~@/assets/gifs/loading.gif" 
                    alt="loading animation"
                    class="loading-animation"
                >
            </div>
            <div class="loading-text">
                <span :class="textColor">
                    Loading...
                </span>
            </div>
        </div>
        <div v-if="!isLoading && externalFinishSignal">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import Config from '$config'

export default {
    name: 'loading',
    components: {
    },
    props: {
        loadingTime: {
            type: Number,
            required: false,
            default: Config.networkConfig.defaultIOLoadingTime
        },
        externalFinishSignal: {
            type: Boolean,
            required: false,
            default: true
        },
        textColor: {
            required: false,
            type: String,
            default: 'grey'
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

<style lang="scss" scoped>
.loading-text {
    font-size: 26px;
    font-weight: bold;
}

.loading-animation {
    width: 65%;
    max-width: 275px;
    @include centerMargin();
}
</style>