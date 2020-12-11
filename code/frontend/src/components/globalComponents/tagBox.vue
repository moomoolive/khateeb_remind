<template>
    <div>
        <p :class="'tag ' + color">
            <span :class='"icon " + color'>{{ symbol }}</span>
            {{ words }}
        </p>
    </div>
</template>

<script>
export default {
    name: 'tagBox',
    props: {
        words: {
            type: String,
            required: true
        },
        symbol: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: false
        }
    }
}
</script>

<style lang="scss" scoped>
div {
    margin: 0;
}

.tag {
  pointer-events: none;
  background-color: #242424 !important;
  color: white;
  padding: 6px;
  margin: 5px;
  margin-bottom: 0;
  &.urgent{
        background-color: #DEDE2A !important;
        color: black;
    }
    &.important{
        background-color: #C93333 !important;
        color: black;
    }
    &.goodNews {
        background-color: #4CAF50 !important;
    }
}

.icon {
    $top: 4px;
    pointer-events: auto;
    padding-right: $top;
    padding-left: $top;
    margin-right: 6px;
    color: #ccc;
    background-color: #111;
    &.urgent{
        background-color: #C4C425;
        color: black;
    }
    &.important{
        background-color: #8A2222;
    }
    &.goodNews {
        background-color: #38823A;
        color: white;
    }
}
</style>