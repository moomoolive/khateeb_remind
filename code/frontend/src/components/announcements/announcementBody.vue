<template>
    <div>
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

<style>

</style>