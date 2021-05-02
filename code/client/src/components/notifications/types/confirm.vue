<template>
    <div class="confirm-container">
        
        <fa-icon 
            :icon="options.picture || `exclamation-triangle`"
            class="icon" 
        />

        <div class="msg-spacing">
            <p v-for="msg in options.msg.split('\n')" :key="msg">
                {{ msg }}
            </p>
        </div>

        <div v-if="options.hard" class="hard-confirmation-input-container">
            <div>
                Type <b>'{{ confirmationText }}</b>' then press '{{ confirmButtonText }}'
            </div>
            <div>
                <input type="text" v-model="userText" class="confirmation-input">
            </div>
        </div>

        <button @click="confirm()" :disabled="disableConfirmButton">
            {{ confirmButtonText }}
        </button>
        
        <button class="red" @click="reject()">
            {{ options.rejectButtonText || "No" }}
        </button>

    </div>
</template>

<script>
export default {
    name: "confirmNotification",
    props: {
        options: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            userText: ''
        }
    },
    methods: {
        confirm() {
            this.options.resolve(true)
            this.$emit('close')
        },
        reject() {
            this.options.reject(false)
            this.$emit('close')
        }
    },
    computed: {
        disableConfirmButton() {
            return this.options.hard && this.userText !== this.confirmationText
        },
        confirmationText() {
            return this.options.confirmationText || 'I am sure'
        },
        confirmButtonText() {
            return this.options.confirmButtonText || "Yes"
        }
    }
}
</script>

<style lang="scss" scoped>
img {
    min-height: 100px;
    height: 18vh;
    max-height: 150px;
    margin-top: 20px;
}

.confirm-container {
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: 375px;
}

button {
    width: 30%;
    height: 15%;
    font-size: 17px;
    margin-bottom: 30px;
    @include floating-box-shadow();
}

p {
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 0px;
    margin-bottom: 5px;
    line-height: 25px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
}

.icon {
    margin-top: 20px;
    font-size: 110px;
}

.msg-spacing {
    margin-bottom: 25px;
    margin-top: 25px;
}

.hard-confirmation-input-container {
    width: 80%;
    @include center-margin();
}

.confirmation-input {
    border: none;
    outline: none;
    border-radius: 4px;
    height: 25px;
    width: 90%;
    @include center-margin();
    margin-top: 10px;
    margin-bottom: 10px;
    color: get-color("off-white");
    background-color: get-color("grey", 1);
    &:focus {
        background-color: get-color("grey", 0.5);
    }
    position: relative;
    z-index: 0;
}

@media screen and (max-width: $phone-width) {
    
    button {
        font-size: 14px;
    }

    p {
        font-size: 12px;
        line-height: 20px;
    }
}
</style>