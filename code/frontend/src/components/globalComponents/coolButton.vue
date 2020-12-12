<template>
    <div>
        <button 
            :class="`btn ` + color" 
            :disabled='isDisabled'
            @click="clicked()"
        >
            {{ buttonText }}
        </button>
    </div>
</template>

<script>
export default {
    name: 'coolButton',
    props: {
        buttonText: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: false
        },
        isDisabled: {
            type: Boolean,
            required: false
        }
    },
    methods: {
        clicked() {
            this.$emit('pushed')
        }
    }

}
</script>

<style lang='scss' scoped>
.btn {
    background-color: $green;
    border: none;
    border-radius: 4px;
    color: white;
    padding: 1vh 2vh;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 2vh;
    transition-duration: 0.4s;
    outline: none;
    &:hover{
      background-color: white !important;
      color: black !important;
      border: 0.1vh solid $green;
    }
    &.grey {
      background-color: $grey;
      &:hover { border: 0.1vh solid $grey;}
    }
    &.yellow {
      background-color: $yellow;
      &:hover {
        border: 0.1vh solid $yellow;
      }
    }
    &.blue {
      background-color: $blue;
      &:hover {
        border: 0.1vh solid $blue;
      }
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    &:focus {
      animation: blinking 2s infinite;
      @keyframes blinking {
        0%		{ opacity: 1;}
        50%		{ opacity: 0.5;}
        100%	{ opacity: 1;}
      }
    }
}
</style>