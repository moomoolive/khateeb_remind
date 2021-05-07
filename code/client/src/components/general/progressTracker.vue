<template>
    <div>
        <div class="stepsContainer">
            <div
                class="stepContainer" 
                v-for="step in totalSteps" 
                :key="step"
            >
                <p>Step {{ step }}</p>
                <div>
                    <div :class="`step ${stepClass(step)}`">
                        <span 
                            v-if="step !== totalSteps" 
                            class="stepNext"
                        >
                                >
                        </span>
                    </div>
                </div>
                <div>
                    <p class="stepText" v-if="stepNamesSupported()">
                        {{ stepNames[step - 1] }}
                    </p>
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
    max-width: 600px;
    margin-top: 10px;
}

.stepContainer {
    display: inline-block;
    margin-left: 10px;
    margin-right: 10px;
}

.stepText {
    max-width: 50px;
    line-height: 13px;
}

span {
    position: relative;
    font-size: 20px;
    font-weight: bold;
    left: 32px;
}

.step {
    background: black;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    @include floating-box-shadow(0.3);
    &.after {
        background: get-color("red");
    }
    &.current {
        background: get-color("grey");
    }
    &.before {
        background: get-color("green");
    }
}

p {
    font-size: 12px;
    color: black;
    line-height: 0;
}

</style>