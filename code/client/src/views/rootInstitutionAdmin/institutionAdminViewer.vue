<template>
    <div>

        <div>
            <button 
                class="add-new-admin-button blue"
                @click="openAddNewAdminForm()"
            >
                +
            </button>
        </div>

        <general-popup-container
            v-if="showAddNewAdminForm"
            @close="closeAddNewAdminForm()"
        >
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
                            words: `Last Active: ${utils.dynamicDisplayDate(admin.lastLogin)}`,
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

            <div v-else>
                <msg-with-pic 
                    :msg="`You're currently the only administrator at this institution`"
                    :gif="`sadCat`"
                />
            </div>

        </loading>

    </div>
</template>

<script>
import collapsableBox from '@/components/general/collapsableBox.vue'
import loading from '@/components/general/loadingScreen.vue'
import msgWithPic from '@/components/general/msgWithPic.vue'
import userFormTemplate from '@/components/forms/templates/user.vue'
import generalPopupContainer from '@/components/notifications/generalPopup.vue'

import requestHelpers from '@/libraries/requests/helperLib/main.js'

export default {
    name: 'createOtherInstitutionAdmins',
    components: {
        collapsableBox,
        loading,
        msgWithPic,
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
            const newlySavedAdmin = await this.$API.institutionAdmins.createNewAdmin(newAdmin)
            this.admins.push(newlySavedAdmin)
            this.closeAddNewAdminForm()
            this.utils.alert(`Make sure to let the administrator you created know their password as soon as possible! Other wise they won't be able to log in!`)
        },
        async deleteAdmin(id, index) {
            const confirm = await this.utils.confirm(`Do you really want to permenantly delete this administrator?`)
            if (confirm) {
                const res = await this.$API.institutionAdmins.deleteAdmin(id)
                if (requestHelpers.dataWasDeleted(res))
                    this.admins.splice(index, 1)
            }
        },
        async getOtherAdmins() {
            this.admins = await this.$API.institutionAdmins.getOtherAdmins()
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

.add-new-admin-button {
    border-radius: 100px 100px 100px 100px;
    width: 60px;
    height: 35px;
    font-size: 22px;
    font-weight: bold;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
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

@media screen and (max-width: $phoneWidth) {
    .new-existing-divider {
        margin-top: 3vh;
        border-bottom: black solid 0.4vh;
    }
    .admin-container {
        width: 90%;
    }
    button {
        font-size: 2.3vh;
        margin-bottom: 3vh;
        padding-bottom: 1vh;
        padding-top: 1vh;
    }
}
</style>