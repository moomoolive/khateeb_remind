<template>
    <div class="cell-container">
        
        <div class="khateeb-role-label">
            Main Khateeb
        </div>
        <div class="khateeb-name-label">
            {{ khateebDisplay(khateebPreferences[0]) }}
        </div>
        <div 
            v-if="khateebPreferences[0].isGivingKhutbah && khateebPreferences[0].khateebID !== 'none'"
            class="is-giving-khutbah-indicator"
        >
            <span class="green">
                📢 {{ currentWeek === 'past' ? 'Gave' : "Is Giving" }} Khutbah
            </span>
        </div>

        <div v-show="khateebPreferences[1].khateebID" class="khateeb-role-label" @click="toggleBackupDisplay()">
           <span>
                <img 
                    src="~@/assets/misc/rightArrow.png" 
                    :class="`show-backup-arrow ${showBackup ? 'showing' : ''}`"
                    alt="right arrow"
                >
           </span>
           Backup
        </div>
        <collapse-transition>
            <div v-show="showBackup" class="khateeb-name-label">
                {{ khateebDisplay(khateebPreferences[1]) }}
            </div>
            <div 
                v-if="khateebPreferences[1].isGivingKhutbah && khateebPreferences[1].khateebID !== 'none'"
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
            if (Object.keys(preference).length < 1 || preference.khateebID === 'none')
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
}

.khateeb-name-label {
    font-size: 16px;
}

.show-backup-arrow {
    height: 12px;
    margin-right: 5px;
    &.showing {
        transform: rotate(90deg);
    }
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

@media screen and (max-width: $phoneWidth) {
    .is-giving-khutbah-indicator {
        font-size: 12px;
    }

    .khateeb-name-label {
        font-size: 15px;
    }
}

</style>