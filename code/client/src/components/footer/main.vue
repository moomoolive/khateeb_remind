<template>
    <div>
        <div class="topnav">
            
            <div class="footer-links-section">
                <div class="footer-links-section-header">
                    Users
                </div>
                <div class="footer-links-header-divide"></div>
                <a
                    class="green"
                    :href="feedbackURL" 
                    target="_blank"
                >
                    Feedback
                </a>
            </div>

            <div class="footer-links-section">
                <div class="footer-links-section-header">
                    Info
                </div>
                <div class="footer-links-header-divide"></div>
                
                <a 
                    class="green" 
                    @click="toUsecasePage()"
                >
                    Why Use Khateeb Remind?
                </a>

                <a 
                    class="green" 
                    @click="utils.alert(`This section is coming soon insha'Allah`)"
                >
                    Dev Tools
                </a>

                <a 
                    class="green" 
                    href="https://github.com/moomoolive/khateeb_remind"
                    target="_blank"
                >
                    Contribute to Source Code
                </a>
            </div>

        </div>

        <div class="footer-logo">
            <div>
                <img 
                    src="@/assets/logos/khateebRemindLogo.svg"
                    class="khateeb-remind-logo" 
                    alt="khateeb remind logo"
                >
            </div>
            <div class="khateeb-remind-name">
                Khateeb Remind
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Footer',
    data() {
        return {
            feedbackURL: process.env.VUE_APP_FEEDBACK_FORM_URL || '#'
        }
    },
    methods: {
        toUsecasePage() {
            if (this.$router.currentRoute.fullPath !== '/usecase')
                return this.$router.push({ path: "/usecase" })
        }
    },
    computed: {
        isLoggedIn() {
            return this.$store.getters['user/isLoggedIn']
        }
    },
}
</script>

<style lang="scss" scoped>
.topnav {
    width: 95.2vw;
    min-width: $minimumAppWidth;
    text-align: left;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: 40px;
}

a {
    position: relative;
    display: block;
    text-decoration: none;
    color: getColor("silver");
    font-size: 12px;
    margin-bottom: 5px;
    cursor: pointer;
    
    &:hover {
        color: getColor("blue") !important;
    }
    
    &.green {
        color: getColor("green");
    }
}

span {
    &:hover {
        color: getColor("blue") !important;
    }
}

.footer-links-section {
    margin-top: 15px;
    margin-left: 20px;
    margin-right: 40px;
}


.footer-links-section-header {
    font-size: 15px;
    color: getColor("blue");
    font-weight: bold;
}

.footer-links-header-divide {
    height: 2px;
    width: 5em;
    margin-top: 2px;
    margin-bottom: 8px;
    background: getColor("purple");
}

.khateeb-remind-logo {
    width: 12px;
    margin-right: 5px;
}

.khateeb-remind-name {
    font-size: 11px;
    color: getColor("offWhite");
}

.footer-logo {
    @include flexboxDefault();
    margin-bottom: 10px;
    margin-left: auto;
    width: 118px;
}

@media screen and (max-width: $phoneWidth) {
    a {
        font-size: 11px;
    }

    .footer-links-section-header {
        font-size: 13px;
        margin-right: 0px;
    }

    .footer-links-section {
        margin-bottom: 00px;
        margin-top: 10px;
        margin-left: 10px;
    }

    .topnav {
        flex-direction: column;
        justify-content: center;
        margin-bottom: 30px;
    }

    .footer-links-header-divide {
        width: 3.5em;
    }

}
</style>