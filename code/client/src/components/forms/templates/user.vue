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
        },
        editableKhateebFormat: {
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
            },
            editableKhateeb: {
                confirmed: {
                    type: 'readOnly',
                    required: true
                },
                availableTimings: {
                    type: 'readOnly',
                    required: true
                },
                unavailableDates: {
                    type: 'readOnly',
                    required: true,
                    alias: 'Unavailable Days this Month'
                },
                dropouts: {
                    type: 'readOnly',
                    required: true
                },
                active: {
                    type: 'checkbox',
                    required: true
                }
            }
        }
    },
    methods: {
        editableKhateebBaseForm() {
            const baseForm = { ...this.baseUser }
            for (const [key, value] of Object.entries(baseForm)) {
                value.type = 'readOnly'
                if (key === 'phoneNumber')
                    value.format = 'phoneNumber'
            }
            return baseForm
        }
    },
    computed: {
        formStructure() {
            let form = this.editableKhateebFormat ? this.editableKhateebBaseForm() : { ...this.baseUser }
            if (this.userType !== 'khateeb')
                delete form.title
            if (this.includeVitals)
                form = { ...this.userVitals , ...form }
            if (this.includeIdAppender) {
                form = { ...this.idAppender, ...form }
                form.institutionID.selectOptions = this.institutionIDs
            }
            if (this.editableKhateebFormat)
                form = { ...form, ...this.editableKhateeb  }
            return form
        }
    }
}
</script>

<style>

</style>