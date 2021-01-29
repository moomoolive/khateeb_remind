<template>
    <div>
        <div 
            v-for="(link, index) in buttonLinks" :key="index"
        >
            <button
                class="admin-nav silver"
                @click="click(link)"
            >
              <p>{{ _.stringFormat(link) }} <span class="arrow-icon">></span></p>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'adminButtonGroup',
    data() {
        return {
            buttonLinks: ['schedule', 'announcements', 'khateebs', 'settings'],
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

<style lang="scss" scoped>
.admin-nav {
    width: 80% !important;
    height: 7.3vh;
    max-height: 200px;
    max-width: 850px;
    padding: 10px 30px;
    border-radius: 100px 100px 100px 100px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    color: black;
}

p {
    margin: 0;
    text-align: left;
    font-size: 20px;
}

.arrow-icon {
    float: right;
    margin-right: 0;
    right: -5%;
}

@media screen and (max-width: $phoneWidth) {
      .admin-nav {
          width: 90% !important;
          padding: 1vh 3vh;
      }
      p {
          font-size: 2.4vh;
      }
}
</style>