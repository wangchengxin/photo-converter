const {ipcRenderer} = nodeRequire('electron');

//监听拖放事件
document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    for (const f of e.dataTransfer.files) {
      console.log('File(s) you dragged here: ', f.path);
      ipcRenderer.send('ondropstart', f.path);
    }
  });
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
//填充下拉列表
$.getJSON("resources/images/image-size.json", function (data){
  var sizeCatalog = $("#size-catalog");
  //清空内容 
  $.each(data, function (infoIndex, info){
    var sizeSelect = document.createElement("option");
    sizeSelect.innerText = info['catalog'];
    sizeCatalog.append(sizeSelect);
    var itemData = info['item'];
    $.each(itemData, function (infoIndex, info){

    });
  });
});