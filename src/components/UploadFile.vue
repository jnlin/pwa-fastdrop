<template>
  <div class="uploadfile">
    <b-alert show variant="info">您的臨時 ID: <strong>{{id}}</strong></b-alert>
    <b-alert show variant="success">成功取得授權，請選擇要分享的檔案</b-alert>
    <b-container>
      <b-row align-h="center">
        <b-form-file
            v-model="file"
            :state="Boolean(file)"
            size="lg"
            multiple>
        </b-form-file>
      </b-row>
    </b-container>
    <b-container style="margin-top: 10px">
      <span>請選擇傳送對象</span>
      <b-row align-h="center">
        <b-col v-for="user in users" :key="user.id" style="margin-top: 10px">
          <b-button variant="info" @click="uploadFile">{{user.id}}</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import * as config from '../config.js'

export default {
  name: 'UploadFile',
  props: {
    id: {
      type: String,
      required: true
    },
    users: {
      type: Array,
      required: true
    }
  },
  methods: {
    uploadFile (event) {
      const id = event.target.innerText
      event.target.disabled = true

<<<<<<< HEAD
      axios.post(config.api.endpoint + '/notifyClient?id=' + id + '&from=' + this.id).then(function (response) {
        console.log(response)
      })
=======
      this.$emit('uploadFiles', this.file)
>>>>>>> 35c46cf72548baadad552d425943c941a6ff98ee
    }
  }
}
</script>
