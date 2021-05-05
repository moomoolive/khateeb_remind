<template>
    <div>
        <loading>

            <div v-if="usersWithRemovedDuplicates.length > 0" class="delegation-container">
                <div class="delegation-explanation">
                    Click the user you want to make the new root administrator
                </div>

                <div class="users-container">
                    <button
                        v-for="(user, userIndex) in usersWithRemovedDuplicates"
                        :key="userIndex"
                        :disabled="selectedUser !== 'none'"
                        class="user-container"
                        @click="delegateToUser(user)"
                    >
                        <div>
                            <div class="user-title">
                                <span class="purple">
                                    {{ user.title !== 'none' ? _utils.stringFormat(user.title) : 'No Title' }}
                                </span>
                            </div>
                            <div class="user-full-name">
                                {{ user.firstName }} {{ user.lastName }}
                            </div>
                            <div class="user-role">
                                <span class="blue">
                                    <fa-icon :icon="user.__t === 'khateeb' ? 'pray' : 'suitcase-rolling'" />
                                </span>
                                <span class="green">
                                    {{ _utils.stringFormat(user.__t) }}
                                </span>
                            </div>
                            <div class="bottom-section">

                                <div class="member-since-text">
                                    Member since
                                    <span class="blue">
                                        {{ _utils.dynamicDisplayDate(user.createdAt) }}
                                    </span>
                                </div>
                                
                                <div class="loading-icon-container">
                                    <img 
                                        src="~@/assets/gifs/loading.gif"
                                        :class="`loading-icon ${selectedUser === user._id ? '' : 'invisible'}`" 
                                        alt="loading-icon"
                                    >
                                </div>

                            </div>
                        </div>
                    </button>
                </div>

            </div>

            <general-message
                v-else
                :message="
                    `It seems you're the only confirmed user in your institution - 
                    which means there's no one else to delgate permissions to.`
                "
                iconColor="yellow"
                :fontAwesomeIcon="['far', 'paper-plane']"
            />

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import generalMessage from '@/components/misc/generalMessage.vue'

import khateebHelpers from '@/libraries/khateebs/main.js'

export default {
    name: "delgateInstitutionPermissions",
    components: {
        loading,
        generalMessage
    },
    data() {
        return {
            users: [],
            selectedUser: '',
            readyToExitInstitution: new Promise(resolve => resolve(true))
        }
    },
    methods: {
        async getAllUsers() {
            const query = { active: true, confirmed: true }
            const [khateebs, institutionAdmins] = await Promise.all([
                this._api.khateebs.getKhateebs(query),
                this._api.institutionAdmins.getOtherAdmins(query),

            ])
            this.users = [...khateebs, ...institutionAdmins]
        },
        userNameWithTitle(user={}) {
            return khateebHelpers.khateebName(user)
        },
        setSelectedUser(val="12345") {
            this.selectedUser = val
        },
        createMinimumAmountOfTimeBeforeResponse() {
            this.readyToExitInstitution = new Promise(resolve => {
                const milliseconds = 2_500
                window.setTimeout(() => resolve(true), milliseconds)
            })
        },
        async delegateToUser(user={}) {
            const firstName = user.firstName
            const confirm = await this._utils.confirm(
                `Are you sure you want to make ${firstName} the new root administrator? This means that you will no longer be able to log into this institution as a root administrator and ${firstName} will have unrestricted permissions to this institution`,
                "yellow",
                { hard: true, confirmationText: "I Understand" }
            )
            if (!confirm)
                return
            this.createMinimumAmountOfTimeBeforeResponse()
            this.setSelectedUser(user._id)
            const { code, msg } = await this._api.auth.delegatePermissions({ targetUserId: user._id })
            await this.readyToExitInstitution
            this._utils.alert(msg, code === 0 ? 'success' : 'caution')
            if (code !== 0) {
                return this.resetSelectedUser()
            } else {
                this.$store.dispatch('user/downgradeUserAuthorization')
            }
        },
        resetSelectedUser() {
            return this.setSelectedUser('none')
        }
    },
    computed: {
        usersWithRemovedDuplicates() {
            const arr = []
            const usersPassed = {}
            for (let i = 0; i < this.users.length; i++) {
                const user = this.users[i]
                const userIndex = usersPassed[user._id]
                if (user._id === this.$store.state.user.userInfo._id) {
                    continue
                } else if (userIndex) {
                    // if user is both a khateeb and institution admin
                    // only show institution admin variation
                    arr[userIndex].__t = 'institutionAdmin'
                } else {
                    arr.push(this._utils.deepCopy(user))
                    usersPassed[user._id] = i
                }
            }
            return arr
        }
    },
    created() {
        this.getAllUsers()
        this.resetSelectedUser()
    }
}
</script>

<style lang="scss" scoped>
.delegation-container {
    width: 90%;
    max-width: 1000px;
    margin-top: 40px;
    @include center-margin();
}

.delegation-explanation {
    font-size: 20px;
    margin-bottom: 25px;
    width: 85%;
    @include center-margin();
    font-weight: bold;
}

.users-container {
    @include flexbox-default(row, true);
}

.user-container {
    background: get-color('grey');
    width: 85%;
    max-width: 350px;
    color: get-color('off-white');
    @include normal-border-rounding();
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 20px;
    margin-left: 20px;
    margin-right: 20px;
    text-align: left;
    @include floating-box-shadow(0.4);

    &:hover {
        background: get-color('light-grey');
    }
}

.user-full-name {
    margin-bottom: 5px;
    font-size: 18px;
}

.user-title {
    font-size: 12px;
    margin-bottom: 2px;
}

.user-role {
    margin-bottom: 30px;
    font-size: 15px;
}

.bottom-section {
    display: flex;
}

.member-since-text {
    font-size: 13px;
    width: 70%;
}

.loading-icon-container {
    width: 30%;
    text-align: right;
    height: 0;
}

.loading-icon {
    width: 55px;
    position: relative;
    bottom: 28px;

    &.invisible {
        visibility: hidden;
    }
}

@media screen and (max-width: $phone-width) {
    .delegation-explanation {
        font-size: 17px;
    }

    .users-container {
        flex-direction: column;
    }

    .user-container {
        margin-left: 0px;
        margin-right: 0px;
    }
}
</style>