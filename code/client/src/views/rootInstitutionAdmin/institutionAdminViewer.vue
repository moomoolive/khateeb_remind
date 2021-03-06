<template>
    <div>
        <div class="admin-container">
            <collapsable-box
                :headline="`Create New Admin`"
            >
                <user-form-template 
                    :userType="`institutionAdmin`"
                    :includeVitals="true"
                    :formProps="{
                        buttonText: 'Create New Admin',
                        bindedExts: ['confirms'],
                        backgroundColor: 'none'
                    }"
                    @submitted="submitAdmin($event)"
                />
            </collapsable-box>
        </div>
        <div class="new-existing-divider"></div>
        <loading>
            <div v-if="admins.length > 0" class="admin-container">
                <div v-for="(admin, index) in admins" :key="index">
                    <collapsable-box
                        :headline="`${admin.firstName} ${admin.lastName}`"
                        :tagDetails="[{
                            words: `Last Active: ${_.dynamicDisplayDate(admin.lastLogin)}`,
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
                                backgroundColor: 'none'
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

export default {
    name: 'createOtherInstitutionAdmins',
    components: {
        collapsableBox,
        loading,
        msgWithPic,
        userFormTemplate
    },
    data() {
        return {
            admins: []
        }
    },
    methods: {
        async submitAdmin($event) {
            try {
                const newAdmin = await this.$API.institutionAdmins.createNewAdmin($event)
                this.admins.push(newAdmin)
                this._.alert(`Make sure to let the administrator you created know their password as soon as possible! Other wise they won't be able to log in!`)
            } catch(err) {
                console.log(err)
            }
        },
        async deleteAdmin(id, index) {
            try {
                const confirm = await this._.confirm(`Do you really want to permenantly delete this administrator?`)
                if (confirm) {
                    const deleted = await this.$API.institutionAdmins.deleteAdmin(id)
                    console.log(deleted)
                    this.admins.splice(index, 1)
                }
            } catch(err) {
                console.log(err)
            }
        },
        async getOtherAdmins() {
            try {
                const admins = await this.$API.institutionAdmins.getOtherAdmins()
                this.admins = admins || []
            } catch(err) {
                console.log(err)
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