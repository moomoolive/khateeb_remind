<template>
    <div>
        <h2>Coming Soon ISA...</h2><br>
        <h4>Current Version: {{ currentVersion }}</h4>
        <h4>Latest Version: {{ latestVersion }}</h4>
    </div>
</template>

<script>
export default {
    name: 'adminDashboard',
    data() {
        return {
            // both hardcoded for now
            currentVersion: '1.0',
            latestVersion: '1.0'
        }
    }
}
</script>

<style>

</style>