<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="success">
      <b-navbar-brand href="#">Fastdrop</b-navbar-brand>
      <b-nav-text>與附近的人快速分享檔案</b-nav-text>
    </b-navbar>
    <b-alert show variant="primary" type="dark" v-if="!isReady">為了找到附近的人，請允許定位與推播</b-alert>
    <Permission v-on:hasGeolocation="hasGeolocation" v-on:hasNotification="hasNotification" v-if="!isReady"/>
    <UploadFile v-if="isReady && !isUploaded & remoteId === ''" v-on:uploadFiles="uploadFiles" v-bind:id="getId()" v-bind:users="users"/>
    <b-alert show variant="info" v-if="isUploaded">已經成功傳送給: <strong>{{receiverId}}</strong></b-alert>
    <DownloadFile v-if="remoteId !== ''" v-bind:id="remoteId" v-bind:files="files" v-on:downloadFile="downloadFile"/>
  </div>
</template>

<script>
// TODO: pushnotification && update receiver lists
import Permission from './components/Permission'
import UploadFile from './components/UploadFile'
import DownloadFile from './components/DownloadFile'

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
      receiverId: '',
      remoteId: '',
      pos: '',
      token: '',
      users: [],
      files: [],
      geolocation: false,
      notification: false,
      isUploaded: false
    }
  },
  computed: {
    isReady: function () {
      return this.notification && this.geolocation && this.token
    }
  },
  components: {
    Permission,
    UploadFile,
    DownloadFile
  },
  methods: {
    hasNotification () {
      this.notification = true
      messaging.usePublicVapidKey(config.notificationConfig.credential)
      messaging.getToken().then((token) => {
        this.token = token
      })
      messaging.onMessage((payload) => {
        const id = payload.data.sender
        const storage = firebase.storage()
        const storageRef = storage.ref()
        const myRef = storageRef.child(id)
        const that = this

        if (!confirm(id + '想要分享檔案給你，是否接收？')) {
          return
        }

        this.remoteId = id

        myRef.listAll().then(function (res) {
          res.items.forEach(function (itemRef) {
            that.files.push({ name: itemRef.name })
          })
        })
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
    uploadFiles (id, files) {
      const storage = firebase.storage()
      const storageRef = storage.ref()
      const myRef = storageRef.child(this.id)
      const that = this
      this.receiverId = id

      for (var i in files) {
        var remoteFile = myRef.child(files[i].name.toLowerCase())
        remoteFile.put(files[i]).then(function (snapshot) {
          console.log('Upload ' + files[i].name + ' successfully.')
          if (parseInt(i) === files.length - 1) {
            that.isUploaded = true
          }
        })
      }
    },
    downloadFile (file) {
      const storage = firebase.storage()
      const storageRef = storage.ref()
      const myRef = storageRef.child(this.remoteId)

      var remoteFile = myRef.child(file)
      remoteFile.getDownloadURL().then(function (url) {
        window.open(url)
      })
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
    },
    isUploaded: function (val, old) {
      if (!val) {
        return
      }

      axios.post(config.api.endpoint + '/notifyClient?id=' + this.receiverId + '&from=' + this.id).then(function (response) {
        console.log(response)
      })
    }
  }
}
</script>
