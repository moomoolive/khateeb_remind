<template>
    <div>
        <div
            v-for="(field, name) in inputData"
            :key="name"
        >
            <div v-if="isRenderable(name)">
                <p>{{ _.stringFormat(name) }}:</p>
                <div v-if="!isTextArea(name)">
                    <input 
                        :type="typeLoader(name)" 
                        v-model="inputData[name]"
                    ><br>
                </div>
                <div v-if="isTextArea(name)">
                    <textarea
                        v-model="inputData[name]"
                    ></textarea><br>
                </div>
                <span v-if="
                    feedbackExists(name) && 
                    inputIsText(name) &&
                    fieldIsNotValid(name)
                "
                >
                    <u>
                        {{ 
                            textFieldInvalidMsg[name] === 'default' ? 
                            defaultInvalidFeedback(name) : textFieldInvalidMsg[name]
                        }}
                    </u>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'formRenderer',
    props: {
        inputData: {
            type: Object,
            required: true
        },
        bigText: {
            type: [Array],
            required: false,
            default: () => []
        },
        textFieldInvalidMsg: {
            type: Object,
            required: false
        },
        doNotRender: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    data() {
        return {
            doNotRenderDefaults: ['_id', 'savedOn', '_t', '__v']
        }
    },
    methods: {
        typeLoader(fieldName) {
            const type = typeof(this.inputData[fieldName])
            return this.typeToInput(type)
        },
        typeToInput(type) {
            let x;
            switch(type) {
                case "string":
                    x = 'text'
                    break
                case "boolean":
                    x = "checkbox"
                    break
            }
            return x
        },
        isTextArea(fieldName) {
            return fieldName === this.bigText.find(elem => elem === fieldName)
        },
        feedbackExists(fieldName) {
            return this.textFieldInvalidMsg[fieldName]
        },
        inputIsText(fieldName) {
            return this.typeLoader(fieldName) === 'text'
        },
        defaultInvalidFeedback(fieldName) {
            return `${this._.stringFormat(fieldName)} Cannot be Empty`
        },
        addToDefaultDoNotRender() {
            this.doNotRenderDefaults = [...this.doNotRenderDefaults, ...this.doNotRender]
        },
        fieldIsNotValid(fieldName) {
            if (this.$parent) {
                return this.$parent[fieldName + 'NotValid']
            } else return true
        },
        isRenderable(fieldName) {
            return fieldName !== this.doNotRenderDefaults.find(elem => elem === fieldName)
        }
    },
    created() {
        this.addToDefaultDoNotRender()
        console.log(this.doNotRenderDefaults)
    }
}
</script>

<style lang="scss" scoped>
input[type=checkbox] {
    display: inline;
}

p {
    font-weight: bold;
    font-size: 1.75vh;
    margin-bottom: 0.5vh;
}

span {
    font-size: 1.5vh;
    color: getColor("red");
}
</style>