<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="success">
      <b-navbar-brand href="#">Fastdrop</b-navbar-brand>
      <b-nav-text>與附近的人快速分享檔案</b-nav-text>
    </b-navbar>
    <b-alert show variant="primary" type="dark" v-if="!isReady">為了找到附近的人，請允許定位與推播</b-alert>
    <Permission v-on:hasGeolocation="hasGeolocation" v-on:hasNotification="hasNotification" v-if="!isReady"/>
    <UploadFile v-if="isReady" v-on:uploadFiles="uploadFiles" v-bind:id="getId()" v-bind:users="users"/>
  </div>
</template>

<script>
import Permission from './components/Permission'
import UploadFile from './components/UploadFile'

import randomWords from 'random-words'
import axios from 'axios'
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
      users: [],
      geolocation: false,
      notification: false
    }
  },
  computed: {
    isReady: function () {
      return this.notification && this.geolocation && this.token
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
      messaging.onMessage((payload) => {
        confirm(payload.data.sender + '想要分享檔案給你，是否接收？')
      })
    },
    hasGeolocation (pos) {
      this.geolocation = true
      this.pos = pos
    },
    getId () {
      if (!this.id) {
        this.id = randomWords() + Math.round(Math.random() * 1000)
        firebase.auth().signInAnonymously()
      }

      return this.id
    },
    uploadFiles (files) {
      var storage = firebase.storage()
      var storageRef = storage.ref()

      for (var i in files) {
        var remoteFile = storageRef.child(files[i].name.toLowerCase())
        remoteFile.put(files[i]).then(function (snapshot) {
          console.log('Upload ' + files[i].name + ' successfully.')
        })
      }
    }
  },
  watch: {
    id: function (val, old) {
      var that = this
      if (!val || old) {
        return
      }

      const data = {
        id: this.id,
        token: this.token,
        lat: this.pos.coords.latitude,
        lon: this.pos.coords.longitude
      }

      axios.post(config.api.endpoint + '/createClient', data).then(function (response) {
        that.users = response.data
      })
    }
  }
}
</script>
