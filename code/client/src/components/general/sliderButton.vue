<template>
    <div>
        <p>{{ offMsg }}</p>
        <label class="switch" :aria-label="altText">
            <input type="checkbox" v-model="isToggled">
            <span 
                :class="`slider round ${untoggledColor}`" 
                @click="$emit('toggled', !isToggled)"
            ></span>
        </label>
        <p>{{ onMsg }}</p>
    </div>
</template>

<script>
export default {
    name: 'sliderButton',
    props: {
        offMsg: {
            type: String,
            required: false
        },
        onMsg: {
            type: String,
            required: false
        },
        altText: {
          type: String,
          required: false
        },
        basedOn: {
            type: Boolean,
            required: true
        },
        untoggledColor: {
            type: String,
            required: false,
            default: 'grey'
        }
    },
    data() {
        return {
            isToggled: null
        }
    },
    created() {
        this.isToggled = this.basedOn
    }
}
</script>

<style lang="scss" scoped>
p {
    display: inline-block;
    margin: 1px 2vh 0px 2vh;
    font-size: 2vh;
    font-weight: bold;
    position: relative;
    bottom: 3.4vh;
}

.switch {
  position: relative;
  display: inline-block;
  width: 10vh;
  max-width: 300px;
  height: 5.2vh;
  max-height: 170px;
  bottom: 1.5vh;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  @include is-clickable();
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-transition: .4s;
  transition: .4s;
  &.yellow {
    background-color: get-color("yellow");
  }
  &.grey {
    background-color: #ccc;
  }
}

.slider:before {
  position: absolute;
  content: "";
  height: 4vh;
  width: 4vh;
  left: 0.5vh;
  bottom: 0.6vh;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: get-color("blue");
}

input:focus + .slider {
  box-shadow: 0 0 1px get-color("blue");
}

input:checked + .slider:before {
  $translation: 4.8vh;
  -webkit-transform: translateX($translation);
  -ms-transform: translateX($translation);
  transform: translateX($translation);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>