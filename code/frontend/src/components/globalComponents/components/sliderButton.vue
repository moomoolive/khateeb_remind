<template>
    <div style="margin-top: 2vh;">
        <p style="display: inline-block;">{{ leftMessage }}</p>
        <label class="switch" :aria-label="altText">
            <input type="checkbox">
            <span class="slider round" @click="$emit('slider-toggled')"></span>
        </label>
        <p style="display: inline-block;">{{ rightMessage }}</p>
    </div>
</template>

<script>
export default {
    name: 'sliderButton',
    props: {
        leftMessage: {
            type: String,
            required: false
        },
        rightMessage: {
            type: String,
            required: false
        },
        altText: {
          type: String,
          required: false
        }
    }
}
</script>

<style>
p {
    display: inline-block;
    margin: 1px 10px 0px 10px;
    font-size: 15px;
    font-weight: bold;
}

/* ---------------------------------------------------------------------- */
/* All styling for button was taken from W3Schools */
/* from this link >> https://www.w3schools.com/howto/howto_css_switch.asp */
/* ---------------------------------------------------------------------- */

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  bottom: 7px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #F3C620;
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
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>