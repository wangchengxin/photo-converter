const { ipcRenderer } = nodeRequire('electron');
const readChunk = nodeRequire('read-chunk');
const fileType = nodeRequire('file-type');


//监听拖放事件
document.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  for (const f of e.dataTransfer.files) {
    const buffer = readChunk.sync(f.path, 0, fileType.minimumBytes);
    console.log(fileType(buffer));
    console.log('File(s) you dragged here: ', f.path);
    ipcRenderer.send('ondropstart', f.path);
  }
});
document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

//填充下拉列表
$.getJSON("resources/images/image-size.json", function (data) {
  var itemCatalog = $("#size-item");
  $.each(data, function (infoIndex, info) {
    //主题分类
    var itemSelect = document.createElement("option");
    var name = info['name'];
    var width = info['width'];
    var height = info['height'];
    itemSelect.innerText = name + '-' + width + "*" + height;
    itemSelect.setAttribute('width', width);
    itemSelect.setAttribute('height', width);
    itemCatalog.append(itemSelect);
  });
});

//首选项选择触发事件
$('#size-catalog').on("change", function () {
  var itemId = $(this).find('option:selected').attr('item-id');
});