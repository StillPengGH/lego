<template>
  <h1>{{msg}}</h1>
  <button @click="setCount">{{count}}</button>
  <input type="text" v-model="todo">
  <button class="addTodo" @click="addTodo">add</button>

  <button class="loadUser" @click="loadUser">load</button>
  <p v-if="user.loading" class="loading">Loading...</p>
  <div v-else class="userName">{{user.data && user.data.username}}</div>
  <p v-if="user.error" class="error">error!</p>

  <ul>
    <li v-for="(todo, index) in todos" :key="index">{{todo}}</li>
  </ul>
  <Hello msg="1234" />
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import axios from 'axios'
import Hello from './Hello.vue'
export default defineComponent({
  name: 'HelloWorld',
  components: {
    Hello
  },
  props: {
    msg: String
  },
  emits: ['send'],
  setup( prpps, context ) {
    const todo = ref('')
    const todos: any = ref([])
    const count = ref(1)
    const user = reactive({
      data: null as any,
      loading: false,
      error: false
    })

    const setCount = () => {
      count.value ++
    }
    const addTodo = () => {
      if(todo.value){
        todos.value.push(todo.value)
        // 发送send事件，并且将todo.value作为参数
        context.emit('send', todo.value)
      }
    }

    const loadUser = () => {
      user.loading = true
      axios.get('https://jsonplaceholder.typicode.com/users/1').then(resp => {
        console.log(resp)
        user.data = resp.data
      }).catch(() => {
        user.error = true
      }).finally(() => {
        user.loading = false
      })
    }

    return {
      todo,
      todos,
      count,
      user,
      setCount,
      addTodo,
      loadUser
    }
  }
})
</script>
