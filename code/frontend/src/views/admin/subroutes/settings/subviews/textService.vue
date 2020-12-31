<template>
    <div>
        <h2 v-if="textInfoUnavailable">
            Insufficent info to text. Please make sure that you have provided
            an administrator phone number and a valid Twillio number
        </h2>
        <h2 v-if="verificationTextSent">
            A text should arrive shortly! If it doesn't arrive in the next few minutes<br>
            try checking if the API is connected to a text provider.
        </h2>
        <img 
            :src="require('@/assets/logos/twillio.png')" 
            alt="text provider logo"
        ><br>
        <button
            @click="$emit('verification-text')"
            :disabled="textInfoUnavailable"
        >
            Test Text Service
        </button>
        <collapsable-box
            :headline="`Text Phone`"

        >
            <template v-slot:content>
                <settings-form
                    :name="`text phone number`"
                    :previousEntries="textPhoneData.previousEntries"
                    :emptySchema="textPhoneData.emptySchema"
                    :backgroundColor="`red-green`"
                    @submitted="$emit('submitted', $event)"
                />
            </template>
        </collapsable-box>
    </div>
</template>

<script>
import settingsForm from '@/components/forms/templates/settings.vue'

export default {
    name: 'textService',
    components: {
        settingsForm
    },
    props: {
        textInfoUnavailable: {
            type: Boolean,
            required: true
        },
        verificationTextSent: {
            type: Boolean,
            required: true
        },
        textPhoneData: {
            type: Object,
            required: true
        }
    },
    methods: {
        x($event) {
            console.log($event)
        }
    }
}
</script>

<style lang="scss" scoped>
img {
    height: 7vh;
}
</style>