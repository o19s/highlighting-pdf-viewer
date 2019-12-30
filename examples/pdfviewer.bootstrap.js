/* eslint-disable */

(function () {
  var mountTarget = document.getElementById('frb-pdf-viewer') // target your chosen mount point here
  var pdfViewerEl = document.createElement('div')
  pdfViewerEl.setAttribute('id', 'pdf-viewer')
  mountTarget.parentNode.insertBefore(pdfViewerEl, mountTarget)

  // We're adding our render function to a global window object so that
  // it can be called later when needed.
  window.frb.renderPDF = function () {
    var app = new Vue({
      el: '#pdf-viewer',
      components: {
        pdfviewer: pdfviewer
      },
      render: function (h) {
        return h('div', {}, [
          h(pdfviewer, {
            props: {
              // pull our props from a global window object at the time
              // that the function is called. This gives you time to prepare the data
              // and then call window.frb.renderPDF() when everything is available.
              documentPath: '/path/to/pdf/files', // this can be a local or remote URL
              fileName: window.frb.docId,
              solrResponse: window.frb.highlights
            }
          })
        ])
      }
    })
  }
})();
