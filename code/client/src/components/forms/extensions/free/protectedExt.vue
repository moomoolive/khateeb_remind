<template>
    <div>
        <input-primitive 
            :inputType="protect ? 'password' : 'text'"
            :default="options.default ? options.default : ''"
            @changed="process($event)"
        />
        <!--  -->
        <div class="toggleContainer">
            <span
                :style="`opacity: ${protect ? '1': '0.3'};`" 
                @click="protect = !protect"
                v-if="options.toggle"
            >
                👁️
            </span>
        </div>
    </div>
</template>

<script>
import inputPrimitive from '@/components/forms/extensions/primitives/input.vue'

export default {
    name: "formProtectedExt",
    components: {
        inputPrimitive
    },
    props: {
        options: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        defaultValidators: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            protect: true
        }
    },
    methods: {
        process($event) {
            const state = this.valid($event.val)
            const msgs = this.invalidMsgs(state)
            const info = {
                ...$event,
                state,
                msgs
            }
            this.$emit('changed', info)
        },
        valid(data) {
            if (this.options.minLength)
                return this.defaultValidators.minLength(data, this.options.minLength)
            else
                return this.defaultValidators.minLength(data, 1)
        },
        invalidMsgs(state) {
            if (!state) {
                const msg = this.options.minLength ? `${this._utils.stringFormat(this.name)} cannot be less than ${this.options.minLength} characters` : `${this._utils.stringFormat(this.name)} cannot be empty`
                return [msg]
            } else
                return []
        }
    }
}
</script>

<style lang="scss" scoped>
.toggleContainer {
    height: 1px;
    width: 90%;
    text-align: right;
    padding: 0;
    margin: 0;
}

span {
    margin: 0;
    padding: 0;
    font-size: 2.5vh;
    position: relative;
    bottom: 3.3vh;
    right: -5%;
    z-index: 1;
    &:hover {
        @include is-clickable();
    }
}

</style>