<template>
    <div>
        <label class="switch">
            <input type="checkbox" v-model="state">
            <span class="slider round"></span>
        </label>
    </div>
</template>

<script>
export default {
    name: "sliderButton",
    props: {
        initialState: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            state: this.initialState
        }
    },
    watch: {
        state(newVal) {
            this.$emit('toggled', newVal)
        }
    }
}
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
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
  background-color: get-color("dirty-white");
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: get-color("off-white");
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: get-color("green");
}

input:focus + .slider {
  box-shadow: 0 0 1px get-color("green");
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
  @include floating-box-shadow(0.3);
}

.slider.round:before {
  border-radius: 50%;
}
</style>