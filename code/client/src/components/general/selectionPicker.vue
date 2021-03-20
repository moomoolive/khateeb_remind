<template>
    <div>
        <div>
            <tutorial-prompter
                :tutorials="[{ category: 'general', number: 1 }]"
            />
        </div>
        <div class="tutorial-container">
            <button
                @click="tutorial()"
            >
                How Does This Work?
            </button>
        </div>
        <div 
            v-for="(optionCategory, categoryName) in allOptionsDisplay"
            :key="categoryName"
            :class="`category-container ${categoryName}`"
        >
            <h1>{{ utils.stringFormat(categoryName) }} Options</h1>
            <div
                class="options-container"
            >
                <div 
                    v-for="(option, index) in optionCategory"
                    :key="index"
                    :class="`option-container ${categoryName}`"
                >
                    <div 
                        @click="switchCategory(categoryName, index, option)"
                        class="main-info"
                    >
                        <p
                            v-for="msg in option.display"
                            :key="msg"
                        >
                            {{ msg }}
                        </p>
                    </div>
                    <p
                        class="more-info-prompt"
                        @click="moreInfoHere(index, categoryName)"
                    >
                    {{ showInfoHere(index, categoryName) ? "📖 Less" : "📘 More"}} Info
                    </p>
                    <p
                        v-show="showInfoHere(index, categoryName)"
                        class="more-info-container"
                    >
                        {{ option.extraInfo }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import tutorialPrompter from '@/components/notifications/tutorialPrompter.vue'
import notificationHelpers from '@/libraries/notifications/main.js'

export default {
    name: "selectionPicker",
    components: {
        tutorialPrompter
    },
    props: {
        options: {
            type: Array,
            required: true
        },
        currentlySelected: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            selected: null,
            moreInfo: {
                show: false,
                index: null,
                categoryName: null
            }
        }
    },
    methods: {
        moreInfoHere(index, categoryName) {
            const time = 100
            window.setTimeout(() => { this.toggleInfo(index, categoryName) }, time)
        },
        toggleInfo(index, categoryName) {
            if (this.moreInfo.index === index && categoryName === this.moreInfo.categoryName)
                return this.moreInfo.show = !this.moreInfo.show
            this.moreInfo.show = true
            this.moreInfo.index = index
            this.moreInfo.categoryName = categoryName
        },
        tutorial() {
            notificationHelpers.tutorial("general", 1)
        },
        showInfoHere(index, categoryName) {
            return this.moreInfo.show && index === this.moreInfo.index && categoryName === this.moreInfo.categoryName
        },
        findInSelected(option) {
            return this.selected.find(select => select === option.val)
        },
        switchCategory(categoryName, index, option) {
            if (!option.val)
                return this.utils.alert(`You cannot unselect the default option. If you want your administrator to know that you're free for only certain jummahs, pick them from the selection below.`)
            if (categoryName === 'selected')
                this.selected.splice(index, 1)
            else
                this.selected.push(option.val)
            this.$emit('changed', this.selected)
        }
    },
    computed: {
        optionsLeft() {
            return this.options.filter(option => !this.findInSelected(option))
        },
        selectedOptions() {
            const selected = this.options.filter(option => this.findInSelected(option))
            if (selected.length > 0) 
                return selected
            else
                return [{
                    display: ["All Options", "Selected", "(Default)"],
                    extraInfo: "Click the top section of an item to move it from selected to unselected and vice versa.",
                    val: null
                }]
        },
        allOptionsDisplay() {
            return {
                selected: this.selectedOptions,
                unselected: this.optionsLeft
            }
        }
    },
    created() {
        this.selected = this.utils.deepCopy(this.currentlySelected)
    }
}
</script>

<style lang="scss" scoped>
.category-container {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
    margin-top: 20px;
    background-color: black;
    padding-bottom: 10px;
    padding-top: 10px;
    border-radius: 7px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    &.unselected {
        background: themeRGBA("darkRed", 0.7);
    }
    &.selected {
        background: themeRGBA("green", 0.7);
    }
}

.options-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}

.option-container {
    width: 70%;
    max-width: 200px;
    margin-bottom: 10px;
    margin-top: 10px;
    border-radius: 7px;
    padding-left: 2%;
    padding-right: 2%;
    padding-top: 10px;
    padding-bottom: 10px;
    max-height: 350px;
    background: themeRGBA("purple", 0.9);
    margin-left: auto;
    margin-right: auto;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    &.unselected {
        background: themeRGBA("purple", 0.9);
    }
    &.selected {
        background: themeRGBA("blue", 0.9);
    }
}

.main-info {
    border-bottom: 1px solid black;
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 5px;
}

.more-info-prompt {
    margin-top: 5px;
}

.more-info-container {
    margin-top: 5px;
    margin-bottom: 5px;
    background: themeRGBA("yellow", 0.6);
    border-radius: 4px;
    padding-top: 3px;
    padding-bottom: 3px;
}

p {
    margin: 0;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    font-size: 16px;
    color: getColor("offWhite");
    cursor: default;
}

h1 {
    font-size: 30px;
    text-decoration: underline;
    color: black;
}

button {
    margin-bottom: 0;
    font-size: 13px;
    max-width: 180px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.tutorial-container {
    text-align: left;
    width: 97%;
    margin-left: auto;
    margin-right: auto;
}

@media screen and (max-width: $phoneWidth) {
    p {
        font-size: 2.4vh;
    }
    h1 {
        font-size: 3.7vh;
    }
    .options-container {
        flex-direction: column;
        flex-wrap: nowrap;
    }
    .option-container {
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .more-info-prompt {
        margin-top: 10px;
    }
}
</style>