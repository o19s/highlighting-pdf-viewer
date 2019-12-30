# Highlighting PDF Viewer

A component (written in Vue) that takes a Solr response and renders highlight data onto a provided PDF file. This component is the PDF rendering element itself — in isolation — and does not contain any opinionated logic related to snippet rendering / linking. This component is a single part of the larger project completed for FRB.

For example code related to linking snippets to the rendered PDF viewer see the included `/examples/details.js` file.

## Development
```
npm install
npm run serve
```

This development demo uses a hard-coded mock Solr response (`/public/demo_response.json`) to render highlights on the provided example PDF (`/public/usb_p5.pdf`). When successfully run, you should see the rendered PDF along with associated highlights for the query `monetary policy`.

`App.vue` and `Home.vue` are merely wrapper components in this project in order to bootstrap the demo and feed data to the actual `PDFViewer.vue` component. Any neccessary updates will likely solely be completed in the `./src/components/PDFVIewer.vue` component.

## Tour of PDFVIewer.vue
The PDF viewer component takes the following props as arguments:

- `solrResponse` - The Solr payload
- `fileName` - The name of the pdf file on the filesystem (include .pdf)
- `documentPath` - The path to the pdf file

Once the component is mounted, the PDFViewer component loads the pdfjs library, loads the requested PDF document, and then proceeds to parse the provided payload data and add new highlight elements to the DOM.

The PDFViewer component is only responsible for rendering the PDF and drawing the highlights. Any other operation, such as scrolling to a particular highlight, or rendering a list of snippets from the same Solr payload must be accomplished with external scripts that then themselves interact with the PDFViewer.

## Build
You will need to have the `vue-cli-service` locally in your project. You can learn more about the `vue-cli-service` in the [official Vue.js Docs](https://cli.vuejs.org/guide/cli-service.html).

```
./build.sh
```

This script runs the necessary command line arguments to create a standalone JavaScript module out of the Vue component. This module, which will be built into the `dist` directory is what you need to place inside of your web application. The file you will want to include in your production build is `pdfviewer.umd.min.js`.

## Use
In your project, you'll want to include the compiled Vue module from the dist directory and pass in required props for the PDF viewer to accurately render your PDF with highlights. In order to properly mount, the Vue runtime will need to be included in your project.

in the `/examples` directory you can view `pdfviewer.loader.js` to see an approach for chaining together the correct order of loading for the JavaScript assets, including the minified Vue runtime.

on line 23 of `pdfviewer.loader.js` you will need to supply the path to your compiled copy of the PDF viewer module using the build script provided in the project.

Below is the code (`/examples/pdfviewer.bootstrap.js`) for passing the correct content into the Vue component. This is the last file loaded by the chained approach in `pdfviewer.loader.js`.

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
```


