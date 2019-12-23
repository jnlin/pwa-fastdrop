<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="success">
      <b-navbar-brand href="#">Fastdrop</b-navbar-brand>
      <b-nav-text>與附近的人快速分享檔案</b-nav-text>
    </b-navbar>
    <b-alert show variant="primary" type="dark" v-if="!isReady">為了找到附近的人，請允許定位與推播</b-alert>
    <Permission v-on:hasGeolocation="hasGeolocation" v-on:hasNotification="hasNotification" v-if="!isReady"/>
    <UploadFile v-if="isReady" v-bind:id="getId()"/>
  </div>
</template>

<script>
import Permission from './components/Permission'
import UploadFile from './components/UploadFile'

import randomWords from 'random-words'
import * as firebase from 'firebase'

import * as config from './config.js'

firebase.initializeApp(config.firebaseConfig)
const messaging = firebase.messaging()

export default {
  name: 'App',
  data: () => {
    return {
      id: '',
      pos: '',
      token: '',
      geolocation: false,
      notification: false
    }
  },
  computed: {
    isReady: function () {
      return this.notification && this.geolocation
    }
  },
  components: {
    Permission,
    UploadFile
  },
  methods: {
    hasNotification () {
      this.notification = true
      messaging.usePublicVapidKey(config.notificationConfig.credential)
      messaging.getToken().then((token) => {
        this.token = token
      })
    },
    hasGeolocation (pos) {
      this.geolocation = true
      this.pos = pos
    },
    getId () {
      if (!this.id) {
        this.id = randomWords() + Math.round(Math.random() * 1000)
      }

      return this.id
    }
  }
}
</script>
