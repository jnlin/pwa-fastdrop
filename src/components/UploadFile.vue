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
      <b-row align-h="center">
        <b-button variant="info" @click="uploadFile">分享</b-button>
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
    }
  },
  methods: {
    uploadFile (event) {
      event.target.disabled = true
    }
  }
}
</script>
