/* eslint-disable */

// this file loads the minified Vue runtime, the source code of the compiled PDF viewer
// module, and the custom script(s) necessary to boot the PDF viewer in your application
// in sequence. This approach  ensures that each requirement is successfully included
// in your project in the correct order, so that you do not end up trying to
// mount the PDF viewer component before the vue runtime is available, etc.

(function () {
  var head = document.getElementsByTagName('head')[0];
  var vueRuntimeScript = document.createElement('script');
  vueRuntimeScript.type = 'text/javascript';
  vueRuntimeScript.src = './vue.runtime.min.js'; // relative path to vue runtime
  head.appendChild(vueRuntimeScript);

  vueRuntimeScript.onload = function () {
    loadPDFViewer();
  }

  function loadPDFViewer () {
    var pdfViewerModule = document.createElement('script');
    pdfViewerModule.type = 'text/javascript';
    pdfViewerModule.src = './pdfviewer/pdfviewer.umd.min.js'; // relative path to pdf viewer module
    head.appendChild(pdfViewerModule);

    pdfViewerModule.onload = function () {
      pdfViewerBootstrap();
    }
  }

  function pdfViewerBootstrap () {
    var pdfViewerBootstrap = document.createElement('script');
    pdfViewerBootstrap.type = 'text/javascript';
    pdfViewerBootstrap.src = './pdfviewer.bootstrap.js'; // path to script file for mounting the module. Alteratively, write your mounting logic inline in this function.
    head.appendChild(pdfViewerBootstrap);
  }
})();
