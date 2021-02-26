<template>
    <div>
        <msg-with-pic
            :msg="`Loading...`"
            :gif="`loading`"
        />
    </div>
</template>

<script>
import msgWithPic from '@/components/general/msgWithPic.vue'

export default {
    name: 'loading',
    components: {
        msgWithPic
    }
}
</script>