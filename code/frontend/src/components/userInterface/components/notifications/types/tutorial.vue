<template>
    <div class="tutorial-container">
        <component
            class="tutorial" 
            :is="tutorial"
        />
    </div>
</template>

<script>
export default {
    name: "tutorialNotification",
    components: {
        "general1": () => import("@/components/staticHTML/tutorials/general/1.vue")
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
            tutorialCategory: this.options.category
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
.tutorial-container {
    padding-top: 20px;
    padding-bottom: 20px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.tutorial {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    max-height: 280px;
}
</style>