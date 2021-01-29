<template>
    <div class="logoContainer">
        <img
          class="left"
          :src="require(`@/assets/logos/${logoLeft}.jpg`)" 
          alt="Overarching Institution Logo"
        >
        <p v-if="logoRight">+</p>
        <img
          v-if="logoRight"
          class="right"
          :src="require(`@/assets/logos/${logoRight}.jpg`)" 
          alt="Friday Prayer Provider Logo"
        >
      </div>
</template>

<script>
export default {
    name: 'logoDisplay',
    props: {
      logoLeft: {
        type: String,
        required: true
      },
      logoRight: {
        type: String,
        required: false
      }
    }
}
</script>

<style lang="scss" scoped>
@function boxPosition($left) {
    @if $left {
      @return -1;
    } @else {
      @return 1;
    }
  };
  
  @function individualBoxShadow($number, $const, $color) {
    $bShadow: 5px;
    @return themeRGBA($color, 0.35) ($const * $number * $bShadow) ($number * $bShadow)
  };
  
  @mixin boxShadow($color, $left: true) {
    $bShadow: 5px;
    $const: boxPosition($left);
    $boxList: ();
    @for $i from 1 through 5 {
      $x: individualBoxShadow($i, $const, $color);
      $boxList: append($boxList, $x, comma)
    }
  
    box-shadow: $boxList;
  };

.logoContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15vh;
}

@media screen and (max-width: $phoneWidth) {
    .logoContainer{
      flex-direction: column;
    }
}

img {
  $imgDimensions: 27vh;
  margin: 1vh 2vh 1vh 2vh;
  height: $imgDimensions;
  width: $imgDimensions;
  border: solid black 0.1vh;
  &.left {
    @include boxShadow("red");
  }
  &.right {
    @include boxShadow("red", false)
  }
}

p {
  font-size: 4.5vh;
  font-weight: bold;
  margin-top: 2vh;
}
</style>