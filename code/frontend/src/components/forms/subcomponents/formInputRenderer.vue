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
                    inputIsText(name) &&
                    fieldIsNotValid(name)
                "
                >
                    <u>
                        {{ 
                            customInvalidMsg && customInvalidMsg[name] ? 
                            customInvalidMsg[name] : defaultInvalidFeedback(name)
                        }}
                    </u>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'formInputRenderer',
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
        customInvalidMsg: {
            type: Object,
            required: false,
            default: () => {}
        },
        doNotRender: {
            type: Array,
            required: false,
            default: () => []
        },
        activeInvalidations: {
            type: Object,
            required: false
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
            return this.fieldIsInArray(fieldName, 'bigText')
        },
        inputIsText(fieldName) {
            return this.typeLoader(fieldName) === 'text'
        },
        defaultInvalidFeedback(fieldName) {
            return `This is an invalid ${this._.stringFormat(fieldName, 'camel', 'lower')}`
        },
        addToDefaultDoNotRender() {
            this.doNotRenderDefaults = [...this.doNotRenderDefaults, ...this.doNotRender]
        },
        fieldIsNotValid(fieldName) {
            if (!this.$parent) {
                return false
            } else return this.activeInvalidations[fieldName]
        },
        isRenderable(fieldName) {
            return !this.fieldIsInArray(fieldName, 'doNotRenderDefaults')
        },
        fieldIsInArray(fieldName, arrayName) {
            return fieldName === this[arrayName].find(elem => elem === fieldName)
        }

    },
    created() {
        this.addToDefaultDoNotRender()
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