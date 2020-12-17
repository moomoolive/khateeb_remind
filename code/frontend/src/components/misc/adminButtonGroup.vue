<template>
    <div style="padding-top: 20px;">
        <div>
            <cool-btn
                buttonText="Dashboard/Admin Home"
                @pushed="click('dashboard')"
                :isDisabled="isCurrentRoute('dashboard')"
            />
        </div>
        <div 
            style="margin-top: 10px;"
            v-for="(buttonGroup, index) in buttonLinks" :key="index"
        >
            <cool-btn
                v-for="link in buttonGroup" :key="link"
                :buttonText="buttonText(link)"
                :isDisabled="isCurrentRoute(link)"
                color="blue"
                @pushed="click(link)"
                class="buttonLinks"
                />
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
        buttonText(linkName) {
            const splittedLink = linkName.split('-')
            let result = ''
            for (let word of splittedLink) {
                const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
                result += `${capitalized} `
            }
            return result
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