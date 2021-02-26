<template>
    <div class="container">
        <div 
            v-if="clicked"
            class="popup"
        >
            <slot></slot>
        </div>
        <button 
            :class="color"
            @click="clicked = !clicked"
        >
            <p>{{ icon }}</p>
        </button>
    </div>
</template>

<script>
export default {
    name: 'infoPopup',
    props: {
        color: {
            type: String,
            required: false,
            default: 'silver'
        },
        icon: {
            type: String,
            required: false,
            default: 'i'
        }
    },
    data() {
        return {
            clicked: false
        }
    },
}
</script>

<style lang="scss" scoped>
button {
    $size: 3vh;
    height: $size;
    width: $size;
    border-radius: 50%;
    padding: 0;
    &:focus {
        animation: 0 !important;
    }
}

p {
    font-size: 1.5vh;
    color: black;
    padding: 0;
    margin: 0;
}

.popup {
    background-color: getColor('silver');
    border-radius: 3px;
    padding: 1vh;
    font-size: 2vh;
    z-index: 3;
    position: relative;
}

.container {
    width: 30vh;
    margin-left: auto;
    margin-right: auto;
    z-index: 0;
    position: relative;
}
</style>