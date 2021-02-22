<template>
    <div>
        <div class="admin-container">
            <collapsable-box
                :headline="`Create New Admin`"
            >
                <form-main
                    :structure="structure.new"
                    :buttonText="`Create New Admin`"
                    :bindedExts="['confirms']"
                    :backgroundColor="`none`"
                    @submitted="submitAdmin($event)"
                />
            </collapsable-box>
        </div>
        <div class="new-existing-divider"></div>
        <div v-if="admins">
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
                            <button class="red" @click="deleteAdmin(admin._id)">
                                Delete {{ admin.firstName }} from System
                            </button>
                            <form-main
                                :structure="structure.existing"
                                :basedOn="admin"
                                :buttonText="`Update ${admin.firstName}'s Info`"
                                :backgroundColor="`none`"
                                @submitted="submitAdmin($event)"
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
    </div>
</template>

<script>
import collapsableBox from '@/components/userInterface/components/collapsableBox.vue'
import formMain from '@/components/forms/main.vue'
import loading from '@/components/userInterface/components/loadingScreen.vue'

export default {
    name: 'createOtherInstitutionAdmins',
    components: {
        collapsableBox,
        formMain,
        loading
    },
    data() {
        return {
            admins: null,
            structure: {
                new: {
                    username: {
                        required: true,
                        validators: 'username'
                    },
                    password: {
                        required: true,
                        minLength: 6
                    },
                    handle: {
                        validators: 'handle',
                        required: true,
                    },
                    firstName: {
                        required: true
                    },
                    lastName: {
                        required: true
                    },
                    phoneNumber: {
                        type: 'phoneNumber',
                        required: true
                    }
                },
                existing: {
                    username: {
                        required: true,
                        type: 'readOnly'
                    },
                    handle: {
                        validators: 'handle',
                        type: 'readOnly',
                    },
                    firstName: {
                        required: true,
                        type: 'readOnly',
                    },
                    lastName: {
                        required: true,
                        type: 'readOnly'
                    },
                    phoneNumber: {
                        type: 'readOnly',
                        format: 'phoneNumber',
                        required: true
                    }
                }
            }
        }
    },
    methods: {
        async submitAdmin($event) {
            try {
                const updated = await this.$API.rootInstitutionAdmin.updateAdmin($event)
                this.$store.dispatch('adminSavedChangesScreen', true)
                this._.alert(`Make sure to let the administrator you created know their password as soon as possible! Other wise they won't be able to log in!`)
            } catch(err) {
                console.log(err)
            }
        },
        async deleteAdmin(id) {
            try {
                const confirm = await this._.confirm(`Do you really want to permenantly delete this administrator?`)
                if (confirm) {
                    const deleted = await this.$API.rootInstitutionAdmin.deleteAdmin(id)
                    console.log(deleted)
                    this.$store.dispatch('adminSavedChangesScreen', true)
                }
            } catch(err) {
                console.log(err)
            }
        }
    },
    async created() {
        this.admins = await this.$API.rootInstitutionAdmin.getOtherAdmins()
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