<template>
	<div class="file-upload">
    <div class="upload-area" v-on="events" :class="{'is-dragover': drag && isDragOver}">
      <slot name="loading" v-if="isUploading" >
        <button disabled>正在上传</button>
      </slot>
      <slot name="uploaded" v-else-if="lastFileData && lastFileData.loaded" 
        :uploadedData="lastFileData.data">
        <button>点击上传</button>
      </slot>
      <slot name="default" v-else >
        <button>点击上传</button>
      </slot>

      <a-button v-if="!autoUpload" @click.stop="nonAutoUploadFiles">手动上传</a-button>
    </div>

		<input
			type="file"
			:style="{ display: 'none' }"
			ref="fileInput"
			@change="handleFileChange"
		/>

		<ul :class="`upload-list upload-list-${listType}`">
			<li
				v-for="file in fileList"
				:key="file.uid"
				:class="`upload-list upload-${file.status}`"
			>
        <img 
          v-if="file.url && listType==='picture'"
          class="upload-list-thumbnail"
          :src="file.url"
          :alt="file.name"
        >
        <span v-if="file.status === 'loading'" class="file-icon"><LoadingOutlined /></span>
        <span v-else class="file-icon"><FileOutlined /></span>
				<span class="filename">{{ file.name }}</span>
        <span class="delete-icon" @click="removeFile(file.uid)"><DeleteOutlined/></span>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, PropType } from 'vue'
import { DeleteOutlined, LoadingOutlined, FileOutlined } from '@ant-design/icons-vue'
import axios from 'axios'
import { last } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

// 上传附件对象的类型定义
export interface UploadFile {
	uid: string; // 独一无二标识符
	size: number; // 附件大小
	name: string; // 附件名称
	status: UploadStatus; // 状态
	raw: File; // 上传附件本身（类型File）
  // eslint-disable-next-line
  resp?: any; // 服务器响应数据 
  url?: string; // 缩略图模式对应的图片url
}

// 上传状态类型定义
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'

// 列表展示类型定义
type FileListType = 'picture' | 'text'

// beforUpload属性的类型定义（函数类型，参数是File，返回值是boolean或者Promise）
type CheckUpload = (file: File) => boolean | Promise<File>

