<template>
    <div>
        <div  v-if="navMode === 'central'">
            <div 
                v-for="(link, index) in outboundLinks" :key="index"
            >
                <button
                    v-if="_.validAuthentication(link.auth)"
                    class="admin-nav silver"
                    @click="outbound(link.route)"
                >
                <p>{{ _.stringFormat(link.name) }}<span v-if="link.indicator" class="indicator">{{ link.indicator }}</span> 
                    <span class="arrow-icon">></span></p>
                </button>
            </div>
        </div>
        <div v-if="navMode === 'outbound'" class="return-to-central-container">
            <button class="back-to-central silver" @click="toCentral()">
                <p>
                    <!-- this isn't a mistake, i'm litterally using a lesser sign here -->
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
.admin-nav {
    width: 80% !important;
    height: 7.3vh;
    max-height: 200px;
    max-width: 850px;
    padding: 10px 30px;
    border-radius: 100px 100px 100px 100px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    color: black;
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
    margin-left: auto;
    margin-right: auto;
    text-align: left;
}

.back-to-central {
    width: 23%;
    max-width: 110px;
    height: 5vh;
    max-height: 45px;
    border-radius: 100px 100px 100px 100px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    color: black;
}

@media screen and (max-width: $phoneWidth) {
      .admin-nav {
          width: 90% !important;
          padding: 1vh 3vh;
      }
      p {
          font-size: 2.4vh;
      }
}
</style>