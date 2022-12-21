window.requestIdleCallback = window.requestIdleCallback || function(callback) {
  /**
   * 基于setTimeout
   * 理论基础是生物学研究：人眼对于100ms的延迟是无感知的，
   * 故requestIdleCallback取 50ms，另一半时间给后面的任务
   * 预留，避免卡顿
   */
  let start = Date.now();
  return setTimeout(function(){
    callback({
      didTimeout: false,
      timeRemaining:function() {
        return Math.max(0, 50 - (Date.now() - start))
      }
    });
  }, 1);
};

window.cancelIdleCallback = function(id) {
  clearTimeout(id);
}