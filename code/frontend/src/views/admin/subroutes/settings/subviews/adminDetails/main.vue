<template>
    <div>
        <collapsable-box
            :headline="`Admin Identity`"
        >
            <template v-slot:content>
                <admin-identity />
            </template>
        </collapsable-box>
        <!-- -->
        <collapsable-box
            :headline="`Update Password`"
        >
            <template v-slot:content>
                <update-password/>
            </template>
        </collapsable-box>
    </div>
</template>

<script>
import adminIdentity from './subviews/adminIdentity.vue'
import updatePassword from './subviews/updatePassword.vue'

export default {
    name: 'adminDetails',
    components: {
        adminIdentity,
        updatePassword
    },
    methods: {
        parsedName(relativePath) {
            const x = relativePath.slice(1)
            return this._.stringFormat(x)
        }
    }
}
</script>

<style>

</style>