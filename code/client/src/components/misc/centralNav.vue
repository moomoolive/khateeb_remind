<template>
    <div>
        
        <div  v-if="navMode === 'central'">
            <div 
                v-for="(link, index) in outboundLinks" :key="index"
            >
                <button
                    v-if="utils.validAuthentication(link.auth)"
                    :class="`admin-nav silver ${link.blinking ? 'glow' : ''}`"
                    @click="outbound(link.route)"
                >
                <p>{{ utils.stringFormat(link.name) }}
                    <span class="arrow-icon">></span></p>
                </button>
            </div>
        </div>

        <div v-if="navMode === 'outbound'" class="return-to-central-container">
            <button class="back-to-central silver" @click="toCentral()">
                <p>
                    <span class="back-arrow"> < </span> 
                    Back
                </p>
            </button>
        </div>

    </div>
</template>

<script>
export default {
    name: 'centralNav',
    props: {
        outboundLinks: {
            type: Array,
            required: true
        },
        baseLink: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            buttonLinks: ['schedule', 'announcements', 'khateebs', 'settings'],
            currentRoute: this.$router.currentRoute.fullPath
        }
    },
    methods: {
        outbound(extension) {
            this.$router.push(`/${this.baseLink}/${extension}`)
        },
        toCentral() {
            this.$router.push(`/${this.baseLink}`)
            this.$emit('to-central')
        }
    },
    computed: {
        navMode() {
            if (this.currentRoute === `/${this.baseLink}`)
                return 'central'
            else
                return 'outbound'
        }
    },
    watch: {
        $route (to, from) {
            this.currentRoute = to.path
        }
    }      
}
</script>

<style lang="scss" scoped>
@keyframes glow { 
    0% { background-color: getColor("silver"); }
    50% { background-color: getColor("yellow") }
    100% { background-color: getColor("silver"); } 
}

.admin-nav {
    width: 80% !important;
    height: 7.3vh;
    max-height: 200px;
    max-width: 850px;
    padding: 10px 30px;
    @include completelyRoundBorder();
    @include floatingBoxShadow();
    color: black;

    &.glow {
        animation: glow linear 2s 11;
    }
}

p {
    margin: 0;
    text-align: left;
    font-size: 20px;
}

.arrow-icon {
    float: right;
    margin-right: 0;
    right: -5%;
}

.indicator {
    background: getColor('yellow');
    padding: 2px 2px 2px 2px;
    margin-left: 7px;
}

.return-to-central-container {
    width: 95%;
    max-width: 1100px;
    @include centerMargin();
    text-align: left;
}

.back-to-central {
    width: 100px;
    height: 40px;
    @include completelyRoundBorder();
    @include floatingBoxShadow();
    color: black;
}

@media screen and (max-width: $phoneWidth) {
      
      .admin-nav {
          width: 90% !important;
          padding: 7px 18px;
      }

      p {
          font-size: 14px;
      }

      .back-to-central {
          width: 70px;
          height: 32px;
      }
}
</style>