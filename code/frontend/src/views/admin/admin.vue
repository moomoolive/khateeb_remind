<template>
    <div>
        <admin-button-group />
        <div class="separator"></div>
        <router-view class="pages"></router-view>
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

<style lang="scss" scoped>
.pages {
    margin-top: 4vh;
}

.separator {
    margin-top: 3vh !important;
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    border-top: 0.5vh solid;
    border-image: linear-gradient(
        to right,
        themeRGBA("red", 0.5), 
        themeRGBA("blue", 0.5)
    ) 1;
}
</style>