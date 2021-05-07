<template>
    <div class="general-message-container">
        <div class="icon-container">
            <span :class="iconColor">
                <fa-icon :icon="fontAwesomeIcon" />
            </span>
        </div>
        <div class="message-container">
            <span :class="textColor">
                {{ message }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: "generalMessage",
    props: {
        message: {
            required: true,
            type: String
        },
        fontAwesomeIcon: {
            required: true,
            type: Array
        },
        iconColor: {
            type: String,
            required: false,
            default: 'dark-red'
        },
        textColor: {
            type: String,
            required: false,
            default: 'grey'
        }
    }
}
</script>

<style lang="scss" scoped>

.general-message-container {
    width: 80%;
    max-width: 1000px;
    margin-top: 100px;
    @include center-margin();
}

.message-container {
    font-size: 23px;
}

.icon-container {
    margin-bottom: 40px;
    font-size: 90px;
}

@media screen and (max-width: $phone-width) {
    .message-container {
    
    }

    .icon-container {
    
    }
}

@media screen and (min-width: $desktop-width) {
    .message-container {
    
    }

    .icon-container {
    
    }
}
</style>