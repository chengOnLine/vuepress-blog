<template>
  <div id="vcomments"></div>
</template>

<script>
export default {
  mounted: function(){
    // require window 
    const Valine = require('valine');
    if (typeof window !== 'undefined') {
      this.window = window
      window.AV = require('leancloud-storage')
    }
     
    new Valine({
      el: '#vcomments' ,
      appId: 'hcLxE7L0jK9GgZ1s6pHeJKNA-gzGzoHsz',// your appId
      appKey: 'GtYqfvOp8HzPnhaXHENZEo25', // your appKey
      notify: false, 
      verify: false, 
      avatar: 'monsterid',   // mm monsterid
      placeholder: '说点什么吧~' 
    });
  },
}
</script>