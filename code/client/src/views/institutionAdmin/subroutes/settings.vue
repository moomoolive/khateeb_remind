<template>
    <div v-if="showSettings" class="settings-container">
        <collapsable-box
            class="setting-container"
            :headline="`Institution Details`"
            :tagDetails="institution ? [{
                words: `${institution.timezone} Timezone`,
                color: 'goodNews',
                symbol: '🌎' 
            }] : null"
        >
            <institution-form-template 
                v-if="institution"
                :formProps="{
                    basedOn: institution,
                    bindedExts: ['states'],
                    backgroundColor: 'none',
                    buttonText: 'Update Institution'
                }"
                @submitted="saveInstitutionDetails($event)"
            />
        </collapsable-box>
        <collapsable-box
            class="setting-container"
            :headline="`Registration Settings`"
            :tagDetails="institution && institution.settings ? [{
                words: institution.settings.autoConfirmRegistration ? `Auto-Confirm` : `Manual-Confirm`,
                color: 'default',
                symbol: institution.settings.autoConfirmRegistration ? `🤖` : `📜`
            }] : null"
        >
            <form-main
                v-if="institution && institution.settings" 
                :structure="{
                    autoConfirmRegistration: {
                        type: 'checkbox',
                        required: true
                    }
                }"
                :backgroundColor="`none`"
                :basedOn="institution.settings"
                @submitted="saveInstitutionDetails({ _id: institution._id, settings: $event })"
            />
        </collapsable-box>
        <collapsable-box
            v-if="utils.validAuthentication(3)"
            class="setting-container"
            :headline="`Danger Zone`"
            :buttonColor="`red`"
            :bodyColor="`silver`"
        >
            <button class="yellow delete-institution" @click="deleteInstitution()">
                Delete Institution
            </button>
        </collapsable-box>
    </div>
</template>

<script>
import collapsableBox from '@/components/general/collapsableBox.vue'
import formMain from '@/components/forms/main.vue'
import institutionFormTemplate from '@/components/forms/templates/institution.vue'

export default {
    name: "settings",
    components: {
        collapsableBox,
        formMain,
        institutionFormTemplate
    },
    data() {
        return {
            institution: null,
            showSettings: true
        }
    },
    methods: {
        async getSettingsAndInstitutionInfo() {
            try {
                this.institution = await this.$API.institutions.getInstitution()
            } catch(err) {
                console.log(err)
            }
        },
        async saveInstitutionDetails(newChanges={}) {
            try {
                const updatedInstitution = await this.$API.institutions.updateInstitution(newChanges)
                this.institution = updatedInstitution || this.institution
                this.rerenderSettings()
            } catch(err) {
                console.log(err)
            }
        },
        async deleteInstitution() {
            const confirm = await this.utils.confirm(`Are you sure you want to delete your institution? All jummahs, khateebs, and institution admins will be deleted as well.`)
            if (confirm) {
                try {
                    await this.$API.institutions.deleteInstitution()
                    this.utils.alert(`You've successfully deleted your institution`, 'success')
                    this.$router.push('/')
                    this.$store.dispatch('logout')
                } catch(err) {
                    console.log(err)
                }
            }
        },
        rerenderSettings() {
            this.showSettings = false
            this.$nextTick(() => { this.showSettings = true })
        }
    },
    async created() {
        this.getSettingsAndInstitutionInfo()
    }
}
</script>

<style lang="scss" scoped>
.settings-container {
    display: flex;
    flex-direction: row;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    justify-content: center;
    max-width: 1300px;
    flex-wrap: wrap;
}

.setting-container {
    width: 40%;
    max-height: 1500px;
}

.delete-institution {
    width: 80%;
    height: 6vh;
    max-height: 60px;
    font-size: 20px;
    color: red;
}

@media screen and (max-width: $phoneWidth) {
    
    .settings-container {
        flex-direction: column;
    }

    .setting-container {
        width: 100%;
    }

    .delete-institution {
        font-size: 3vh;
    }
}
</style>