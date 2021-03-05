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
        includeIdAppender: {
            type: Boolean,
            required: false,
            default: false
        },
        userType: {
            type: String,
            required: true
        },
        formProps: {
            type: Object,
            required: false,
            default: () => {}
        },
        institutionIDs: {
            type: Array,
            required: false,
            default: () => []
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
                // khateebs only
                title: {
                    type: "dropdown",
                    required: true,
                    selectOptions: ['none', 'Shiekh', 'Imam']
                },
                // ends here
                firstName: {
                    required: true
                },
                lastName: {
                    required: true
                },
                phoneNumber: {
                    type: 'phoneNumber',
                    required: true
                }
            },
            idAppender: {
                institutionID: {
                    type: 'dropdown',
                    required: true,
                    selectOptions: null,
                    value: '_id',
                    display: "name",
                    alias: 'Institution'
                }
            }
        }
    },
    computed: {
        formStructure() {
            let form = { ...this.baseUser }
            if (this.userType !== 'khateeb')
                delete form.title
            if (this.includeVitals)
                form = { ...this.userVitals , ...form }
            if (this.includeIdAppender) {
                form = { ...this.idAppender, ...form }
                form.institutionID.selectOptions = this.institutionIDs
            }
            return form
        }
    }
}
</script>

<style>

</style>