<template>
    <div class="space">
        <msg-with-pic
            title="Ooops..."
            msg="The page you searched for doesn't exist!"
            gif="personThrowingPlane"
        />
        <div class="button">
            <button>
                <router-link to="/">Go to Home</router-link>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'pageNotFound'
}
</script>

<style>
.space {
    margin-top: 4vh;
}

.button {
    margin-top: 2vh;
}

</style>