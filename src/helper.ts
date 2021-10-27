import { message } from 'ant-design-vue'

interface CheckCondition {
	format?: string[];
	size?: number; // 单位M
}
type ErrorType = 'format' | 'size' | null

// 通用检查
export function beforeUploadCheck(file: File, condition: CheckCondition) {
	const { format, size } = condition
	const isValidFormat = format ? format.includes(file.type) : true
	const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
	let error: ErrorType = null
	if (!isValidFormat) {
		error = 'format'
	}
	if (!isValidSize) {
		error = 'size'
	}
	return {
		passed: isValidFormat && isValidSize,
		error,
	}
}

// 自定义检查
export const commonUploadCheck = (file: File) => {
	const result = beforeUploadCheck(file, {
		format: ['image/jpeg', 'image/png'],
		size: 1,
	})
  const { passed, error } = result
  if(error === 'format') {
    message.error('上传图片只能是 JPG/PNG 格式！')
  }
  if(error === 'size') {
    message.error('上传图片大小不能超过 1Mb！')
  }
  return passed
}

// 通过url获取上传图片真实宽高
export const getImageTrueWH = (url: string) => {
  return new Promise<{width: number; height: number}>((resolve, reject) => {
    const img = new Image()
    img.src = url
    // 监听图片加载完毕，获取真实宽高（并起别名）
    img.addEventListener('load', () => {
      const { naturalWidth: width, naturalHeight: height} = img
      resolve({ width, height })
    })
     // 监听图片加载失败
    img.addEventListener('error', () => {
      reject(new Error('There is some problem with the image'))
    })
  })
}