<template>
    <div class="grey container" v-on-clickaway="close">
        
        <div class="greeting">
            Asalam Alikoum {{ $store.state.user.userInfo.firstName }},
        </div>

        <div class="handle">
            <span class="blue">
                @{{ $store.state.user.userInfo.handle }}
            </span>
        </div>
        
        <div v-if="!isLoggedInAsGenericUser" class="institution-name">
            <span class="purple">
                {{ $store.state.user.institution.abbreviatedName }}
            </span>
        </div>

        <div :class="`institution-photo-container ${showInstitutionLogo ? '' : 'invisible'}`">
            <img 
                :src="imageSrc"
                class="institution-logo-frame" 
                alt="institution logo"
            >
        </div>

        <div class="buttons-container">

            <div>
                <button  @click="redirect('/user')">
                    Profile
                </button>
            </div>

            <div>
                <button @click="redirect('/notification-subscriptions')">
                    Notifications
                </button>
            </div>

            <div v-if="userType === 'khateeb'">
                <button @click="redirect('/khateeb/availability')">
                    Availability
                </button>
            </div>

        </div>
    </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

export default {
    name: "profileOptions",
    mixins: [clickaway],
    props: {
        showProfileDetails: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            firstOpened: false,
            imageSrc: require('@/assets/logos/genericInstitution.png')
        }
    },
    methods: {
        close() {
            if (this.showProfileDetails && this.firstOpened)
                this.$emit('close')
        },
        redirect(path) {
            this.$emit('redirect', path)
        },
        async getInstitutionLogo() {
            if (this.$store.state.user.institution._id === 'root')
                return
            else
                return this.imageSrc = await this._api.logos.getInstitutionLogo(
                    { institutionID: this.$store.state.user.institution._id }
                )
        },
        fetchInstitutionLogo() {
            const oneSecondInMilliseconds = 1_000
            return window.setTimeout(() => this.getInstitutionLogo(), oneSecondInMilliseconds)
        }
    },
    computed: {
        userType() {
            return this.$store.getters['user/type']
        },
        showInstitutionLogo() {
            return this.imageSrc !== require('@/assets/logos/genericInstitution.png') && !this.isLoggedInAsGenericUser
        },
        isLoggedInAsGenericUser() {
            return this.$store.getters['user/isLoggedInAsGenericUser']
        }
    },
    watch: {
        showProfileDetails(newVal, oldVal) {
            if (newVal && !oldVal){
                const oneTenthOfASecondInMilliseconds = 100
                window.setTimeout(() => this.firstOpened = true, oneTenthOfASecondInMilliseconds)
            }
            else if (!newVal && oldVal)
                this.firstOpened = false
        },
        isLoggedInAsGenericUser(newVal, oldVal) {
            if (!newVal && oldVal)
                return this.fetchInstitutionLogo()
        }
    },
    mounted() {
        if (!this.isLoggedInAsGenericUser) {
            this.$nextTick(() => this.fetchInstitutionLogo())
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    padding-left: 25px;
    padding-right: 25px;
    padding-bottom: 25px;
    padding-top: 25px;
    @include floating-box-shadow();
    @include normal-border-rounding();
    @include alternate-font();
}

.buttons-container {
    @include flexbox-default(column);
}

.greeting {
    font-size: 15px;
    margin-bottom: 5px;
    text-align: left;
    font-weight: bold;
    color: get-color("off-white");
}

.handle {
    font-size: 12px;
    text-align: left;
    margin-bottom: 7px;
}

button {
    width: 130px;
    font-size: 16px;
    @include floating-box-shadow();
    background: get-color("blue");
}

.institution-name {
    font-size: 13px;
    text-align: left;
}

.institution-photo-container {
    display: flex;
    justify-content: flex-end;
    position: relative;
    bottom: 30px;

    &.invisible {
        visibility: hidden;
    }
}

.institution-logo-frame {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    border: get-color("blue") solid 2px;
}

@media screen and (max-width: $phone-width) {
    
}

</style>