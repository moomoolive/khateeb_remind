<template>
    <div style="padding-top: 20px;">
        <admin-button-group />
        <router-view class="displayedAdminPage"></router-view>
    </div>
</template>

<script>
import AdminButtonGroup from '@/components/misc/adminButtonGroup.vue'

export default {
    name: 'adminParentRoute',
    components: {
        AdminButtonGroup
    }
}
</script>

<style>
.displayedAdminPage {
    margin-top: 20px !important;
    border-top: black 2px solid;
}
</style>