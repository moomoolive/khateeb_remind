<template>
    <div>
        <select
            v-model="currentlyEditing" 
            @change="changeAnnouncement($event.target.value)"
        >
            <option value="new">New Announcement</option>
            <option
                v-for="(announcement, index) in announcements"
                :key="index"
                :value="index"
            >
                {{ previousEntriesNaming(announcement)  }}
            </option>
        </select><br>
        <button 
            v-show="currentlyEditingData" 
            class="red"
            @click="deleteAnnouncement()"
        >
            Delete this Announcement
        </button>
        <form-main
            v-if="showForm"
            :basedOn="currentlyEditingData"
            :structure="structure"
            @submitted="submit($event)"
            :formTitle="`Announcements`"
        />
    </div>
</template>

<script>
import formMain from '@/components/forms/main.vue'

export default {
    name: 'announcements',
    components: {
        formMain
    },
    data() {
        return {
            structure: {
                headline: {
                    required: true
                },
                content: {
                    type: 'textArea',
                    required: true
                },
                important: {
                    type: 'checkbox',
                    required: true,
                    default: false
                },
                urgent: {
                    type: 'checkbox',
                    required: true,
                    default: false
                }
            },
            announcements: [],
            currentlyEditing: 'new',
            showForm: true
        }
    },
    methods: {
        async submit($event) {
            try {
                const msg = await this.$API.institutionAdmin.updateAnnouncements($event)
                this.$store.dispatch('adminSavedChangesScreen', true)
            } catch(err) {
                console.log(err)
            }
        },
        async getAnnouncements() {
            try {
                this.announcements = await this.$API.institutionAdmin.getAnnouncements()
            } catch(err) {
                console.log(err)
            }
        },
        changeAnnouncement($event) {
            this.currentlyEditing = $event
            this.showForm = false
            this.$nextTick(() => { this.showForm = true })
        },
        async deleteAnnouncement() {
            try {
                const response = await this.$API.institutionAdmin.deleteAnnouncement({ _id: this.currentlyEditingData._id })
                this.$store.dispatch('adminSavedChangesScreen', true)
            } catch(err) {
                console.log(err)
            }
        },
        previousEntriesNaming(data) {
            const headline = data.headline
            const date = new Date(data.createdAt)
            const month = date.toLocaleString('default', { month: 'short' })
            return `${month} ${date.getDate()} ${date.getFullYear()} || ${headline}`
        }
    },
    computed: {
        currentlyEditingData() {
            if (this.currentlyEditing === 'new')
                return null
            else {
                const copy = this._.deepCopy(this.announcements[this.currentlyEditing])
                delete copy.__v; delete copy.createdAt; delete copy.updatedAt;
                return copy
            }
        }
    },
    created() {
        this.getAnnouncements()
    }
}
</script>

<style lang="scss" scoped>
select {
    border: none;
    outline: none;
    border-radius: 4px;
    height: 6vh;
    width: 80%;
    max-height: 50px;
    max-width: 510px;
    color: getColor("offWhite");
    font-size: 15px;
    background-color: themeRGBA("grey", 1);
    &:focus {
        background-color: themeRGBA("grey", 0.5);
    }
    position: relative;
    z-index: 0;
}

button {
    width: 80%;
    max-width: 510px;
    height: 4vh;
    max-height: 35px;
    font-size: 16px;
}

@media screen and (max-width: $phoneWidth) {
      select {
          font-size: 1.8vh;
      }
      button {
          font-size: 2vh;
      }
}
</style>