<template>
  <div class="downloadfile">
    <b-alert show variant="success"><strong>{{id}}</strong> 分享了檔案給你!</b-alert>
    <b-container style="margin-top: 10px">
      <span>請選擇想下載的檔案</span>
      <b-row align-h="center">
        <b-col v-for="file in files" :key="file.name" style="margin-top: 10px">
          <b-button variant="info" @click="downloadFile">{{file.name}}</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'DownloadFile',
  props: {
    id: {
      type: String,
      required: true
    },
    files: {
      type: Array,
      required: true
    }
  },
  methods: {
    downloadFile (event) {
      this.$emit('downloadFile', event.target.innerText)
    }
  }
}
</script>
