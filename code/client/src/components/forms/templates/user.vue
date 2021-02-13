<template>
    <div>
        <form-main
            :structure="structure"
            :bindedExts="['confirms']"
            :backgroundColor="backgroundColor"
            @submitted="$emit('changed', $event)"
            :formTitle="formTitle ? formTitle : ''"
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
        formTitle: {
            type: String,
            required: false
        },
        backgroundColor: {
            type: String,
            required: false,
            default: 'yellow-offWhite'
        }
    },
    data() {
        return {
            structure: {
                username: {
                    required: true,
                    minLength: 6
                },
                password: {
                    type: 'protected',
                    required: true,
                    minLength: 6
                },
                handle: {
                    type: 'handle',
                    required: true,
                },
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
            }
        }
    }
}
</script>

<style>

</style>