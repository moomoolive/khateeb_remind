<template>
    <div class="buttonGroup">
        <div class="dashboard">
            <button
                @click="click('dashboard')"
                :disabled="isCurrentRoute('dashboard')"
            >
                Dashboard/Admin Home
            </button>
        </div>
        <div 
            v-for="(buttonGroup, index) in buttonLinks" :key="index"
        >
            <button
                v-for="link in buttonGroup" :key="link"
                :disabled="isCurrentRoute(link)"
                class="blue buttonLinks"
                @click="click(link)"
            >
                {{ _.stringFormat(link) }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'adminButtonGroup',
    data() {
        return {
            buttonLinks: [
                ['schedule', 'announcements', 'khateebs'],
                ['settings']
            ],
            selected: null
        }
    },
    methods: {
        click(extension) {
            this.$router.push(`/institutionAdmin/${extension}`)
            this.selected = extension
            if (this.isSavedChangesScreenDisplayed) {
                this.$store.dispatch('adminSavedChangesScreen', false)
            }
        },
        isCurrentRoute(routeName) {
            return routeName === this.selected
        }
    },
    computed: {
        isSavedChangesScreenDisplayed() {
            return this.$store.state.admin.savedChanges
        }
    },
    created() {
        this.selected = this.$router.currentRoute.fullPath.split('/')[3]
    }
}
</script>

<style>
.buttonLinks {
    display: inline;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 5px;
}

.dashboard {
    margin-bottom: 3vh;
}

.buttonGroup {
    margin-top: 2.5vh;
}
</style>