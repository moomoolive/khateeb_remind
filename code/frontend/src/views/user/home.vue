<template>
    <div>
        <collapsable-box
            class="user-setting"
            :headline="`Change Username`"
        >
            <form-main 
                :structure="structure.username"
                :backgroundColor="`none`"
                :basedOn="{ username: $store.getters.decodedJWT.username }"
                :buttonText="`Change Username`"
                @submitted="changeUsername($event)"
            />
        </collapsable-box>
        <collapsable-box
            class="user-setting"
            :headline="`Change Password`"
        >
            <form-main
                :structure="structure.password"
                :bindedExts="['confirms']"
                :backgroundColor="`none`"
                :buttonText="`Change Password`"
                @submitted="changePassword($event)"
            />
        </collapsable-box>
        <collapsable-box
            class="user-setting"
            :headline="`Profile Details`"
        >
            <form-main
                :structure="structure.profile"
                :basedOn="$store.getters.decodedJWT"
                :backgroundColor="`none`"
                :buttonText="`Update Profile`"
                @submitted="updateProfile($event)"
            />
        </collapsable-box>
    </div>
</template>

<script>
import collapsableBox from '@/components/userInterface/components/collapsableBox.vue'
import formMain from '@/components/forms/main.vue'

import axios from 'axios'

export default {
    name: 'userHome',
    components: {
        collapsableBox,
        formMain
    },
    data() {
        return {
            structure: {
                password: {
                    password: {
                        required: true,
                        minLength: 6
                    }
                },
                username: {
                    username: {
                        required: true,
                        validators: 'username'
                    },
                },
                profile: {
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
                }
            },
            khateebExtras: {
                title: {
                    type: "dropdown",
                    required: true,
                    selectOptions: ['none', 'Shiekh', 'Imam']
                },
                //available times
            }
        }
    },
    methods: {
        async changePassword($event) {
            try {
                const res = await this.$API.user.changePassword($event)
                this._.alert(`Successfully changed password`, 'success')
                this._.toHomePage()
            } catch(err) {
                console.log(err)
            }
        },
        async changeUsername($event) {
            try {
                const res = await this.$API.user.changeUsername($event)
                this.storeToken(res.token)
                this._.alert(`Successfully changed username`, 'success')
                this._.toHomePage()
            } catch(err) {
                console.log(err)
            }
        },
        async updateProfile($event) {
            try {
                const updated = {
                    firstName: $event.firstName,
                    lastName: $event.lastName,
                    phoneNumber: $event.phoneNumber,
                    handle: $event.handle
                }
                const res = await this.$API.user.changeProfile(updated)
                this.storeToken(res.token)
                this._.alert(`Successfully updated profile`, 'success')
                this._.toHomePage()
            } catch(err) {
                console.log(err)
            }
        },
        storeToken(token) {
            localStorage.setItem('token', token)
            axios.defaults.headers.common['authorization'] = token
            this.$store.dispatch('JWT_TOKEN', token)
        }
    },
    created() {
        if (this.$store.getters.decodedJWT.__t == 'khateeb')
            this.structure.profile = { ...this.structure.profile, ...this.khateebExtras }
    }
}
</script>

<style lang="scss" scoped>
.user-setting {
    width: 80%;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    max-height: 1500px;
}
</style>