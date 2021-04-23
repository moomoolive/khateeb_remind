<template>
    <div>
        
        <complex-key-binder 
            :targetKeyBinds="['t', 'Control', 'Alt']"
            @all-key-bindings-active="testInstitutionSignup()"
        />

        <loading :loadingTime="1200">
            <div v-if="showingInstitutions.length > 0">
                <button
                    v-for="(institution, institutionIndex) in showingInstitutions"
                    :key="institutionIndex"
                    class="grey institution-selection-button"
                    @click="$router.push({ path: '/create/khateebs', query: { institutionID: institution._id } })"
                >
                    <div class="institution-selection-content-container">
                        <div>
                            <img 
                                :src="institutionLogosFromRequest.find(i => i.id === institution._id).image" 
                                class="image-container"
                                :alt="`${institution.name}'s logo`"
                            >
                        </div>
                        <div>
                            <div class="institution-text">
                                {{ institution.name }}
                            </div>
                            <div class="institution-text small">
                                <span class="blue">({{ institution.abbreviatedName }})</span>
                            </div>
                            <div class="institution-text">
                                <span class="purple">
                                    {{ institution.state }}, {{ institution.country }}
                                </span>
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            <msg-with-pic 
                v-else
                :msg="`There was a problem finding institutions to sign up for...`"
                :gif="`twirlingPlane`"
            /> 
            

        </loading>

    </div>
</template>

<script>
import complexKeyBinder from '@/components/misc/complexKeyBinder.vue'
import loading from '@/components/general/loadingScreen.vue'
import msgWithPic from '@/components/general/msgWithPic.vue'

export default {
    name: "institutionSelections",
    components: {
        loading,
        complexKeyBinder,
        msgWithPic
    },
    data() {
        return {
            allInstitutions: [],
            institutionLogosFromRequest : []
        }
    },
    methods: {
        async getAllConfirmedInstitutions() {
            this.allInstitutions = await this.$API.misc.institutionSelection()
        },
        testInstitutionSignup() {
            const testInstitution = this.allInstitutions.find(i => i.name === "test")
            if (testInstitution)
                this.$router.push({ path: '/create/khateebs', query: { institutionID: testInstitution._id } })
        },
        getAllInstitutionImages() {
            this.institutionLogosFromRequest = this.allInstitutions.map(i => {
                return { id: i._id, image: require('@/assets/logos/genericInstitution.png')  }
            })
            this.allInstitutions.forEach(i => this.getInstitutionImage(i._id))
        },
        async getInstitutionImage(institutionID="1234") {
            const image = await this.$API.logos.getInstitutionLogo({ institutionID })
            const target = this.institutionLogosFromRequest.find(i => i.id === institutionID)
            target.image = image
        }
    },
    computed: {
        showingInstitutions() {
            if (this.allInstitutions.length > 1)
                return this.allInstitutions.filter(i => i.name !== "test")
            else
                return this.allInstitutions
        }
    },
    watch: {
        allInstitutions(newVal, oldVal) {
            if (newVal.length > oldVal.length)
                this.getAllInstitutionImages()
        }
    },
    created() {
        this.getAllConfirmedInstitutions()
    }
}
</script>

<style lang="scss" scoped>
.institution-selection-button {
    width: 90%;
    max-width: 600px;
    padding-bottom: 20px;
    padding-top: 20px;
    padding-right: 15px;
    padding-left: 15px;
    @include floatingBoxShadow();
    margin-top: 20px;
}

.institution-selection-content-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.image-container {
    height: 100px;
    width: 100px;
    margin-right: 30px;
    border: getColor("blue") solid 3px;
}

.institution-text {
    margin-bottom: 10px;
    text-align: left;
    font-size: 18px;

    &.small {
        font-size: 14px;
    }
}

@media screen and (max-width: $phoneWidth) {
    .image-container {
        margin-right: 20px;
        height: 80px;
        width: 80px;
    }

    .institution-text {
        font-size: 16px;

        &.small {
            font-size: 13px;
        }
    }
}
</style>