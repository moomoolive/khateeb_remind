<template>
    <div class="grey container" v-on-clickaway="close">
        
        <div class="greeting">
            Asalam Alikoum {{ $store.getters['user/allInfo'].firstName }},
        </div>

        <div class="handle">
            <span class="blue">
                @{{ $store.getters['user/allInfo'].handle }}
            </span>
        </div>
        
        <div class="institution-name">
            <span class="purple">
                {{ $store.state.user.institution.abbreviatedName }}
            </span>
        </div>

        <div class="icon-pointer">
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
            firstOpened: false
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
    },
    computed: {
        userType() {
            return this.$store.getters['user/allInfo'].__t
        },
    },
    watch: {
        showProfileDetails(newVal, oldVal) {
            if (newVal && !oldVal){
                const oneTenthOfASecondInMilliseconds = 100
                window.setTimeout(() => this.firstOpened = true, oneTenthOfASecondInMilliseconds)
            }
            else if (!newVal && oldVal)
                this.firstOpened = false
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
    @include floatingBoxShadow();
    @include normalBorderRounding();
}

.icon-pointer {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid getColor("grey");
    position: absolute;
    top: 50px;
    right: 88px;
}

.buttons-container {
    @include flexboxDefault(column);
}

.greeting {
    font-size: 15px;
    margin-bottom: 5px;
    text-align: left;
    font-weight: bold;
    color: getColor("offWhite");
}

.handle {
    font-size: 12px;
    text-align: left;
    margin-bottom: 7px;
}

button {
    width: 130px;
    font-size: 16px;
    @include floatingBoxShadow();
    background: getColor("blue");
}

.institution-name {
    font-size: 13px;
    text-align: left;
    margin-bottom: 30px;
}

@media screen and (max-width: $phoneWidth) {
    .icon-pointer {
        top: 45px;
        right: 63px;
    }
}

</style>