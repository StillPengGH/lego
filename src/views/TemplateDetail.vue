<template>
<div>
  <a-layout :style="{ background: '#fff'}">
    <a-layout-header class="header">
      <div class="header__title">
        Still乐高
      </div>
    </a-layout-header>
    <a-layout-content>
      <div class="detail-container">
        <a-row type="flex" justify="center">
          <a-col :span="8" class="detail-container__img">
            <img src="https://static.imooc-lego.com/upload-files/screenshot-889755.png" alt="">
          </a-col>
          <a-col :span="8">
            <h2>前端架构师直播海报</h2>
            <p>如何突破前端成长瓶颈</p>
            <div class="detail-container__author">
              <a-avatar>V</a-avatar> 该模版由 <b>Still</b> 创作
            </div>
            <div class="detial-container__code">
              <span>扫一扫，手机浏览</span>
              <div class="detail-container__code__qr"></div>
            </div>
            <div class="detail-container__buttons">
              <a-button type="primary" size="large">使用模板</a-button>
              <a-button size="large">下载图片海报</a-button>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-layout-content>
    <a-layout-footer>
      © Still网（still.com）版权所有 | 京ICP备20888888号-2
    </a-layout-footer>
  </a-layout>
</div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<style lang="scss">
@import '../style/viriables.scss';

.header {
	&__title {
		color: $whiteColor;
	}
}

.detail-container {
  margin-top: 50px;
  margin-bottom: 30px;
  .ant-avatar {
    margin-right: 10px;
  }
  &__img {
    margin-right: 30px;
    img {
      width: 100%;
    }
  }
  &__buttons {
    margin: 30px 0;
  }
  &__code {
    margin: 20px 0;
    &__qr {
      width: 120px;
      height: 120px;
      background: yellow;
    }
  }
}
</style>