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

      this.$emit('uploadFiles', id, this.file)
    }
  }
}
</script>
