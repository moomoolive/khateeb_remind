<template>
    <div>
        <div class="content-container">
            <div class="main-photo-section">
                
                <div class="main-caption-container">
                    <div class="main-caption-header">
                        Khateeb Scheduling. <br>
                        Automated.
                    </div>
                    <div class="main-caption-description">
                        Focus on the things that actually matter, 
                        let Khateeb Remind take care of the rest.
                    </div>
                    <div class="main-caption-description extra-space">
                        Khateeb Remind automates khateeb scheduling and reminders,
                        so you can focus on:
                        <br><br>
                            <span class="main-caption-bullet-points">
                                >
                               <span class="green">Training your khateebs</span>
                            </span>
                        <br><br>
                            <span class="main-caption-bullet-points">
                                > 
                               <span class="blue">Creating great khutabhs</span>
                            </span>
                        
                        <br><br><span class="main-caption-bullet-points">
                            > 
                            <span class="purple">
                                Spreading the deen of Allah effectively
                            </span>
                        </span>
                    </div>
                    <div class="signup-button-container">
                        <button 
                            class="blue signup-button" 
                            @click="$router.push({ path: '/create/user' })"
                        >
                            Sign Me Up
                        </button>
                        <div class="signup-button-caption">
                            * <i><span class="purple">Free</span>, <span class="green">Forever</span> (insha'Allah)</i>
                        </div>
                    </div>
                </div>

                <div class="main-photo-frame">
                    <fa-icon icon="mosque" class="main-photo" />
                </div>

            </div>

            <div class="main-section-division"></div>

            <div class="icons-container">
                
                <div class="icon-container">
                    <a href="#notifications">
                        <fa-icon icon="mobile" class="short-description-icon"/>
                        <div class="icons-heading">
                            Notify
                        </div>
                        <div class="icons-subheading">
                            Send khutbah-related updates to your khateebs' phone, laptop, or tablet <br><br>
                        </div>
                    </a>
                </div>

                <div class="icon-container">
                    <a href="#scheduling">
                        <fa-icon icon="clock" class="short-description-icon" />
                        <div class="icons-heading">
                            Schedule
                        </div>
                        <div class="icons-subheading">
                            Set default khateebs and automate your khateeb scheduling
                        </div>
                    </a>
                </div>

                <div class="icon-container">
                    <a href="#centralize">
                        <fa-icon icon="database" class="short-description-icon" />
                        <div class="icons-heading">
                            Centralize
                        </div>
                        <div class="icons-subheading">
                            All your khateebs' unavailable dates, timings, and the
                            rest of your khutbah information in one spot
                        </div>
                    </a>
                </div>

            </div>

            <div class="main-section-division"></div>

            <div>

                <div class="all-long-explanations-container">
                    <div class="long-explanation-container" id="notifications">
                        <div class="long-explanation-icon-container">
                            <fa-icon icon="comment-alt" class="long-description-icon" />
                        </div>
                        <div class="long-explanation-text-container">
                            <div class="long-explanation-header">
                                Your Khateebs Reminded <span class="green">Automatically</span>
                            </div>
                            <div>
                                You can configure Khateeb Remind to send weekly notifications
                                to your khateebs' at whatever time works for your
                                institution. Notifications are sent to devices
                                and khateebs will be reminded about their khutbahs if they log in.
                            </div>
                        </div>
                    </div>

                    <div class="long-explanation-container alternate" id="scheduling">
                        <div class="long-explanation-text-container">
                            <div class="long-explanation-header">
                                <span class="green">99%</span> of Scheduling Done For You
                            </div>
                            <div>
                                Maybe 99% is an exaggeration but, 
                                with Khateeb Remind you can set default khateebs for specific
                                 timings - so you won't have to figure out your schedule
                                every week. You'll also be alerted about which khateebs cannot make
                                it on certain dates and which ones are available for specific timings.
                            </div>
                        </div>
                        <div class="long-explanation-icon-container">
                            <fa-icon icon="calendar-alt" class="long-description-icon" />
                        </div>
                    </div>

                    <div class="long-explanation-container" id="centralize">
                        <div class="long-explanation-icon-container">
                            <fa-icon icon="cloud-upload-alt" class="long-description-icon" />
                        </div>
                        <div class="long-explanation-text-container">
                            <div class="long-explanation-header">
                                Look in <span class="green">One</span> Place for Khutbah Information
                            </div>
                            <div>
                                No more having your khateebs' schedules, prayer timings, 
                                and the rest of your khutbah-related information in multiple places.
                                Khateeb Remind stores them in the cloud so that everyone in your
                                 institution has to only look in one spot for khutbah information.
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <button class="purple signup-button last-button" @click="$router.push({ path: '/create/user' })">
                        I'm Ready to Sign Up
                    </button>
                    <div class="signup-button-caption">
                       <i>It's <span class="green">Free</span> - <span class="blue">Forever</span> (insha'Allah)</i>
                    </div>
                </div>

            </div>

            <div class="main-section-division"></div>

            <div>
                <div class="other-features-header">
                    Other Features
                </div>

                <div class="other-features-container">

                    <div class="icon-container">
                        <fa-icon icon="cloud-download-alt" class="other-features-icon" />
                        <div class="icons-heading">
                            Downloadable
                        </div>
                        <div class="icons-subheading">
                            Khateeb Remind can be downloaded
                            like an app - to your phone, tablet, or computer.
                        </div>
                    </div>

                    <div class="icon-container">
                        <fa-icon icon="camera" class="other-features-icon" />
                        <div class="icons-heading">
                            Simple Interface
                        </div>
                        <div class="icons-subheading">
                            The app is designed to be simple, uncluttered, and straightforward to use.
                        </div>
                    </div>

                    <div class="icon-container">
                        <fa-icon icon="clipboard-check" class="other-features-icon" />
                        <div class="icons-heading">
                            Practical
                        </div>
                        <div class="icons-subheading">
                            Originally created by khateeb schedulers at the University 
                            of Calgary for practical use.
                        </div>
                    </div>

                    <div class="icon-container">
                        <fa-icon :icon="['fab', 'linux']" class="other-features-icon" />
                        <div class="icons-heading">
                            Open-Source
                        </div>
                        <div class="icons-subheading">
                            Khateeb Remind's source code is readily 
                            available to the public. Meaning you can contribute
                            to the project, create your own instance, and see exactly
                            what information we keep on users.
                            <br><br>
                            <a href="https://github.com/moomoolive/khateeb_remind" target="_blank">
                                <span class="icons-subheading-warning green">
                                     Click Here to View Source Code
                                </span>
                            </a>
                        </div>
                    </div>

                </div>

                <div>
                    <button class="green signup-button last-button" @click="$router.push({ path: '/create/user' })">
                        I Want to Sign Up
                    </button>
                    <div class="signup-button-caption">
                       <i>Did we mention that it's <span class="blue">Free</span>, <span class="purple">Forever</span> (insha'Allah)?</i>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: "khateebRemindUsecase"
}
</script>

