import * as $ from 'jquery'

function createAnalytics( ){
  let counter = 0
  let destroyed = false
  const listener = () => counter++
  $(document).on('click', listener) // в jquery вместо addEventListener

  return {
    destroy() {
      $(document).off('click', listener) // в jquery вместо addEventListener
      destroyed = true
    },

    getClicks() {
      if(destroyed){
        return `Analitics is destroyed. Total clicks = ${counter}`
      }
      return counter
    }
  }
}

window.analytics = createAnalytics()