<template>
    <div>
        <p 
            :class="
                `tag ${tagLoader.wiggle ? 'wiggle' : ''} ${contentLoader('color')} ${isInvisible ? 'invisible' : ''}`
            "
        >
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
            },
            new_wiggle: {
                words: 'New',
                symbol: '⏲️',
                color: "default",
                wiggle: true
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
            if (typeof(this.info) === 'string') 
                return this[this.info]
            else if (!this.info) 
                return this.important
            else 
                return this.info
        },
        isInvisible() {
            if (this.info)
                return this.info.isInvisible
            else
                return false
        }
    }
}
</script>

<style lang="scss" scoped>
$tags: (
    "important": "red", 
    "urgent": "yellow", 
    "goodNews": "green"
);

.invisible {
    visibility: hidden;
}

@mixin tagBackground($color) {
    background-color: getColor($color) !important;
    color: black;
}

@mixin tagIcon($color) {
    background-color: darken(getColor($color), 20%);
}

@mixin tag($section) {
    @each $tag, $color in $tags {
        &.#{$tag} {
            @if $section == 'background' {
                @include tagBackground($color)
            } @else {
                @include tagIcon($color)
            }
        }
    }
}
div {
    margin: 0;
}

@keyframes wiggle {
    0% { transform: rotate(0deg); }
   80% { transform: rotate(0deg); }
   85% { transform: rotate(5deg); }
   95% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}

.tag {
    display: inline-block;
    font-size: 1.4vh !important;
    pointer-events: none;
    background-color: getColor("blue") !important;
    padding: 0.8vh;
    color: getColor("offWhite");
    margin: 0 1vh 0 0;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;
    @include tag('background');

    &.wiggle {
        animation: wiggle 2.5s;
        animation-iteration-count: 8;
    }
}

.words {
    margin-left: 1vh;
}

.icon {
    $padding: 0.5vh;
    pointer-events: auto;
    padding: $padding;
    padding-left: 0.8vh;
    color: getColor("offWhite");
    background-color: darken(getColor("blue"), 20%);
    border-radius: 2px;
    @include tag('icon')
}

</style>