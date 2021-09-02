<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="6" v-for="item of list" :key="item.id" class="poster-item">
        <a-card hoverable>
          <template v-slot:cover>
            <img :src="item.coverImg" v-if="item.coverImg" />
            <img 
              src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png" 
              v-else
            />
            <div class="hover-item">
              <a-button size="large" type="primary">使用该模板创建</a-button>
            </div>
          </template>
          <a-card-meta :title="item.title">
            <template v-slot:description>
              <div class="poster-item__desc">
                <span>作者：Stiil</span>
                <span class="poster-item__desc__num">0</span>
              </div>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TemplateList',
  props: {
    list: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default: 'work'
    }
  }
})
</script>

<style lang="scss">
@import '../style/viriables.scss';

.poster-item {
  position: relative;
  margin-bottom: 20px;
  .ant-card {
    border-radius: 12px;
  }
  .ant-card-cover {
    position: relative;
    overflow: hidden;
    height: 390px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    img {
       width: 100%;
       transition: all ease-in .2s;
    }
    .hover-item {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: none;
      background:  rgba(0, 0, 0, .8);
      align-items: center;
      justify-content: center;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
  }
  .ant-card-hoverable {
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
  }
  .ant-card-body {
    padding: 0
  }
  .ant-card-body {
    padding: 0
  }
  .ant-card-meta {
    margin: 0;
  }
  .ant-card-meta-title {
    color: $c333;
    padding: 10px 12px;
    border-bottom: 1px solid $light_f2;
    margin-bottom: 0 !important;
  }
  .barcode-container img {
    border-radius: 0;
  }
  &__desc {
    display: flex;
    justify-content: space-between;
    padding: 13px 12px;
    color: $c999;
    &__num {
      font-weight: bold;
    }
  }
  &:hover {
    .hover-item {
      display: flex;
    }
    img {
      transform: scale(1.25);
    }
  }
}




</style>
