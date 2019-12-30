/* eslint-disable */

// This file is an example file showing how snippets can be extracted
// from the expected Solr payload and then linked to the rendered PDF using
// the available character offset found within the data.

// ==========================================
// Set up helper functions we may want to
// access inside of our jQuery block
// ==========================================

$.urlParam = function (name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)')
    .exec(window.location.search);
  return (results !== null) ? results[1] || 0 : false;
}

// ==========================================
// Run our jQuery logic on document ready
// including kicking off the rendering of the PDF viewer
// ==========================================

$(document).ready(function () {
  var query = $.urlParam('query');
  var docId = $.urlParam('id');

  window.frb = {
    // renders the pdf if the function exists, or re-calls every
    // 200ms waiting for the data to be ready
    renderPDF: window.frb && typeof window.frb.renderPDF !== "undefined"
      ? window.frb.renderPDF
      : function () { window.setTimeout(function () {
        window.frb.renderPDF();
      }, 200); },
    docId: docId,
    query: query,
    solrResponse: {}
  }

  $.getJSON('//' + window.location.hostname + ':8983/solr/documents/select?q=' + query + '&fq=parent_id:' + docId + '&fl=id,path,page_dimension,page_number&hl=on&hl.fragsize=500&hl.snippets=500&hl.fl=content_ocr&indent=on&wt=json&pl=on&rows=1000&sort=page_number ASC', function(data) {
    window.frb.solrResponse = data

    var snippets = [];
    for (var key in data.highlighting) {
      var highlightPageNumber = key.split('.pdf_')[1]

      for (var highlightKey in data.highlighting[key].content_ocr) {
        snippets.push({
          page_number: highlightPageNumber,
          index: highlightKey,
          highlight: data.highlighting[key].content_ocr[highlightKey]
        })
      }
    }

    renderSnippetsList(snippets)
  })

  // Removes payload data from snippet
  function stripPayloads(snippet) {
    return snippet.replace(/[\|][^\s|</em>]+/g, '');
  }

  function renderSnippetsList(snippets) {
    $(snippets).each(function(index, snippet) {
      var html = $.parseHTML(snippet.highlight);

      var startOffset = $(html).filter('em').first().attr('data-start-offset');
      var endOffset = $(html).filter('em').last().attr('data-end-offset');

      var snippetMarkup =  '<div class="snippet-item" data-end-offset="' + endOffset +'" data-start-offset="' + startOffset + '" data-pdf-page="' + snippet.page_number + '" data-highlight-index="' + snippet.index + '">';
          snippetMarkup +=   '<p>...' + stripPayloads(snippet.highlight) + '...</p>';
          snippetMarkup += '</div>';

      $('#the-snippet-list').find('.results').append(snippetMarkup)
    })

    // call the render function to kick off rendering or
    // the wait loop for data to be ready
    window.frb.renderPDF()
  }

  // ==========================================
  // Set up the front-end listener
  // and corresponding events
  // ==========================================


  $(document).on('click', '.snippet-item', function() {
    $('.snippet-item').removeClass('selected');
    $(this).addClass('selected');
    scrollPdfViewer($(this).data('pdf-page'), $(this).data('start-offset'), $(this).data('end-offset'));
  })

  var $targetHighlight = false

  function scrollPdfViewer(pageNumber, startOffset, endOffset) {
    var $pdfViewer = $('#the-frb-pdf-viewer .pdf-viewer-container');
    var $targetPage = $pdfViewer.find('.page[data-page-number="' + pageNumber + '"]');
    var pageOffset = $targetPage.offset().top - $targetPage.closest('#pdf-viewer').offset().top - $targetPage.closest('#pdf-viewer').scrollTop();

    $pdfViewer.animate({ scrollTop: pageOffset}, 800);

    checkForHighlight($pdfViewer, $targetPage, startOffset, endOffset);
  }

  function checkForHighlight(viewer, page, startOffset, endOffset) {
    var highlightsFound = false;

    $('span.box-highlight').removeClass('active')
    page.find('span.box-highlight').each(function() {
      var snippetStart = $(this).data('start-offset')
      var snippetEnd = $(this).data('end-offset')

      if (startOffset <= snippetStart && endOffset >= snippetEnd) {
        highlightsFound = true;
        var highlightOffset = $(this).offset().top - $(this).closest('#pdf-viewer').offset().top - $(this).closest('#pdf-viewer').scrollTop() - 150
        viewer.animate({ scrollTop: highlightOffset, easing: 'linear'}, 500);
        $(this).addClass('active')
      }
    })

    if (!highlightsFound) {
      window.setTimeout(function() {
        checkForHighlight(viewer, page, startOffset, endOffset);
      }, 200)
    }
  }
});
