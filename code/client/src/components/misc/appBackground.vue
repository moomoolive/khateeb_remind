<template>
    <div
        ref="container"
        class="background-container"  
    >
        <div 
            class="bubbles"
        >
            <div v-for="x in 10" :key="x" class="bubble"></div>
            <fa-icon
              v-for="icon in miscIcons"
              :key="icon.name" 
              :icon="[icon.section, icon.name]" 
              :class="`bubble misc-icon ${icon.name}`" 
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "appDefaultBackground",
    data() {
        return {
            bubbleBackgroundHeight: 800,
            miscIcons: [
              { name: "star-and-crescent", section: 'fas'},
              { name: "mosque", section: 'fas'}, 
              { name: "paper-plane", section: 'far' },
              { name: "comment-alt", section: 'fas' }
            ]
        }
    },
    methods: {
        onResize(resizeInfo={}) {
            this.bubbleBackgroundHeight = resizeInfo.detail.height
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.bubbleBackgroundHeight = this.$refs.container.clientHeight
        })
    }
}
</script>

<style lang="scss" scoped>

@keyframes rise{
  0%{
    bottom:-100px;
    transform:translateX(0);
  }
  50%{
    transform:translate(100px);
  }
  100%{
    bottom:1080px;
    transform:translateX(-200px);
  }
}

.background-container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.bubbles{
  position:absolute;
  width: 100%;
  z-index: 1;
  top:0;
  left:0;
  height: 110vh;
}

.bubble {
  position: absolute;
  bottom:-100px;
  width:40px;
  height: 40px;
  background:#f1f1f1;
  border-radius:50%;
  opacity:0.5;
  animation: rise 10s infinite ease-in;
}

.misc-icon {
  font-size: 60px;
  border-radius: 0;
  background: none;
  color: get-color("off-white");

  &.star-and-crescent {
    animation-delay:1s;
    animation-duration:15s;
    left:10%;
  }

  &.mosque {
    animation-delay:2s;
    animation-duration:11s;
    left:70%;
  }

  &.paper-plane {
    color: get-color("mint");
    animation-delay:5s;
    animation-duration:16s;
    left:50%;
  }

  &.comment-alt {
    animation-delay:8s;
    animation-duration:8s;
    left:25%;
  }
}

.crescent {
  animation-delay:1s;
  animation-duration:15s;
  left:10%;
}


.bubble:nth-child(1){
  width:40px;
  height:40px;
  left:9%;
  animation-duration:8s;
}

.bubble:nth-child(2){
  width:20px;
  height:20px;
  left:20%;
  animation-duration:5s;
  animation-delay:1s;
}

.bubble:nth-child(3){
  width:50px;
  height:50px;
  left:35%;
  animation-duration:7s;
  animation-delay:2s;
}

.bubble:nth-child(4){
  width:80px;
  height:80px;
  left:50%;
  animation-duration:11s;
  animation-delay:0s;
}

.bubble:nth-child(5){
  width:35px;
  height:35px;
  left:55%;
  animation-duration:6s;
  animation-delay:1s;
}

.bubble:nth-child(6){
  width:45px;
  height:45px;
  left:65%;
  animation-duration:8s;
  animation-delay:3s;
}

.bubble:nth-child(7){
  width:90px;
  height:90px;
  left:70%;
  animation-duration:12s;
  animation-delay:2s;
}

.bubble:nth-child(8){
  width:25px;
  height:25px;
  left:80%;
  animation-duration:6s;
  animation-delay:2s;
}

.bubble:nth-child(9){
  width:15px;
  height:15px;
  left:70%;
  animation-duration:5s;
  animation-delay:1s;
}

.bubble:nth-child(10){
  width:90px;
  height:90px;
  left:25%;
  animation-duration:10s;
  animation-delay:4s;
}

@media screen and (min-width: $large-screen-view) {
  .background-container {
    height: 90vh;
  }
}
</style>