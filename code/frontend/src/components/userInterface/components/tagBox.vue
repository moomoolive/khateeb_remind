<template>
    <div>
        <p :class="`tag ${contentLoader('color')}` ">
            <span :class='"icon " + contentLoader("color")'>
                {{ contentLoader('symbol') }}
            </span>
            <span class="words">
                {{ contentLoader('words') }}
            </span>
        </p>
    </div>
</template>

<script>
export default {
    name: 'tagBox',
    props: {
        info: {
            type: [String, Object],
            required: false
        },
        isWiggling: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            important: {
                words: 'Imporant',
                symbol: '⭐',
                color: 'important'
            },
            urgent: {
                words: 'Urgent',
                symbol: '⚠️',
                color: 'urgent'
            },
            good: {
                words: 'All Good',
                symbol: '😄',
                color: 'goodNews'
            },
            new: {
                words: 'New',
                symbol: '⏲️',
                color: "default"
            }
        }
    },
    methods: {
        contentLoader(field) {
            return this.tagLoader[field]
        }
    },
    computed: {
        tagLoader() {
            if (typeof(this.info) === 'string') return this[this.info]
            else if (!this.info) return this.important
            else return this.info
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/components/tagBoxes.scss';
</style>