<template>
    <div>
        <loading>

            <div v-if="institutions.length > 0">
                <div
                    v-for="(institution, institutionIndex) in institutions"
                    :key="institutionIndex" 
                    class="grey institution-container"
                >
                    
                    <div class="institution-header">
                        {{ institution.name }}
                    </div>
                    <div class="institution-subheader">
                        <span class="blue">
                            {{ institution.abbreviatedName }}
                        </span>
                    </div>

                    <div v-if="!institution.confirmed">
                        <button class="green confirm-institition-button" @click="confirmInstitution(institution._id)">
                            Confirm Institution
                        </button>
                    </div>

                    <div class="institution-description">
                        <div>
                            🌎 {{ institution.timezone }}
                        </div>
                        <div>
                            🏁 {{ institution.state ? `${institution.state}, ` : '' }} {{ institution.country }}
                        </div>
                        <div>
                            <span :class="institution.confirmed ? 'green' : 'red' ">
                                📒 {{ institution.confirmed ? 'Confirmed' : 'Not Confirmed'  }}
                            </span>
                        </div>
                    </div>

                    <div class="institution-description">
                        <div>
                            <u>Settings</u>
                        </div>
                        <div>
                            👳 Auto-Confirm Registration: {{ institution.settings.autoConfirmRegistration }}
                        </div>
                        <div>
                            🕌 Allow Jummah Signup: {{ institution.settings.allowJummahSignup }} 
                        </div>
                        <div>
                            ✉️ Allow Jummah Notifications: {{ institution.settings.allowJummahNotifications }}
                        </div>
                    </div>

                    <div class="created-at-text">
                        <span class="purple">
                            Created: {{ _utils.dynamicDisplayDate(institution.createdAt) }}
                        </span>
                    </div>
                </div>
            </div>
            
            <general-message
                v-else
                :message="`Couldn't retrieve institutions`"
                :fontAwesomeIcon="['far', 'paper-plane']"
            />

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import generalMessage from '@/components/misc/generalMessage.vue'

export default {
    name: "sysAdminInstitutionViewer",
    components: {
        loading,
        generalMessage
    },
    data() {
        return {
            institutions: []
        }
    },
    methods: {
        async getAllInstitutions() {
            this.institutions = await this._api.sysAdmin.getInstitutions()
        },
        async confirmInstitution(institutionID="1234") {
            const res = await this._api.sysAdmin.updateInstitution({ institutionID, confirmed: true })
            const index = this.institutions.findIndex(i => i._id === res._id)
            this.institutions.splice(index, 1, res)
        }
    },
    created() {
        this.getAllInstitutions()
    }
}
</script>

<style lang="scss" scoped>
.institution-container {
    font-size: 16px;
    width: 90%;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 10px;
    padding-right: 10px;
    max-width: 500px;
    text-align: left;
    color: get-color("off-white");
    @include normal-border-rounding();
    @include center-margin();
    @include floating-box-shadow();
    margin-top: 30px;
}

.institution-description {
    margin-top: 30px;
}

.created-at-text {
    margin-top: 25px;
    font-size: 11px;
}

.confirm-institition-button {
    margin-left: 0;
}

.institution-header {
    font-size: 1.3em;
}

.institution-subheader {
    font-size: 1.15em;
}

@media screen and (max-width: $phone-width) {

    .institution-container {
        font-size: 14px;
    }

}
</style>