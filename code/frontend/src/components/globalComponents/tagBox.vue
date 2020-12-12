<template>
    <div>
        <p :class="'tag ' + contentLoader('color')">
            <span :class='"icon " + contentLoader("color")'>
                {{ contentLoader('symbol') }}
            </span>
            {{ contentLoader('words') }}
        </p>
    </div>
</template>

<script>
export default {
    name: 'tagBox',
    props: {
        words: {
            type: String,
            required: false,
            default: 'New'
        },
        symbol: {
            type: String,
            required: false,
            default: '^'
        },
        color: {
            type: String,
            required: false,
            default: 'goodNews'
        },
        preset: {
            type: [String, Object],
            required: false
        }
    },
    data() {
        return {
            important: {
                words: 'Imporant',
                symbol: '*',
                color: 'important'
            },
            urgent: {
                words: 'Urgent',
                symbol: '!',
                color: 'urgent'
            },
            good: {
                words: 'All Good',
                symbol: ':)',
                color: 'goodNews'
            },
            new: {
                words: 'New',
                symbol: '^'
            },
            show: true
        }
    },
    methods: {
        contentLoader(field) {
            const x = typeof(this.preset) == 'string' ? this.presetLoader[field] : this[field]
            return x
        }
    },
    computed: {
        presetLoader() {
            if (this.preset === 'urgent') {
                return this.urgent
            }
            else if (this.preset === 'important') {
                return this.important
            }
            else if (this.preset === 'good') {
                return this.good
            }
            else if (this.preset === 'new') {
                return this.new
            }
        }
    }
}
</script>

<style lang="scss" scoped>
div {
    margin: 0;
}

.tag {
  pointer-events: none;
  background-color: #242424 !important;
  color: white;
  padding: 6px;
  margin: 5px;
  margin-bottom: 0;
  &.urgent{
        background-color: #DEDE2A !important;
        color: black;
    }
    &.important{
        background-color: #C93333 !important;
        color: black;
    }
    &.goodNews {
        background-color: #4CAF50 !important;
    }
}

.icon {
    $top: 4px;
    pointer-events: auto;
    padding-left: $top;
    margin-right: 6px;
    color: #ccc;
    background-color: #111;
    &.urgent{
        background-color: #C4C425;
        color: black;
    }
    &.important{
        background-color: #8A2222;
    }
    &.goodNews {
        background-color: #38823A;
        color: white;
    }
}
</style>