<template>
  <div>
    <swiper :list='list' :autoplay="true" :type="'slide'" :option="true"
            :time="4000"></swiper>
  </div>
</template>

<script>
  import swiper from './swiper'
export default {
  name: 'HelloWorld',
    components:{swiper},
    data() {
        return {
            list: [
                {src: './imgs/1.jpg'},
                {src: './imgs/12jpg'},
                {src: './imgs/13jpg'},
                {src: './imgs/14jpg'},
                {src: './imgs/15jpg'},
            ]
        };
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>

</style>
