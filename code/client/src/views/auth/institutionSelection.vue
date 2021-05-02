<template>
    <div>
        
        <complex-key-binder 
            :targetKeyBinds="['t', 'Control', 'Alt']"
            @all-key-bindings-active="testInstitutionSignup()"
        />

        <loading :loadingTime="1200">
            <div v-if="showingInstitutions.length > 0">
                <div
                    v-for="(institution, institutionIndex) in showingInstitutions"
                    :key="institutionIndex"
                    class="grey institution-selection-button"
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
                                {{ _utils.stringFormat(institution.name) }}
                            </div>
                            <div class="institution-text small">
                                <span class="blue">({{ institution.abbreviatedName }})</span>
                            </div>
                            <div class="institution-text">
                                <span class="purple">
                                    <span v-if="institution.state !== _config.nullId">
                                        {{ institution.state }},
                                    </span>
                                     {{ institution.country }}
                                </span>
                            </div>
                        </div>
                        <div class="signup-link-container">
                            <div 
                                :class="`signup-link
                                    ${userPermissions[`${institution._id}-institutionAdmin`] || userPermissions[`${institution._id}-rootInstitutionAdmin`] ? 
                                        ' invisible' : ''
                                    }`
                                "
                                @click="signupPipeline(institution, 'institutionAdmin')"
                            >
                                <span class="signup-icon green">
                                    <fa-icon icon="suitcase-rolling" />
                                </span>
                                Signup as Administrator
                            </div>
                            <div 
                                :class="`signup-link${userPermissions[`${institution._id}-khateeb`] ? ' invisible' : ''}`" 
                                @click="signupPipeline(institution, 'khateeb')"
                            >
                                <span class="signup-icon blue">
                                    <fa-icon icon="mosque" />
                                </span> 
                                Signup as Khateeb
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <general-message
                v-else
                :message="`There was a problem finding institutions to sign up for...`"
                :fontAwesomeIcon="['far', 'paper-plane']"
            />

        </loading>

    </div>
</template>

<script>
import complexKeyBinder from '@/components/misc/complexKeyBinder.vue'
import loading from '@/components/general/loadingScreen.vue'
import generalMessage from '@/components/misc/generalMessage.vue'

export default {
    name: "institutionSelections",
    components: {
        loading,
        complexKeyBinder,
        generalMessage
    },
    data() {
        return {
            allInstitutions: [],
            institutionLogosFromRequest : []
        }
    },
    methods: {
        async getAllConfirmedInstitutions() {
            this.allInstitutions = await this._api.misc.institutionSelection()
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
            const image = await this._api.logos.getInstitutionLogo({ institutionID })
            const target = this.institutionLogosFromRequest.find(i => i.id === institutionID)
            target.image = image
        },
        signupPipeline(institutionInfo={}, role="khateeb") {
            if (this.$store.getters['user/isLoggedIn'])
                return this.addAuthorization(institutionInfo, role)
            else
                return
        },
        async addAuthorization(institutionInfo={}, role="khateeb") {
            const res = await this._api.user.addAuthorization({ institution: institutionInfo._id, role })
            if (res === 0) {
                this._utils.toHomePage()
            }
            // eslint-disable-next-line
            console.log(res)
        }
    },
    computed: {
        showingInstitutions() {
            if (this.allInstitutions.length > 1)
                return this.allInstitutions.filter(i => i.name !== "test")
            else
                return this.allInstitutions
        },
        userPermissions() {
            const permissions = this.$store.state.user.userInfo.authorizations
            return permissions
                .map(p => ({ institution: p.authId.institution._id, role: p.authId.role }))
                .reduce((total, p) => {
                    const obj = {}
                    obj[`${p.institution}-${p.role}`] = true
                    return { ...total, ...obj }
                }, {})
            
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
    width: 80%;
    max-width: 600px;
    padding-bottom: 20px;
    padding-top: 20px;
    padding-right: 15px;
    padding-left: 15px;
    @include floatingBoxShadow(0.4);
    margin-top: 20px;
    @include lightBorderRounding();
    @include centerMargin();
}

.institution-selection-content-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
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
    color: getColor("offWhite");

    &.small {
        font-size: 14px;
    }
}

.signup-link-container {
    margin-left: 20px;
    color: getColor("offWhite");
    text-align: left;
}

.signup-link {
    margin-bottom: 7px;
    cursor: pointer;

    &:hover {
        color: getColor("blue");
    }

    &.invisible {
        visibility: hidden;
    }
}

.signup-icon {
    margin-left: 3px;
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

    .signup-link-container {
        margin-left: 0px;
        margin-top: 20px;
    }
}
</style>