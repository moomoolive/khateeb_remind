<template>
    <div></div>
</template>

<script>
export default {
    name: "complexKeyBinder",
    props: {
        targetKeyBinds: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            keyBindingIsActive: {}
        }
    },
    methods: {
        handleKeyBinds(windowResponse) {
            this.registerKeyBind(windowResponse)
            if (this.allKeyTargetKeyBindingAreActive())
                this.$emit('all-key-bindings-active')
        },
        registerKeyBind({ key, type }) {
            const isOneOfTargetKeys = this.targetKeyBinds.find(binding => binding === key)
            if (!isOneOfTargetKeys)
                return
            if (type === 'keydown')
                this.keyBindingIsActive[key] = true
            else if (type === 'keyup')
                this.keyBindingIsActive[key] = false
        },
        createEventListeners() {
            window.addEventListener('keydown', this.handleKeyBinds)
            window.addEventListener('keyup', this.handleKeyBinds)
        },
        destroyEventListeners() {
            window.removeEventListener('keydown', this.handleKeyBinds)
            window.removeEventListener('keyup', this.handleKeyBinds)
        },
        initializeTargetKeyBinds(targetKeyBinds) {
            targetKeyBinds.forEach(binding => this.keyBindingIsActive[binding] = false)
        },
        allKeyTargetKeyBindingAreActive() {
            // eslint-disable-next-line
            for (const [_, value] of Object.entries(this.keyBindingIsActive)) {
                if (!value)
                    return false
            }
            return true
        }
    },
    created() {
        this.initializeTargetKeyBinds(this.targetKeyBinds)
        this.createEventListeners()
    },
    destroyed() {
        this.destroyEventListeners()
    }
}
</script>