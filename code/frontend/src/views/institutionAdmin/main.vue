<template>
    <div>
        <admin-button-group v-show="showAdminButtons" />
        <div v-show="!showAdminButtons" class="return-to-central-container">
            <button class="back-to-central silver" @click="toAdminCentral()">
                <p>
                    <!-- this isn't a mistake, i'm litterally using a lesser sign here -->
                    <span class="back-arrow"> < </span> 
                    Back
                </p>
            </button>
        </div>
        <transition
        name="fade"
        mode="out-in"
        >
            <router-view
                v-if="!savedChanges" 
                class="pages"
            ></router-view>
        </transition>
        <div v-if="savedChanges">
            <msg-with-pic
                title="Alhamdillah!"
                gif="flyingPlanesAllOver"
                msg="Changes successfully made!"
            />
            <button 
                class="green make-more-changes"
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
    data() {
        return {
            currentRoute: this.$router.currentRoute.fullPath
        }
    },
    methods: {
        toAdminCentral() {
            this.$router.push('/institutionAdmin/')
        }
    },
    computed: {
        savedChanges() {
            return this.$store.state.admin.savedChanges
        },
        showAdminButtons() {
            return this.currentRoute === '/institutionAdmin/'
        }
    },
    updated() {
        this.currentRoute = this.$router.currentRoute.fullPath
    },
    destroyed() {
        this.$store.dispatch('adminSavedChangesScreen', false)
    }
}
</script>

<style lang="scss" scoped>
.pages {
    margin-top: 20px;
}

.return-to-central-container {
    width: 95%;
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
}

.back-to-central {
    width: 23%;
    max-width: 110px;
    height: 5vh;
    max-height: 45px;
    border-radius: 100px 100px 100px 100px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    color: black;
}

.make-more-changes {
    max-width: 220px;
    font-size: 17px;
}

.back-arrow {
    float: left;
}

p {
    margin: 0;
    text-align: right;
}

@media screen and (max-width: $phoneWidth) {
      .notifications-size-position {
        width: 70%;
        height: 35vh;
        font-size: 2vh;
      }
      .page-padding {
        padding-bottom: 5%;
        padding-top: 13% !important;
      }
      .make-more-changes {
            max-width: 220px;
            font-size: 2vh;
        }
}
</style>