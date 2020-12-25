<template>
    <div class="body">
        <p>{{ body }}</p>
    </div>
</template>

<script>
export default {
    name: 'announcementBody',
    props: {
        body: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
.body {
    text-align: left;
}

p {
    font-size: 1.7vh;
}

</style>