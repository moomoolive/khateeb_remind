<template>
    <div style="padding-top: 20px;">
        <div>
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
                {{ _.parseCamelCase(link) }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'adminButtonGroup',
    data() {
        return {
            instituteName: this.$store.state.institution,
            buttonLinks: [
                ['schedule', 'announcements', 'khateebs'],
                ['settings']
            ],
            selected: null
        }
    },
    methods: {
        click(extension) {
            this.$router.push(`/admin/${this.instituteName}/${extension}`)
            this.selected = extension
        },
        isCurrentRoute(routeName) {
            return routeName === this.selected
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
</style>