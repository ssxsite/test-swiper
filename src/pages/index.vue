<template>
  <div>
    <swiper :list='list' :autoPlay="0" :paginationVisible="true" :vertical="false"
            :height="200"  :loop="true" :initPage="1" :indicatorColor="'yellow'">
      <div  v-for="(item,index) in list" :key="index"  class="mui-swiper-slide">
        <img :src="item.imgSrc"   style="max-width:100%;"/>
      </div>
    </swiper>
    <div style="height: 100px;"></div>
    <swiper :list='list' :autoPlay="3000" :type="'slide'" :paginationVisible="true" :vertical="true"
             :height="300" :loop="true" :initPage="2"  @change="pageChange">
      <div  v-for="(item,index) in list" :key="index"  class="mui-swiper-slide">
        <img :src="item.imgSrc"   style="max-width:100%;"/>
      </div>
    </swiper>
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
    },
    methods:{
        pageChange(index){
            console.log('pageChange',index);
        }
    }
}
</script>

<style  lang="scss" scoped>
  .mui-swiper-slide{
    font-size:24px;
    justify-content: center;
    align-items: center;
    display: flex;
  }
</style>
