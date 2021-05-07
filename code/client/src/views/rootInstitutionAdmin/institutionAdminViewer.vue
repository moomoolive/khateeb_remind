<template>
    <div>

        <loading>
            <div v-if="admins.length > 0 && showAdmins" class="admin-container">
                <div 
                    v-for="(admin, index) in admins.filter(a => Object.keys(a).length > 0)" 
                    :key="index"
                >
                    <collapsable-box
                        :headline="`${admin.firstName} ${admin.lastName}`"
                        :tagDetails="adminTag(admin)"
                    >
                        <button class="red" @click="deleteAdmin(admin, index)">
                            {{ admin.confirmed ? 
                                `Delete ${admin.firstName} from System` :
                                `Reject ${admin.firstName} ${admin.lastName}'s Registration`
                            }}
                        </button>
                        <button 
                            v-if="!admin.confirmed" 
                            class="green"
                            @click="confirmAdminRegistration(admin)"
                        >
                            Confirm {{ admin.firstName }} {{ admin.lastName }}'s Registration
                        </button>
                        <div v-if="admin.confirmed">
                            <user-form-template
                                :formProps="{
                                    readOnly: true,
                                    basedOn: admin,
                                    backgroundColor: 'none',
                                    buttonText: 'Update'
                                }"
                            />
                        </div>
                    </collapsable-box>
                </div>
            </div>

            <general-message
                v-else
                :message="`No admins have signed up to your institution yet`"
                :fontAwesomeIcon="['far', 'paper-plane']"
            />

        </loading>

    </div>
</template>

<script>
import collapsableBox from '@/components/general/collapsableBox.vue'
import loading from '@/components/general/loadingScreen.vue'
import generalMessage from '@/components/misc/generalMessage.vue'
import userFormTemplate from '@/components/forms/templates/user.vue'

import requestHelpers from '@/libraries/requests/helperLib/main.js'

export default {
    name: 'createOtherInstitutionAdmins',
    components: {
        collapsableBox,
        loading,
        generalMessage,
        userFormTemplate,
    },
    data() {
        return {
            admins: [],
            showAdmins: true
        }
    },
    methods: {
        closeAddNewAdminForm() {
            this.showAddNewAdminForm = false
        },
        async confirmAdminRegistration(admin={}) {
            const res = await this._api.institutionAdmins.confirmAdmin({ adminId: admin._id, confirmed: true })
            if (!requestHelpers.dataWasDeleted(res)) {
                return
            }
            const targetAdminIndex = this.admins.findIndex(a => a._id === admin._id)
            this.admins[targetAdminIndex].confirmed = true
            return this.rerenderView()
        },
        rerenderView() {
            this.showAdmins = false
            this.$nextTick(() => this.showAdmins = true)
        },
        async deleteAdmin(admin={}, index=0) {
            const confirm = await this._utils.confirm(`Do you really want to permenantly delete this administrator?`)
            if (confirm) {
                const res = await this._api.institutionAdmins.deleteAdmin({ authId: admin.authorizationId, adminId: admin._id })
                if (requestHelpers.dataWasDeleted(res))
                    this.admins.splice(index, 1)
            }
        },
        async getOtherAdmins() {
            this.admins = await this._api.institutionAdmins.getOtherAdmins({ active: true })
        },
        adminTag(admin={}) {
            if (admin.confirmed) {
                return [{
                    words: `Last Active: ${this._utils.dynamicDisplayDate(admin.lastLogin)}`,
                    color: `goodNews`,
                    symbol: `☀️`
                }] 
            } else {
                return [{
                    words: `Registration Pending`,
                    color: `important`,
                    symbol: `⏳`
                }] 
            }
        }
    },
    created() {
        this.getOtherAdmins()
    }
}
</script>

<style lang="scss" scoped>
.admin-container {
    width: 80%;
    max-height: 300px;
    margin-left: auto;
    margin-right: auto;
    max-width: 1100px;
    max-height: 1500px;
}

.new-existing-divider {
    width: 92%;
    max-width: 1200px;
    margin-top: 15px;
    border-bottom: black solid 3px;
    margin-left: auto;
    margin-right: auto;
}

.popup-container {
    overflow-x: hidden;
    overflow-y: scroll;
    max-height: 305px;
}

.add-new-admin-button {
    width: 60px;
    height: 40px;
    font-size: 20px;
    font-weight: bold;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    margin-bottom: 35px;
}

button {
    width: 80%;
    max-width: 450px;
    max-height: 50px;
    font-size: 18px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    padding-top: 10px;
}

@media screen and (max-width: $phone-width) {
    .new-existing-divider {
        margin-top: 3vh;
        border-bottom: black solid 0.4vh;
    }

    .admin-container {
        width: 90%;
    }
    
}
</style>