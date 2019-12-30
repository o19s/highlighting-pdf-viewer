# highlighting-pdf-viewer
A component (written in Vue) that supports highlighting of words in the PDF document. This component is the PDF rendering element itself and does not contain any opinionated logic related to snippet rendering / linking.

For example code related to linking snippets to the rendered pdf see the included `/examples/details.js` file.

## Development
```
npm install
npm run serve
```

## Build
You will need to have the `vue-cli-service` locally in your project. You can learn more about the `vue-cli-service` in the [official Vue.js Docs](https://cli.vuejs.org/guide/cli-service.html).

```
./build.sh
```

This script runs the necessary command line arguments to create a standalone JavaScript module out of the Vue component. This module, which will be built into the `dist` directory is what you need to place inside of your web application. The file you will want to include in your production build is `pdfviewer.umd.min.js`.

## Use
In your project, you'll want to include the compiled Vue module from the dist directory and pass in required props for the PDF viewer to accurately render your PDF with highlights. In order to properly mount, the Vue runtime will need to be included in your project.

in the `/examples` directory you can view `pdfviewer.js` to see an approach for chaining together the correct order of loading for the JavaScript assets, including the minified Vue runtime.

on line 17 of `pdfviewer.js` you will need to supply the path to your compiled copy of the PDF viewer module using the build script provided in the project.

Below is the code (`/examples/pdfviewer.bootstrap.js`) for passing the correct content into the Vue component.

```js
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
              id: window.frb.docId,
              highlights: window.frb.highlights,
              documentPath: '/path/to/pdf/files', // this can be a local or remote URL
            }
          })
        ])
      }
    })
  }
})();
```


