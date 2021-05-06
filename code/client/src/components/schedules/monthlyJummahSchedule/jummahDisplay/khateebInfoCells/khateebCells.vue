<template>
    <div class="cell-container">
        
        <div class="khateeb-role-label">
            Main Khateeb
        </div>
        <div class="khateeb-name-label">
            {{ khateebDisplay(khateebPreferences[0]) }}
        </div>
        <div 
            v-if="khateebPreferences[0].isGivingKhutbah && khateebPreferences[0].khateebID !== _config.nullId"
            class="is-giving-khutbah-indicator"
        >
            <span class="green">
                📢 {{ currentWeek === 'past' ? 'Gave' : "Is Giving" }} Khutbah
            </span>
        </div>

        <div v-show="khateebPreferences[1].khateebID" class="khateeb-role-label" @click="toggleBackupDisplay()">
            <div>
                <dropdown-arrow 
                    :fontSize="12"
                    :faceDown="showBackup"
                    class="show-backup-arrow"
                />
            </div>
            <div>
                Backup
            </div>
        </div>
        <collapse-transition>
            <div v-show="showBackup" class="khateeb-name-label">
                {{ khateebDisplay(khateebPreferences[1]) }}
            </div>
            <div 
                v-if="khateebPreferences[1].isGivingKhutbah && khateebPreferences[1].khateebID !== _config.nullId"
                class="is-giving-khutbah-indicator" 
            >
                <span class="green">
                    📢 {{ currentWeek === 'past' ? 'Gave' : "Is Giving" }} Khutbah
                </span>
            </div>
        </collapse-transition>

    </div>
</template>

<script>
import { CollapseTransition } from "@ivanv/vue-collapse-transition"

import khateebHelpers from '@/libraries/khateebs/main.js'

import dropdownArrow from '@/components/misc/dropdownArrow.vue'

export default {
    name: 'khateebKhateebCells',
    components: {
        CollapseTransition,
        dropdownArrow
    },
    props: {
        khateebPreferences: {
            type: Array,
            required: true
        },
        khateebs: {
            type: Array,
            required: true
        },
        currentWeek: {
            required: true,
            type: String
        },
    },
    data() {
        return {
            showBackup: false
        }
    },
    methods: {
        khateebDisplay(preference) {
            if (Object.keys(preference).length < 1 || preference.khateebID === this._config.nullId)
                return 'To Be Decided'
            const name = this.khateebName(this.khateebs.find(k => k._id === preference.khateebID))
            return `${name}${preference.khateebID === this.$store.state.user.userInfo._id ? ' (You)' : ''}`
        },
        khateebName(khateeb) {
            return khateebHelpers.khateebName(khateeb)
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
    margin-top: 5px;
    font-size: 17px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.khateeb-name-label {
    font-size: 16px;
}

.show-backup-arrow {
    margin-right: 5px;
}

.cell-container {
    margin-top: 20px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

.is-giving-khutbah-indicator {
    font-size: 13px;
    margin-top: 5px;
    margin-bottom: 15px;
}

@media screen and (max-width: $phone-width) {
    .is-giving-khutbah-indicator {
        font-size: 12px;
    }

    .khateeb-name-label {
        font-size: 15px;
    }
}

</style>