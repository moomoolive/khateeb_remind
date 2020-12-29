<template>
    <div>
        <admin-button-group />
        <div class="separator"></div>
        <router-view
            v-if="!savedChanges" 
            class="pages"
        ></router-view>
        <div v-if="savedChanges">
            <msg-with-pic
                title="Alhamdillah! Hooray!"
                gif="flyingPlanesAllOver"
                msg="Changes successfully made!"
            />
            <button 
                class="green"
                @click="$store.dispatch('adminSavedChangesScreen', false)"
            >
                Make More Changes
            </button>
        </div>
    </div>
</template>

<script>
import AdminButtonGroup from '@/components/misc/adminButtonGroup.vue'

export default {
    name: 'adminParentRoute',
    components: {
        AdminButtonGroup
    },
    computed: {
        savedChanges() {
            return this.$store.state.admin.savedChanges
        }
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