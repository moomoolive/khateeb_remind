<template>
    <div>
        <div class="topnav">
            <a 
                class="green footer-selection"
                href="https://github.com/moomoolive/khateeb_remind" 
                target="_blank"
            >
                Feedback
            </a>
        </div>

        <div class="contribute-now">
            <a 
                href="https://github.com/moomoolive/khateeb_remind"
                target="_blank"
            >
                Are you a developer and want to contribute? <span class="green">Click here!</span>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Footer',
    computed: {
    }
}
</script>

<style lang="scss" scoped>
.topnav {
    overflow: hidden;
    left: 0;
    min-height: 20px;
    max-height: 90px;
    height: 10vh;
    width: 95.2vw;
    min-width: $minimumAppWidth;
    margin: 0;
    overflow: hidden;
    text-align: left;
}

a {
    position: relative;
    text-decoration: none;
    color: getColor("silver");
    font-size: 15px;
    
    &:hover {
        color: getColor("blue") !important;
    }
    
    &.green {
        color: getColor("green");
    }
    
    &.footer-selection {
        margin-left: 10px;
        top: 12px;
    }
}

span {
    &:hover {
        color: getColor("blue") !important;
    }
}

.contribute-now {
    position: relative;
    bottom: 15px;
    @include centerMargin();
}

.institution-name {
    text-align: right;
    font-size: 11px;
    color: getColor("blue")
}

@media screen and (max-width: $phoneWidth) {
    a {
        font-size: 11px;
        &.footer-selection {
            top: 7px;
            margin-left: 7px;
        }
    }

}
</style>