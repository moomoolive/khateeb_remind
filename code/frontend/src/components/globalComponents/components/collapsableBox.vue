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
                <component
                :is="componentX"
                v-bind="options"
                />
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
        options: {
            type: Object,
            required: false
        },
        tagDetails: {
            type: [Array, String],
            required: false
        },
        pathToComponentFromComponents: {
            type: String,
            required: true
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
    },
    computed: {
        componentX() {
            return () => import(`@/components/${this.pathToComponentFromComponents}.vue`)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/components/collapsableBox.scss';
</style>