<template>
    <div class="tutorial-popup-container">
        <div class="selector-container">
            <select v-model="tutorialCategory">
                <option
                    v-for="(tutorialsInCategory, tutorialCategory) in tutorials"
                    :key="tutorialCategory"
                    :value="tutorialCategory"
                >
                    {{ _.stringFormat(tutorialCategory) }}
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
                <img src="~@/assets/tutorials/bismillahBlue.png">
                <component :is="tutorial" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "tutorialNotification",
    components: {
        "general1": () => import("@/components/staticHTML/tutorials/general/1.vue"),
        "khateebs1": () => import("@/components/staticHTML/tutorials/khateebs/1.vue")
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
                ],
                khateebs: [
                    "Getting Started"
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
    background: getColor("lightGrey");
    color: darken(getColor("purple"), 12%);
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
    border-top: 1px darken(getColor("orange"), 12%) solid;
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