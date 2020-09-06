self.addEventListener('message', function(){
  // var data = e.data;
  // console.log(data, 3314);
  self.postMessage("Hello World");
  //处理数据
}, false);