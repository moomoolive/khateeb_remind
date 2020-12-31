<template>
    <div>
        <h2 v-if="adminIdentityNotFilled">
            Please fill in admin identity form to access text
            service
        </h2>
        <collapsable-box
            :headline="`Admin Identity`"
        >
            <template v-slot:content>
                <settings-form
                    :name="`admin profile`"
                    :invalidations="adminIdentity.invalidations"
                    :backgroundColor="`yellow-green`"
                    :emptySchema="adminIdentityData.emptySchema"
                    :previousEntries="adminIdentityData.previousEntries"
                    @submitted="$emit('submitted', $event)"
                />
            </template>
        </collapsable-box>
        <!-- -->
        <collapsable-box
            :headline="`Update Password`"
        >
            <template v-slot:content>
                <settings-form
                    :name="`updated password`"
                    :invalidations="updatePassword.invalidations"
                    :backgroundColor="`blue-green`"
                    :emptySchema="updatePassword.emptySchema"
                    @submitted="preprocessPassword($event)"
                />
            </template>
        </collapsable-box>
    </div>
</template>

<script>
import settingsForm from '@/components/forms/templates/settings.vue'

export default {
    name: 'adminDetails',
    components: {
        settingsForm
    },
    props: {
        adminIdentityData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            adminIdentityNotFilled: !this.adminIdentityData.previousEntries[0],
            adminIdentity: {
                invalidations: {
                    emptyField: ['firstName', 'lastName', 'email']
                },
            },
            updatePassword: {
                invalidations: {
                    invalidPassword: ['createNewPassword'],
                    notEqual: {
                        confirmNewPassword: 'createNewPassword'
                    }
                },
                emptySchema: {
                    __t: 'password',
                    options: {
                        confirmOldPassword: '',
                        createNewPassword: '',
                        confirmNewPassword: ''
                    }
                }
            }
        }
    },
    methods: {
        preprocessPassword($event) {
            const data = this._.deepCopy($event)
            data.confirm = data.options.confirmOldPassword
            data.options = data.options.createNewPassword
            this.toAPI(data)
        },
        toAPI(data) {
            this.$emit('submitted', data)
        }
    }
}
</script>

<style>

</style>