export default defineComponent({
	props: {
		action: { // 上传地址
			type: String,
			required: true,
		},
    beforeUpload: { // 钩子函数：上传前
      type: Function as PropType<CheckUpload>
    },
    drag: { // 是否开启拖拽模式
      type: Boolean,
      default: false,
    },
    autoUpload: { // 是否自动上传
      type: Boolean,
      default: true
    },
    listType: {
      type: String as PropType<FileListType>,
      default: 'text'
    }
	},
  components: {
    DeleteOutlined, 
    LoadingOutlined, 
    FileOutlined
  },
	setup(props) {

		// 变量定义：input type=file 节点对象
		const fileInput = ref<HTMLInputElement>()

		// 变量定义：上传file数组
		const fileList = ref<UploadFile[]>([])

    // 变量定义：是否将文件拖拽到上传区域
    const isDragOver = ref(false)

		// 计算属性：是否正在上传
		const isUploading = computed(() => {
			return fileList.value.some( file => file.status === 'loading')
		})

    // 计算属性：计算最后一个file是否加载完毕，并拿到服务器返回结果
    const lastFileData = computed(() => {
      const lastFile = last(fileList.value)
      if( lastFile ) {
        return {
          loaded: lastFile.status === 'success', // 是否加载完毕
          data: lastFile.resp // 是否拿到响应数据
        }
      }
      return false
    })
    
    // 删除附件列表中指定id附件
		const removeFile = (id: string) => {
			fileList.value = fileList.value.filter(
				(file) => file.uid !== id
			)
		}

    // 上传附件
    const postFile = (readyFile: UploadFile) => {
      const formData = new FormData()
      formData.append(readyFile.name, readyFile.raw)
      readyFile.status = 'loading'
      axios
        .post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((resp) => {
          readyFile.status = 'success'
          readyFile.resp = resp.data
          console.log(resp.data)
        })
        .catch(() => {
          readyFile.status = 'error'
        }).finally(() => {
          if(fileInput.value){
            fileInput.value.value = ''
          }            
        })
    }

    // 添加响应书附件对象到附件数组中
    const addFileToList = (uploadFile: File) => {
      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        size: uploadFile.size,
        name: uploadFile.name,
        status: 'ready',
        raw: uploadFile
      })

      // 如果是缩略图模式listType=picture，给fileObj添加url
      if(props.listType === 'picture') {
        // 方法一：
        try {
          fileObj.url = URL.createObjectURL(uploadFile)
        } catch (err) {
          console.log('upload File error', err)
        }
        // 方法二：
        // const fileReader = new FileReader()
        // fileReader.readAsDataURL(uploadFile)
        // fileReader.addEventListener('load', () => {
        //   fileObj.url = fileReader.result as string
        // })
      }

      fileList.value.push(fileObj)
      // 判断是否是自动上传，如果是直接调用上传方法
      if(props.autoUpload) {
        postFile(fileObj)
      }
    }

    // 上传代码前检查
    const beforeUploadCheck = (files: null | FileList) => {
      if (files) {
        const uploadFile = files[0]
        // beforeUpload处理逻辑
        if(props.beforeUpload) {
          const result = props.beforeUpload( uploadFile )
          if(result && result instanceof Promise) {
            result.then(processedFile => {
              if(processedFile instanceof File) {
                addFileToList(processedFile)
              } else {
                throw new Error('beforUpload Promise should return File obj')
              }
            }).catch(e => {
              console.error(e)
            })
          } else  if (result === true) {
            addFileToList(uploadFile)
          }
        } else {
          addFileToList(uploadFile)
        }
			}
    }

		// 触发上传按钮点击
		const triggerUpload = () => {
			if (fileInput.value) {
				fileInput.value.click()
			}
		}

		// input change 事件触发上传
		const handleFileChange = async (e: Event) => {
			const target = e.target as HTMLInputElement
			beforeUploadCheck(target.files)
		}

    // 创建事件对象（多个事件，key：function存放）
    /*eslint-disable-next-line */
    let events: { [key: string]: (e: any) => void } = { 
      'click': triggerUpload
    }

    // dragover/ dragleave 事件绑定的方法
    const handleDrag = (e: DragEvent, isDrag: boolean) => {
      // 阻止dragover/dragleave事件默认行为
      e.preventDefault() 
      isDragOver.value = isDrag
    }

    // 拖拽 drap 事件触发上传
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      isDragOver.value = false
      // 获取上传文件，并上传
      if(e.dataTransfer) {
        beforeUploadCheck(e.dataTransfer.files)
      }
    }

    // drag模式添加对应事件
    if(props.drag) {
      events = {
        ...events,
        'dragover': (e: DragEvent) => { handleDrag(e, true) },
        'dragleave': (e: DragEvent) => { handleDrag(e, false) },
        'drop': handleDrop
      }
    }

    // 手动上传触发的方法定义
    const nonAutoUploadFiles = () => {
      fileList.value.filter(file => file.status === 'ready')
        .forEach(raedyFile => postFile(raedyFile))
    }

		return {
			fileInput,
			triggerUpload,
			handleFileChange,
      removeFile,
			fileList,
			isUploading,
      lastFileData,
      isDragOver,
      events,
      nonAutoUploadFiles
		}
	},
})
</script>

<style lang="scss"> 
.upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;  
}
.upload-list li {
  transition: all .5s cubic-bezier(.55,0,.1,1);
  font-size: 14px;
  line-height: 1.8;
  margin-top: 5px;
  box-sizing: border-box;
  border-radius: 4px;
  min-width: 200px;
  position: relative;
  &:first-child {
    margin-top: 10px;
  }
  .upload-list-thumbnail {
    vertical-align: middle;
    display: inline-block;
    width: 70px;
    height: 70px;
    position: relative;
    z-index: 1;
    background-color: #fff;
    object-fit: cover;
  }
  .file-icon {
    svg {
      margin-right: 5px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .filename {
    margin-left: 5px;
    margin-right: 40px;
  }
  &.upload-error {
    color: #f5222d;
    svg {
      color: #f5222d;
    }
  }
  .file-status {
    display: block;
    position: absolute;
    right: 5px;
    top: 0;
    line-height: inherit;
  }
  .delete-icon {
    display: none;
    position: absolute;
    right: 7px;
    top: 0;
    line-height: inherit;
    cursor: pointer;
  }
  &:hover {
    background-color: #efefef;
    .file-status {
      display: none;
    }
    .delete-icon {
      display: block;
    }
  }
}
</style>