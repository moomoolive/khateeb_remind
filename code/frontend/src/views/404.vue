<template>
    <div style="padding-top: 20px;">
        <h2>Page Not Found</h2>
        <img style="width: 20vh;" :src="image">
        <div style="padding-top: 20px;">
            <button>
                <router-link to="/">Go to Home</router-link>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Page Not Found',
    data() {
        return {
            image: require('../assets/airplaneFlying.png')
        }
    }
}
</script>

<style>

</style>