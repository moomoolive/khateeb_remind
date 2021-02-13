<template>
    <div>
        <button
            :class="`collapsible ${buttonColor} ${isActive ? `active` : ``}`"
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
                :class="`content ${bodyColor}`"
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
.active { 
    @include blinkingAnimation($speedOfAnimation: 5s, $opacity: 2);
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0; 
}

.grey {
    background-color: getColor("grey");
    &:hover {
        background-color: getColor("grey") !important;
        color: getColor("offWhite") !important;
    }
}

.red {
    background-color: getColor("darkRed");
    &:hover {
        background-color: getColor("darkRed") !important;
        color: getColor("offWhite") !important;
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

.icon {
    color: getColor("blue");
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
        background: themeRGBA("darkBlue", 0.8);
    }   
    &.silver {
        background: themeRGBA("silver", 0.8);
    }
}

@media screen and (max-width: $phoneWidth) {
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