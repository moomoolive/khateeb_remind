<template>
    <div>
        <button
            :class="`collapsible ${buttonColor} ${isActive ? `active` : ``} ${boxShadow ? 'box-shadow' : ''}`"
            @click="clicked()"
            ref="open-dropdown"
        >
            {{ headline }}
            <span style="float: right;" class="icon">
                {{ isActive ? "-" : "+" }}
            </span>
            <div class="tag">
                <tag-box 
                    v-for="(tag, index) in tagsArray" :key="index"
                    :info="tag"
                    style="display: inline;"
                />
            </div>
        </button>
        <collapse-transition :duration="600">
            <div
                v-if="isActive"
                :class="`content ${bodyColor}`"
                :style="`width: ${contentWidth}%;`"
                v-on-clickaway="clickedAwayFromContent"
            >
                <slot></slot>
            </div>
        </collapse-transition>
    </div>
</template>

<script>
import tagBox from '@/components/general/tagBox.vue'

import { mixin as clickaway } from 'vue-clickaway'

import { CollapseTransition } from "@ivanv/vue-collapse-transition"

export default {
    name:'collapsableBox',
    mixins: [clickaway],
    components: {
        tagBox,
        CollapseTransition
    },
    props: {
        headline: {
            type: String,
            required: true
        },
        tagDetails: {
            type: Array,
            required: false,
            default: () => []
        },
        contentWidth: {
            type: Number,
            required: false,
            default: 98
        },
        buttonColor: {
            type: String,
            required: false,
            default: 'grey'
        },
        bodyColor: {
            type: String,
            required: false,
            default: 'blue'
        },
        closeOnClickAway: {
            type: Boolean,
            required: false,
            default: true
        },
        boxShadow: {
            type: Boolean,
            required: false,
            default: true
        },
        invisibleTagIfEmpty: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        return {
            isActive: false
        }
    },
    methods: {
        clicked() {
            this.isActive = !this.isActive
        },
        clickedAwayFromContent() {
            if (this.isActive && this.closeOnClickAway)
                this.isActive = false
        }
    },
    computed: {
        tagsArray() {
            if (this.tagDetails && this.tagDetails.length > 0)
                return this.tagDetails
            else if (this.invisibleTagIfEmpty)
                return [{
                    words: 'Imporant',
                    symbol: '⭐',
                    color: 'important',
                    isInvisible: true
                }]
            else
                return []
        }
    }
}
</script>

<style lang="scss" scoped>
.active { 
    @include blinking-animation($speedOfAnimation: 5s, $opacity: 2);
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0; 
}

.grey {
    background-color: get-color("grey");
    &:hover {
        background-color: get-color("grey") !important;
        color: get-color("off-white") !important;
    }
}

.red {
    background-color: get-color("dark-red");
    &:hover {
        background-color: get-color("dark-red") !important;
        color: get-color("off-white") !important;
    }
}

.collapsible {
  color: white;
  padding: 20px;
  height: auto !important;
  border: none;
  text-align: left;
  outline: none;
  font-size: 17px;
  font-weight: bold;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0;
  position: relative;
  z-index: 0;
  width: 98%;
}

.box-shadow {
    @include floating-box-shadow();
}

.icon {
    color: get-color("blue");
    position: relative;
    left: 5px;
}

.tag {
  margin-top: 10px;
}

.content {
    $padding: 15px;
    padding-top: $padding;
    padding-bottom: $padding;
    overflow: auto;
    max-height: 1500px;
    position: relative;
    z-index: 0 !important;
    $rad: 4px;
    border-bottom-left-radius: $rad;
    border-bottom-right-radius: $rad;
    margin: auto;
    &.blue {
        background: get-color("dark-blue", 0.8);
    }   
    &.silver {
        background: get-color("silver", 0.8);
    }
}

@media screen and (max-width: $phone-width) {
    .collapsible {
        padding: 2vh;
        font-size: 2vh;
    }
    .tag {
        margin-top: 1vh;
    }
    .content { 
        $padding: 1.5vh;
        padding-top: $padding;
        padding-bottom: $padding;
    }
}

</style>