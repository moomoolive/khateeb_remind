<template>
    <div class="cell-container">
        <div class="khateeb-role-label">
            Main Khateeb
        </div>
        <div class="khateeb-name-label">
            <span v-if="khateebPreferences[0].isGivingKhutbah">
                ⭐ Khateeb<br>
            </span>
            {{ khateebDisplay(khateebPreferences[0]) }}
        </div>
        <div v-show="khateebPreferences[1].khateebID" class="khateeb-role-label" @click="toggleBackupDisplay()">
           {{ showBackup ? '📖 Hide' : '📘 Show' }} Backup
        </div>
        <collapse-transition>
            <div v-show="showBackup" class="khateeb-name-label">
                <span v-if="khateebPreferences[1].isGivingKhutbah">
                    ⭐ Khateeb
                </span><br>
                {{ khateebDisplay(khateebPreferences[1]) }}
            </div>
        </collapse-transition>
    </div>
</template>

<script>
import { CollapseTransition } from "@ivanv/vue-collapse-transition"

export default {
    name: 'khateebKhateebCells',
    components: {
        CollapseTransition,
    },
    props: {
        khateebPreferences: {
            type: Array,
            required: true
        },
        khateebs: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            showBackup: false
        }
    },
    methods: {
        khateebDisplay(preference) {
            if (Object.keys(preference).length < 1 || preference.khateebID === 'none')
                return 'To Be Decided'
            return this.khateebName(this.khateebs.find(k => k._id === preference.khateebID))
        },
        khateebName(khateeb) {
            let base = `${khateeb.firstName} ${khateeb.lastName}`
            if (khateeb.title.toLowerCase() !== 'none')
                base += khateeb.title + ' '
            return base
        },
        toggleBackupDisplay() {
            this.showBackup = !this.showBackup
        }
    },
    computed: {
        
    }
}
</script>

<style lang="scss" scoped>

div {
    text-align: left;
}

.khateeb-role-label {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 16px;
}

.khateeb-name-label {
    margin-bottom: 15px;
    font-size: 15px;
}

span {
    font-size: 14px;
}

.cell-container {
    margin-top: 20px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

@media screen and (max-width: $phoneWidth) {

}

</style>