<template>
    <div class="extContainer">
        <slot></slot>
        <protected-input 
            :defaultValidators="defaultValidators"
            :name="`confirm`"
            :options="{ toggle: true }"
            @changed="process($event)"
        />
        <slot name="invalidMsgs"></slot>
    </div>
</template>

<script>
import protectedInput from '@/components/forms/extensions/free/protectedExt.vue'

export default {
    name: "formConfirmsExt",
    components: {
        protectedInput
    },
    props: {
        bindedTo: {
            type: String,
            required: true
        },
        defaultValidators: {
            type: Object,
            required: true
        },
        bindedName: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            cachedInput: null
        }
    },
    methods: {
        process($event) {
            delete $event.created
            this.cachedInput = this.utils.deepCopy($event)
            $event.state = this.sameAsBind($event.val)
            $event.msgs = this.invalidMsg($event.state)
            delete $event.val
            this.$emit('changed', $event)
        },
        sameAsBind(data) {
            return data === this.bindedTo
        },
        invalidMsg(state) {
            if (!state)
                return [`Not equal to ${this.bindedName}`]
            else
                return []
        }
    },
    computed: {
        
    },
    watch: {
        bindedTo() {
            this.process(this.cachedInput)
        }
    }
}
</script>

<style lang="scss" scoped>
span {
    position: absolute;
    right: 10.5vh;
    font-size: 2.5vh;
    z-index: 1;
    opacity: 01;
    margin-top: auto;
    margin-bottom: auto;
    &:hover {
        cursor: pointer;
    }
}
</style>