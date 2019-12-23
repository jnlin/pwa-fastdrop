<template>
  <div class="permission">
    <b-alert show variant="info" v-if="loading">取得定位資料中，請稍候...</b-alert>
    <b-container>
      <b-row align-h="center">
        <b-button variant="info" @click="askPermission">開啟定位與推播權限</b-button>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Permission',
  data: () => {
    return {
      loading: false
    }
  },
  methods: {
    askPermission (event) {
      event.target.disabled = this.loading = true
      navigator.geolocation.getCurrentPosition(
        (pos) => { this.$emit('hasGeolocation') },
        (err) => { if (err) { alert('無法取得位置') } }
      )
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          this.$emit('hasNotification')
        } else {
          alert('無法接收推播')
        }
      })
    }
  }
}
</script>
