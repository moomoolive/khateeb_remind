<template>
    <div>
        <form-main
            v-bind="{
                ...formProps,
                structure: formStructure
            }"
            @submitted="$emit('submitted', $event)"
        />
    </div>
</template>

<script>
import formMain from '@/components/forms/main.vue'

export default {
    name: 'userForm',
    components: {
        formMain
    },
    props: {
        includeVitals: {
            type: Boolean,
            required: false,
            default: false
        },
        formProps: {
            type: Object,
            required: false,
            default: () => {}
        },
        khateebMode: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            userVitals: {
                username: {
                    required: true,
                    minLength: 6
                },
                password: {
                    type: 'protected',
                    required: true,
                    minLength: 6
                }
            },
            baseUser: {
                handle: {
                    validators: 'handle',
                    required: true,
                },
                title: {
                    type: "dropdown",
                    required: true,
                    selectOptions: ['none', 'Shiekh', 'Imam']
                },
                firstName: {
                    required: true
                },
                lastName: {
                    required: true
                },
                email: {
                    validators: 'email',
                    required: true
                }
            },
            khateebMeta: {
                availableTimings: {
                    required: true
                },
                unavailableDates: {
                    required: true
                }
            }
        }
    },
    methods: {
        
    },
    computed: {
        formStructure() {
            let form = { ...this.baseUser }
            if (this.includeVitals) {
                form = { ...this.userVitals , ...form }
            }
            if (this.khateebMode) {
                form = { ...form, ...this.khateebMeta }
            }
            return form
        }
    }
}
</script>

<style>

</style>