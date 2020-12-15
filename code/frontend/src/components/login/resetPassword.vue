<template>
    <div style="padding-top: 20px;">
        <cool-btn
            color="yellow"
            buttonText="Back to Login"
            @pushed="$emit('back')"
        />
        text verificaiton
    </div>
</template>

<script>
export default {
    name: 'textReset'
}
</script>

<style>

</style>