<template>
    <div>
        <div class="topnav">
            <a href="https://github.com/moomoolive/khateeb_remind" target="_blank">
                Source Code
            </a>
        </div>
        <div v-if="showInstitutionName" class="institution-name">
            {{ institutionName }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Footer',
    computed: {
        authLevel() {
            return this.$store.getters['user/authLevel'] 
        },
        showInstitutionName() {
            return this.authLevel > 0 && this.$store.getters['user/isLoggedIn'] 
        },
        institution() {
            return this.$store.state.user.institution
        },
        institutionName() {
            return this.authLevel > 3 || this.institution.name === '__TEST__' ?  this.institution.name : this.institution.abbreviatedName
        },
    }
}
</script>

<style lang="scss" scoped>
.topnav {
    margin-top: 30px;
    overflow: hidden;
    left: 0;
    min-height: 20px;
    max-height: 40px;
    height: 7.1vh;
    width: 95.2vw;
    margin: 0;
    padding-left: 0.8vw;
    overflow: hidden;
    text-align: left;
}

a {
    position: relative;
    top: 7px;
    margin-left: 5px;
    text-decoration: none;
    color: getColor("silver");
    font-size: 11px;
    &:hover {
        color: getColor("blue")
    } 
}

.institution-name {
    text-align: right;
    float: right;
    position: relative;
    bottom: 30px;
    font-size: 11px;
    right: 5px;
    color: getColor("blue")
}
</style>