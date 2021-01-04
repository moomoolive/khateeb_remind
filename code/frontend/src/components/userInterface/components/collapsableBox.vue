<template>
    <div>
        <button
            :class="`collapsible ${isActive ? `active` : ``}`"
            @click="clicked()"
        >
            {{ headline }}
            <span style="float: right;" class="icon">
                {{ icon }}
            </span>
            <div class="tag">
                <tag-box 
                    v-for="(tag, index) in tagDetails" :key="index"
                    :info="tag"
                    style="display: inline;"
                />
            </div>
        </button>
        <transition name="dropdown">
            <div
                class="content"
                :style="`width: ${contentWidth}%;`"
                v-if="isActive"
            >
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name:'collapsableBox',
    props: {
        headline: {
            type: String,
            required: true
        },
        tagDetails: {
            type: Array,
            required: false
        },
        contentWidth: {
            type: Number,
            required: false,
            default: 95
        }
    },
    data() {
        return {
            isActive: false,
            icon: '+',
            component: null
        }
    },
    methods: {
        clicked() {
            this.isActive = !this.isActive
            this.isActive ? this.icon = "-" : this.icon = "+"
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/components/collapsableBox.scss';
</style>