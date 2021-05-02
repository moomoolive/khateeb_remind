<template>
    <div>

        <div>
            <button 
                class="add-new-admin-button blue round"
                @click="openAddNewAdminForm()"
            >
                +
            </button>
        </div>

        <general-popup-container
            v-if="showAddNewAdminForm"
            :closeOnClickAway="false"
            @close="closeAddNewAdminForm()"
        >
            <div class="popup-container">
                <user-form-template 
                    :userType="`institutionAdmin`"
                    :includeVitals="true"
                    :formProps="{
                        buttonText: 'Create New Admin',
                        bindedExts: ['confirms'],
                        backgroundColor: 'yellow'
                    }"
                    @submitted="submitAdmin($event)"
                />
            </div>
        </general-popup-container>

        <loading>
            <div v-if="admins.length > 0" class="admin-container">
                <div 
                    v-for="(admin, index) in admins.filter(a => Object.keys(a).length > 0)" 
                    :key="index"
                >
                    <collapsable-box
                        :headline="`${admin.firstName} ${admin.lastName}`"
                        :tagDetails="[{
                            words: `Last Active: ${_utils.dynamicDisplayDate(admin.lastLogin)}`,
                            color: `goodNews`,
                            symbol: `☀️`
                        }]"
                    >
                        <button class="red" @click="deleteAdmin(admin._id, index)">
                            Delete {{ admin.firstName }} from System
                        </button>
                        <user-form-template 
                            :userType="`institutionAdmin`"
                            :formProps="{
                                readOnly: true,
                                basedOn: admin,
                                backgroundColor: 'none',
                                buttonText: 'Update'
                            }"
                        />
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
import generalPopupContainer from '@/components/notifications/generalPopup.vue'

import requestHelpers from '@/libraries/requests/helperLib/main.js'

export default {
    name: 'createOtherInstitutionAdmins',
    components: {
        collapsableBox,
        loading,
        generalMessage,
        userFormTemplate,
        generalPopupContainer
    },
    data() {
        return {
            admins: [],
            showAddNewAdminForm: false
        }
    },
    methods: {
        openAddNewAdminForm() {
            this.showAddNewAdminForm = true
        },
        closeAddNewAdminForm() {
            this.showAddNewAdminForm = false
        },
        async submitAdmin(newAdmin={}) {
            const newlySavedAdmin = await this._api.institutionAdmins.createNewAdmin(newAdmin)
            this.admins.push(newlySavedAdmin)
            this.closeAddNewAdminForm()
            this._utils.alert(`Make sure to let the administrator you created know their password as soon as possible! Other wise they won't be able to log in!`)
        },
        async deleteAdmin(id, index) {
            const confirm = await this._utils.confirm(`Do you really want to permenantly delete this administrator?`)
            if (confirm) {
                const res = await this._api.institutionAdmins.deleteAdmin(id)
                if (requestHelpers.dataWasDeleted(res))
                    this.admins.splice(index, 1)
            }
        },
        async getOtherAdmins() {
            this.admins = await this._api.institutionAdmins.getOtherAdmins()
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