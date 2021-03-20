<template>
    <div>
        <div class="stepsContainer">
            <div 
                class="stepContainer"
                v-for="step in totalSteps" 
                :key="step"
            >
                <div class="stepMain">
                    <p>Step {{ step }}</p>
                    <div :class="`step ${stepClass(step)}`"></div>
                    <p class="stepText" v-if="stepNamesSupported()">
                        {{ stepNames[step - 1] }}
                    </p>
                </div>
                <div v-if="step !== totalSteps" class="stepNext">
                    <span>></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "progressTracker",
    props: {
        totalSteps: {
            type: Number,
            required: true
        },
        currentStep: {
            type: Number,
            required: true
        },
        stepNames: {
            type: Array,
            required: false
        }
    },
    methods: {
        stepClass(step) {
            if (step === this.currentStep)
                return 'current'
            else if (step > this.currentStep)
                return 'after'
            else
                return 'before'
        },
        stepNamesSupported() {
            return !!this.stepNames && this.stepNames.length === this.totalSteps
        }
    }
}
</script>

<style lang="scss" scoped>

.stepsContainer {
    margin-left: auto;
    margin-right: auto;
    width: 60%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 7vh;

}

.stepContainer {
    margin-left: 2vh;
    margin-right: 2vh;
    margin-top: 1vh;
    width: 4vh;
    height: 4vh;
}

.stepMain {
    float: left;
    width: 4vh;
    height: 4vh;
}

.stepNext {
    float: right;
    width: 2vh;
    height: 4vh;
}

span {
    position: relative;
    left: 145%;
    bottom: 50%;
    font-size: 2.5vh;
    font-weight: bold;
}

.step {
    background: black;
    border-radius: 50%;
    width: 2vh;
    height: 2vh;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0.5vh;
    border: getColor("silver") solid 1px;
    &.after {
        background: getColor("red");
    }
    &.current {
        background: getColor("grey");
    }
    &.before {
        background: getColor("green");
    }
}

p {
    font-size: 1.1vh;
    color: black;
    line-height: 0;
}

.stepText {
    line-height: 1.5vh;
}

</style>