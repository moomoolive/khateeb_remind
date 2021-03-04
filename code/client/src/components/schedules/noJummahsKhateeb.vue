<template>
    <div>
        <msg-with-pic
            msg="It should be up soon insha'Allah"
            gif="flyingPlanes"
            title="This month's schedule hasn't been created yet"
        />
    </div>
</template>

<script>
import msgWithPic from '@/components/general/msgWithPic.vue'

export default {
    name: 'noJummahsKhateeb',
    components:{
        msgWithPic
    }
}
</script>

<style lang="scss" scoped>
</style>