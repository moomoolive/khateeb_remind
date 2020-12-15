<template>
    <div style="background-color: white;">
        <button
        type="button" 
        :class="`collapsible`"
        style=""
        @click="clicked()"
        >
            {{ headline }}
            <span style="float: right;" class="icon">
                {{ icon }}
            </span>
            <div>
                <tag-box 
                v-for="(tag, index) in tagLoader" :key="index"
                :preset="tag"
                :words="tag.words"
                :symbol="tag.symbol"
                :color='tag.color'
                style="display: inline"
                />
            </div>
        </button>
        <div
        class="content"
        :style="`
            max-height: ${maxHeight};
            overflow: hidden;
            transition: max-height 1s ease-out;
            width: ${contentWidth}%;
        `"
        v-if="contentBox"
        ref="content"
        >
            <component
            :is="componentX"
            v-bind="options"
            />
        </div>
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
            default: 100
        }
    },
    data() {
        return {
            contentBox: false,
            icon: '+',
            component: null
        }
    },
    methods: {
        clicked() {
            this.contentBox = !this.contentBox
            this.contentBox ? this.icon = "-" : this.icon = "+"
        }
    },
    computed: {
        maxHeight() {
            if (this.contentBox) {
                this.$nextTick(() => {
                    return this.$refs.content.scrollHeight
                })
            }
            else return 0
        },
        componentX() {
            return () => import(`../${this.pathToComponentFromComponents}.vue`)
        },
        tagLoader() {
            if (this.tagDetails === 'default') return [{}];
            else return this.tagDetails
        },
        presetLoader() {
            const presetTypes = ['important', 'urgent']
            for (let preset in presetTypes) {
                if (this.tagDetails[0] === preset) {
                    return this.tagDetails
                }
            }
        }
    },
    created() {
        this.componentX()
            .then((res) => { this.component = this.componentX() })
    }
}
</script>

<style lang="scss" scoped>
.tag {
    background-color: red;
    padding: 0.1vh;
    border-radius: 5px;
}

/* Style the button that is used to open and close the collapsible content */
.collapsible {
  background-color: #333;
  color: white;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
  font-weight: bold;
  border-bottom: white solid 1px;
}

.icon {
    color: $blue;
    position: relative;
    left: 5px;
}

/* Style the collapsible content. Note: hidden by default */
.content {
    overflow: hidden;
    background-color: #f1f1f1;
    margin: auto;
}

p {
    font-size: 1.5vh;
    text-align: left;
}
</style>