<style lang="scss" scoped>
.content-container {
    width: 80vw;
    max-width: 1100px;
    @include center-margin();
    background: get-color("silver");
    margin-top: 40px;
    padding-top: 20px;
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 20px;
    @include normal-border-rounding();
    @include floating-box-shadow();
}

.main-photo-section {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}

.main-photo-frame {
    width: 50%;
    margin-top: 30px;
    @include flexbox-default();
}

.main-caption-container {
    width: 50%;
}

.main-caption-description {
    font-size: 25px;
    text-align: left;
    margin-top: 10px;

    &.extra-space {
        margin-top: 30px;
    }
}

.main-caption-bullet-points {
    font-size: 19px;
    margin-left: 15px;
}

.main-caption-header {
    font-size: 37px;
    font-weight: bold;
    text-align: left;
}

.main-photo {
    width: 90%;
    height: 90%;
    max-width: 400px;
}

.main-section-division {
    width: 100%;
    border-bottom: get-color("grey") solid 5px;
    margin-top: 50px;
    margin-bottom: 50px;
    @include center-margin();
}

.signup-button-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    text-align: left;
    margin-top: 30px;
}

.signup-button {
    font-size: 18px;
    padding-top: 15px;
    padding-bottom: 15px;
    @include floating-box-shadow(0.30);

    &.last-button {
        width: 70%;
        max-width: 300px;
    }
}

.signup-button-caption {
    margin-top: 5px;
    font-size: 14px;
}

.icons-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: flex-start;
}

.icon-container {
    width: 33%;
    margin-bottom: 30px;
}

.short-description-icon {
    font-size: 50px;
}

.long-description-icon {
    font-size: 110px;
}

.other-features-icon {
    font-size: 70px;
}

.icon-image {
    width: 50%;
    height: 50%;
    max-width: 120px;
    
    &.short-description {
        font-size: 20px;
    }
}

.icons-heading {
    font-size: 17px;
    margin-top: 15px;
    font-weight: bold;
}

.icons-subheading {
    font-size: 14px;
    margin-top: 7px;
    width: 90%;
    @include center-margin();
}

.icons-subheading-warning {
    font-size: 11px;
}

.long-explanation-container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 70px;
}

.long-explanation-icon-container {
    width: 30%;
}

.long-explanation-text-container {
    width: 60%;
    margin-left: 5%;
    text-align: left;
}

.long-explanation-header {
    font-size: 23px;
    font-weight: bold;
    margin-bottom: 10px;
}

a {
    text-decoration: none;
    color: get-color("grey");
}

.all-long-explanations-container {
    margin-bottom: 70px;
    margin-top: 70px;
}

.other-features-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: 50px;
}

.other-features-header {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 50px;
}

@media screen and (max-width: $phone-width) {

    .long-explanation-header {
        font-size: 19px;
    }
    
    .long-explanation-container {
        flex-direction: column;

        &.alternate {
            flex-direction: column-reverse;
        }
    }
    
    .long-explanation-icon-container, .long-explanation-text-container {
        width: 100%;
    }

    .long-explanation-text-container{
        margin-left: 0;
        margin-top: 30px;
    }
    
    .icons-container {
        flex-direction: column;
    }

    .icon-container {
        width: 100%;
    }
    
    .main-photo-section {
        flex-direction: column-reverse;
        justify-content: center;
        align-items: center;
    }

    .content-container {
        padding-left: 20px;
        padding-right: 20px;
    }

    .main-photo-frame {
        width: 90%;
        margin-bottom: 30px;
    }

    .main-caption-header {
        font-size: 25px;
    }

    .main-caption-container {
        width: 90%;
    }

    .main-caption-description {
        font-size: 19px;
        margin-top: 7px;
    }

    .signup-button {
        font-size: 14px;
    }

    .signup-button-caption {
        font-size: 12px;
    }

    .main-caption-bullet-points {
        font-size: 15px;
    }
}
</style>