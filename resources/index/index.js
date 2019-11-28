const { ipcRenderer } = nodeRequire('electron');
const readChunk = nodeRequire('read-chunk');
const fileType = nodeRequire('file-type');
const sizeOf = nodeRequire('image-size');
const fs = nodeRequire('fs');

//校验是否通过
var isChecked = false;
//图片路径
var imagePath = null;


//监听拖放事件
document.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  for (const f of e.dataTransfer.files) {
    //文件类型
    var buffer = readChunk.sync(f.path, 0, fileType.minimumBytes);
    $('#file-info-type').val(fileType(buffer).ext);
    //图片大小
    fs.stat(f.path, function (err, stats) {
      if (err) {
          return console.error(err);
      }
      var fileSize = stats.size/1024;
      $('#file-info-size').val(fileSize.toFixed(1) + 'k');
   });
    //图片尺寸
    var dimensions = sizeOf(f.path);
    $('#file-image-size').val(dimensions.width + '*' + dimensions.height);
    //展示图片
    $('#img-display').attr('src',f.path);
    $('#img-display').attr('width',200);
    $('#img-display').attr('height',200);
    imagePath = f.path;
  }
});
document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

//填充尺寸下拉列表
$.getJSON("resources/images/image-size.json", function (data) {
  var itemTop = $("#size-item");
  $.each(data, function (infoIndex, info) {
    //主题分类
    var itemSelect = document.createElement("option");
    var name = info['name'];
    var width = info['width'];
    var height = info['height'];
    itemSelect.innerText = name + '-' + width + "*" + height;
    itemSelect.setAttribute('width', width);
    itemSelect.setAttribute('height', height);
    itemTop.append(itemSelect);
  });
});

//填充文件格式下拉列表
$.getJSON("resources/images/file-format.json", function (data) {
  var itemTop = $("#image-format");
  $.each(data, function (infoIndex, info) {
    //主题分类
    var itemSelect = document.createElement("option");
    var name = info['name'];
    var value = info['value'];
    itemSelect.innerText = name;
    itemSelect.value = value;
    itemTop.append(itemSelect);
  });
});

//尺寸选项选择触发事件
$('#size-catalog').on("change", function () {
  var itemId = $(this).find('option:selected').val();
  if (itemId == 1) {
    $('#div-select-size').hide();
    $('.div-input-size').show();
  } else {
    $('.div-input-size').hide();
    $('#div-select-size').show();
  }
});

//点击生成触发事件
$('#btn-generate').on('click',function(){
  var width = 0;
  var height = 0;
  var imageFormat = $('#image-format').find('option:selected').val();
  var isCompress = $("input[name='radio-compress']:checked").val();
  //根据选择的类型获取图片尺寸
  var itemId = $('#size-catalog').find('option:selected').val();
  if(itemId == 0){
    width = $('#size-item').find('option:selected').attr("width");
    height = $('#size-item').find('option:selected').attr("height");
  }else{
    width = $('#input-width').val();
    height = $('#input-height').val();
  }
  //发送到主进程处理
  ipcRenderer.send('startGenerate',imagePath,imageFormat,isCompress,width,height);
});