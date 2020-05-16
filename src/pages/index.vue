<template>
  <div>
    <swiper :list='list' :autoplay="true" :type="'slide'" :option="true"
            :time="4000" :height="100"  :loop="true">
      <div  v-for="(item,index) in list" :key="index"  class="mui-swiper-slide">
        <img :src="item.imgSrc"   style="max-width:100%;"/> 
      </div>
    </swiper>
    <div style="height: 100px;"></div>
<!--    <swiper :list='list' :autoplay="true" :type="'slide'" :option="true" :vertical="true"-->
<!--            :time="4000" :height="100"></swiper>-->
  </div>
</template>

<script>
  import swiper from '../components/swiper.vue'
export default {
  name: 'HelloWorld',
    components:{swiper},
    data() {
        return {
            list: [
              {
                imgSrc:'//m.360buyimg.com/mobilecms/s750x366_jfs/t1/18629/34/3378/144318/5c263f64Ef0e2bff0/0d650e0aa2e852ee.jpg'
              },
              {
                imgSrc:'//m.360buyimg.com/mobilecms/s750x366_jfs/t1/26597/30/4870/174583/5c35c5d2Ed55eedc6/50e27870c25e7a82.png'
              },
              {
                imgSrc:'//m.360buyimg.com/mobilecms/s750x366_jfs/t1/9542/17/12873/201687/5c3c4362Ea9eb757d/60026b40a9d60d85.jpg'
              }
            ]
        };
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss" scoped>
  .mui-swiper-slide{
    font-size:24px;
    justify-content: center;
    align-items: center;
    display: flex;
  }
</style>
