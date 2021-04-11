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
                            @click="$router.push({ path: '/create/institutions' })"
                        >
                            Sign Up Your Institution
                        </button>
                        <div class="signup-button-caption">
                            * <i><span class="purple">Free</span>, <span class="green">Forever</span> (insha'Allah)</i>
                        </div>
                    </div>
                </div>

                <div class="main-photo-frame">
                    <img 
                        src="@/assets/notifications/khateebs.png"
                        class="main-photo" 
                        alt="masjid"
                    >
                </div>

            </div>

            <div class="main-section-division"></div>

            <div class="icons-container">
                
                <div class="icon-container">
                    <a href="#notifications">
                        <img 
                            src="@/assets/usecase/mobile.png" 
                            class="icon-image"
                            alt="mobile"
                        >
                        <div class="icons-heading">
                            Notifications
                        </div>
                        <div class="icons-subheading">
                            Send khutbah and khateeb updates to your khateebs' laptop, phone, or tablet <br><br>
                            <span class="icons-subheading-warning red">
                                * Currently IOS is unsupported
                            </span>
                        </div>
                    </a>
                </div>

                <div class="icon-container">
                    <a href="#scheduling">
                        <img 
                            src="@/assets/usecase/clock.png" 
                            class="icon-image"
                            alt="clock"
                        >
                        <div class="icons-heading">
                            Scheduling
                        </div>
                        <div class="icons-subheading">
                            Set default khateebs and automate your khateeb scheduling
                        </div>
                    </a>
                </div>

                <div class="icon-container">
                    <a href="#centralize">
                        <img 
                            src="@/assets/usecase/database.png" 
                            class="icon-image"
                            alt="database"
                        >
                        <div class="icons-heading">
                            Centralize
                        </div>
                        <div class="icons-subheading">
                            Have all your khateebs' unavailable dates, available timings, and the
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
                            <img 
                                src="@/assets/usecase/note.png" 
                                class="icon-image"
                                alt="notification"
                            >
                        </div>
                        <div class="long-explanation-text-container">
                            <div class="long-explanation-header">
                                Your Khateebs Reminded <span class="green">Automatically</span>
                            </div>
                            <div>
                                You can configure Khateeb Remind to send out notifications
                                to your khateebs' every week at whatever time works for your
                                institution. Your khateebs' will be sent a notification to their
                                devices' and will be reminded about their khutbah if they enter the
                                app.
                            </div>
                        </div>
                    </div>

                    <div class="long-explanation-container alternate" id="scheduling">
                        <div class="long-explanation-text-container">
                            <div class="long-explanation-header">
                                <span class="green">99%</span> of Scheduling Done For You
                            </div>
                            <div>
                                Okay maybe 99% is an exaggeration but Khateeb Remind automates
                                most of your khutbah scheduling. <br><br>
                                With Khateeb Remind you can set default khateebs for specific
                                 timings, so you won't have to figure out your khateeb schedule
                                every week. You'll also be alerted about which khateebs cannot make
                                it one certain dates and which khateebs are available for every timing.
                                Additionally you'll be given useful warnings about scheduling khateebs.
                            </div>
                        </div>
                        <div class="long-explanation-icon-container">
                            <img 
                                src="@/assets/usecase/calendar.png" 
                                class="icon-image"
                                alt="calendar"
                            >
                        </div>
                    </div>

                    <div class="long-explanation-container" id="centralize">
                        <div class="long-explanation-icon-container">
                            <img 
                                src="@/assets/usecase/cloud.png" 
                                class="icon-image"
                                alt="cloud"
                            >
                        </div>
                        <div class="long-explanation-text-container">
                            <div class="long-explanation-header">
                                Look in <span class="green">One</span> Place for Khutbah Information
                            </div>
                            <div>
                                No more need to have all your khateebs' schedules, prayer timings, 
                                and the rest of your khutbah-related information in multiple places.
                                Khateeb Remind stores them in the cloud so that you and all your khateebs
                                can have one spot to find all they need to know about khutabhs.
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <button class="purple signup-button last-button">
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
                        <img 
                            src="@/assets/usecase/pwa.png" 
                            class="icon-image"
                            alt="laptop and phone"
                        >
                        <div class="icons-heading">
                            Downloadable
                        </div>
                        <div class="icons-subheading">
                            Although Khateeb Remind is a website, it can be downloaded
                            like an app - to your phone, tablet, or computer.
                        </div>
                    </div>

                    <div class="icon-container">
                        <img 
                            src="@/assets/usecase/camera.png" 
                            class="icon-image"
                            alt="camera"
                        >
                        <div class="icons-heading">
                            Beautiful Interface
                        </div>
                        <div class="icons-subheading">
                            It was designed with simplicity and beauty in mind (masha'Allah).
                        </div>
                    </div>

                    <div class="icon-container">
                        <img 
                            src="@/assets/usecase/clipboard.png" 
                            class="icon-image"
                            alt="linux logo"
                        >
                        <div class="icons-heading">
                            Built for Function
                        </div>
                        <div class="icons-subheading">
                            This app was created by a group of University of Calgary
                            students who wanted to organize khateeb scheduling in 
                            a better way. So, it was built by people who actually
                            use the app and are in the trenches.
                        </div>
                    </div>

                    <div class="icon-container">
                        <img 
                            src="@/assets/usecase/linux.png" 
                            class="icon-image"
                            alt="linux logo"
                        >
                        <div class="icons-heading">
                            Open-Source
                        </div>
                        <div class="icons-subheading">
                            Khateeb Remind's source code is readily 
                            available to the public. Meaning that you can see exactly
                            what information we keep on you and how we do it.
                            <br><br>
                            That also means you can contribute (extending, or fixing bugs) to the project
                            if your a developer. Additionally, you are free to
                            create an instance of Khateeb Remind and tailor it for 
                            your institution or anything else really. <br><br>
                            <a href="https://github.com/moomoolive/khateeb_remind" target="_blank">
                                <span class="icons-subheading-warning green">
                                     Click Here to View Source Code
                                </span>
                            </a>
                        </div>
                    </div>

                </div>

                <div>
                    <button class="green signup-button last-button">
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
    @include centerMargin();
    background: getColor("silver");
    margin-top: 40px;
    padding-top: 20px;
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 20px;
    @include normalBorderRounding();
    @include floatingBoxShadow();
}

.main-photo-section {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}

.main-photo-frame {
    width: 50%;
    @include flexboxDefault();
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
}

.main-section-division {
    width: 100%;
    border-bottom: getColor("grey") solid 5px;
    margin-top: 50px;
    margin-bottom: 50px;
    @include centerMargin();
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
    @include floatingBoxShadow(0.30);

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

.icon-image {
    width: 50%;
    height: 50%;
    max-width: 120px;
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
    @include centerMargin();
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
    color: getColor("grey");
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

@media screen and (max-width: $phoneWidth) {

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