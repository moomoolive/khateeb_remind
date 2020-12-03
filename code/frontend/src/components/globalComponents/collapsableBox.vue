<template>
    <div>
        <button
        type="button" 
        :class="`collapsible`"
        style=""
        @click="clicked()"
        >
            {{ headline }}<span style="float: right;">{{ icon }}</span><br>
            <span
            v-if="isUrgent === 'true'"
            class="tag"
            >
                !!Urgent!!
            </span>
            <span v-show="false">hi there</span>
            <span
            v-if="isVeryImportant === 'true'"
            class="tag"
            style="background-color: orange;"
            >
                !!Important!!
            </span>
        </button>
        <div
        class="content"
        :style="`max-height: ${maxHeight};`"
        v-if="contentBox"
        ref="content"
        >
            <p>{{ content }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name:'collapsableBox',
    props: {
        content: {
            type: String,
            required: true
        },
        headline: {
            type: String,
            required: true
        },
        isUrgent: {
            type: String,
            default: 'false',
            required: false
        },
        isVeryImportant: {
            type: String,
            default: 'false',
            required: false
        }
    },
    data() {
        return {
            contentBox: false,
            icon: '+'
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
        }
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
}

/* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
.collapsible:hover {
  background-color: #ccc;
}

/* Style the collapsible content. Note: hidden by default */
.content {
  overflow: hidden;
  background-color: #f1f1f1;
}

p {
    font-size: 1.5vh;
    text-align: left;
}
</style>