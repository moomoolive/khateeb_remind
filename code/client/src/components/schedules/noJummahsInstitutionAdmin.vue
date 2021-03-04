<template>
    <div>
        <div class="button-label no-jummahs">
            No Jummahs to Show This Month
        </div>
        <button class="purple">+</button>
        <div class="button-label">
            {{ underButtonLabel }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'noJummahsKhateeb',
    components:{

    },
    computed: {
        underButtonLabel() {
            return 'Click to Create'
        }
    }
}
</script>

<style lang="scss" scoped>
button {
    $size: 50px;
    height: $size;
    width: $size;
    font-size: 30px;
    font-weight: bold;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.button-label {
    font-size: 17px;
    margin-top: 15px;
    margin-bottom: 15px;
    font-weight: bold;
    color: getColor("offWhite");
    &.no-jummahs {
        text-decoration: underline;
    }
}

</style>