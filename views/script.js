'use script'

function openAppLink () {
  const url = document.getElementById('fast-link-button').getAttribute('url')
  window.open(`${url}${window.location.search.split('?url=')[1]}`)
}
