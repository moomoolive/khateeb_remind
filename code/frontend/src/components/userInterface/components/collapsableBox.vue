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
            default: 98
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
.active { @include blinkingAnimation($speedOfAnimation: 5s, $opacity: 2); }

.collapsible {
  background-color: getColor("grey");
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
  width: 98%;
  &:hover {
    background-color: getColor("grey") !important;
    color: getColor("offWhite") !important;
  }
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
    background: themeRGBA("darkBlue", 0.8);
    $padding: 15px;
    padding-top: $padding;
    padding-bottom: $padding;
    overflow: hidden;
    $rad: 4px;
    border-bottom-left-radius: $rad;
    border-bottom-right-radius: $rad;
    margin: auto;
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