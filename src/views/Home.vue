<template>
  <div id="app">
    <h2>Example PDF with search term 'monetary policy' being highlighted.</h2>
    <div class="app-body">
      <PDFViewer
        v-if="dataLoaded"
        :id="id"
        :highlights="highlightData"
      />
    </div>
  </div>
</template>

<script>
import PDFViewer from '@/components/PDFVIewer'
import 'url-polyfill'

export default {
  name: 'app',
  components: {
    PDFViewer
  },
  data () {
    return {
      highlightData: {},
      id: 'usb_p5.pdf',
      query: 'monetary policy',
      dataLoaded: false
    }
  },
  mounted () {
    let url = new URL('http://localhost:8080/demo_response.json')
    fetch(url).then((response) => {
      return response.json()
    }).then((json) => {
      this.dataLoaded = true
      this.highlightData = json
    })
  }
}
</script>

<style lang="scss">
body, html {
  margin: 0;
  padding: 1em;
  font-family: sans-serif;
  text-align: center;

  h2 {
    margin-bottom: 1em;
  }
}
</style>

<style lang="scss" scoped>
.app-body {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: #7e858f;

  .the-pdf-viewer {
    padding-top: 125%;
  }
}
</style>
