<template>
    <div class="tutorial-popup-container">
        <div class="selector-container">
            <select v-model="tutorialCategory">
                <option
                    v-for="(tutorialsInCategory, tutorialCategory) in tutorials"
                    :key="tutorialCategory"
                    :value="tutorialCategory"
                >
                    {{ _utils.stringFormat(tutorialCategory) }}
                </option>
            </select>
            <select v-model="tutorialNumber">
                    <option
                        v-for="(tutorial, index) in tutorials[tutorialCategory]"
                        :key="tutorial" 
                        :value="index + 1"
                    >
                        {{ tutorial }}
                    </option>
            </select>
        </div>
        <div class="tutorial-scroll-divider"></div>
        <div class="tutorial-scroller">
            <div class="tutorial-container">
                <img src="~@/assets/tutorials/bismillahBlue.png" alt="'in the name of god the most gracious the most merciful' in Arabic">
                <component :is="tutorial" @close="$emit('close')" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "tutorialNotification",
    components: {
        "general1": () => import("@/staticHTMLPages/tutorials/general/1.vue")
    },
    props: {
        options: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            tutorialNumber: this.options.number,
            tutorialCategory: this.options.category,
            tutorials: {
                general: [
                    "Multiple Selector"
                ]
            }
        }
    },
    computed: {
        tutorial() {
            return this.tutorialCategory + this.tutorialNumber
        }
    }
}
</script>

<style lang="scss" scoped>
.tutorial-popup-container {
    padding-top: 20px;
    padding-bottom: 20px;
}

select {
    width: 32%;
    margin-left: 3%;
    margin-right: 3%;
    height: 4vh;
    max-height: 50px;
    font-size: 14px;
    border-radius: 3px;
    outline: 0;
    border: 0;
    background: get-color("light-grey");
    color: darken(get-color("purple"), 12%);
}

.selector-container {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 15px;
}

img {
    width: 100%;
}

.tutorial-scroller {
    max-height: 280px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.tutorial-scroll-divider {
    border-top: 1px darken(get-color("orange"), 12%) solid;
    width: 70%;
    margin-left: auto;
    margin-right: auto;
}

.tutorial-container {
    width: 85%;
    margin-top: 10px;
    padding-top: 15px;
    margin-left: auto;
    margin-right: auto;
}
</style>