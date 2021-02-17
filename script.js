/*! canvas-to-bmp version 1.0 ALPHA
    (c) 2015 Ken "Epistemex" Fyrstenberg
    MIT License (this header required)
*/
//Modified for uncompressed 24bit bitmaps
rgb24Array = function(rgbList){
var i = 0;
var j = 0;
while( i < 1){
  rgb24 = new Uint8Array(3);
    rgb24[0] = rgbList>>0;
    rgb24[1] = rgbList>>8;
    rgb24[2] = rgbList>>16;
i++;

    return(rgb24);
}
}
var CanvasToBMP = {

  /**
   * Convert a canvas element to ArrayBuffer containing a BMP file
   * with support for 32-bit (alpha).
   *
   * Note that CORS requirement must be fulfilled.
   *
   * @param {HTMLCanvasElement} canvas - the canvas element to convert
   * @return {ArrayBuffer}
   */
  toArrayBuffer: function(canvas) {

    var w = canvas.width,
        h = canvas.height,
        w4 = w * 3,
        idata = canvas.getContext("2d").getImageData(0, 0, w, h),
        data32 = new Uint32Array(idata.data.buffer), // 32-bit representation of canvas
        stride=Math.floor((24 * w + 31) / 32) * 4, // row length incl. padding
        pixelArraySize = stride * h,                 // total bitmap size
        fileLength = 54 + pixelArraySize,           // header size is known + bitmap

        file = new ArrayBuffer(fileLength+1),//+297          // raw byte buffer (returned)
        view = new DataView(file),                   // handle endian, reg. width etc.
        pos = 0, x, y = 0, p, s = 0, a, v;
//write ss #
       view.setUint8(pos, parseInt(document.getElementById('ssn').value));
       pos+=1;
    // write file header
   
    setU16(0x4d42);          // BM
    setU32(fileLength);      // total length
    pos += 4;                // skip unused fields
    setU32(54);            // offset to pixels

    // DIB header
    setU32(40);             // header size
    setU32(w);
   setU32(-h);
    setU16(1);               // 1 plane
    setU16(24);              // 32-bits (RGBA)
    setU32(0);
              // no compression (BI_BITFIELDS, 3)
    setU32(pixelArraySize);  // bitmap size incl. padding (stride x height)
    setU32(2835);            // pixels/meter h (~72 DPI x 39.3701 inch/m)
    setU32(2835);            // pixels/meter v
    pos += 8;                // skip color/important colors
    //setU32(0xff0000);        // red channel mask
   // setU32(0xff00);          // green channel mask
   // setU32(0xff);            // blue channel mask
  //  setU32(0xff000000);      // alpha channel mask
   // setU32(0x57696e20);      // " win" color space
    // bitmap data, change order of ABGR to BGRA
    while (y < h) {
      p = 0x36 + y * stride; // offset + stride x height
      //console.log(p);
      x = 0;
      i=0;
      while (x < w4) {
        v = data32[s++];                     // get ABGR
        a = v >>> 24;                        // alpha channel
        rgbarr=rgb24Array(v);
        view.setUint8(p + x, rgbarr[2]);
        view.setUint8(p + x+1, rgbarr[1]);
        view.setUint8(p + x+2, rgbarr[0]);
        x += 3;
        i++;
        
      }
      y++
    }

    return file;

    // helper method to move current buffer position
    function setU16(data) {view.setUint16(pos, data, true); pos += 2}
    function setU32(data) {view.setUint32(pos, data, true); pos += 4}
  },

  /**
   * Converts a canvas to BMP file, returns a Blob representing the
   * file. This can be used with URL.createObjectURL().
   * Note that CORS requirement must be fulfilled.
   *
   * @param {HTMLCanvasElement} canvas - the canvas element to convert
   * @return {Blob}
   */
  toBlob: function(canvas) {
    return new Blob([this.toArrayBuffer(canvas)], {
      type: "image/bmp"
    });
  },

  /**
   * Converts the canvas to a data-URI representing a BMP file.
   * Note that CORS requirement must be fulfilled.
   *
   * @param canvas
   * @return {string}
   */
  toDataURL: function(canvas) {
    var buffer = new Uint8Array(this.toArrayBuffer(canvas)),
        bs = "", i = 0, l = buffer.length;
    while (i < l) bs += String.fromCharCode(buffer[i++]);
    return "data:image/bmp;base64," + btoa(bs);
  }
};


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------


var imagea = new Image();
var canvas = document.querySelector("canvas"),
  w = canvas.width,
  h = canvas.height,
  ctx = canvas.getContext("2d"),
  img = new Image();
ctx.fillStyle = "black";
ctx.fillRect(0, 0, w, h);

function c_clear(){
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "black";
ctx.fillRect(0, 0, w, h);
}

function draw_img(iw,ih,is){
  if(iw/ih>3/2){
    ih*=480/iw
    iw*=480/iw
    ctx.drawImage(is,0,((1/2)*(h-ih)),iw,ih);
  }
  else if(iw/ih<3/2){
    iw*=320/ih
    ih*=320/ih
    ctx.drawImage(is,((1/2)*(w-iw)),0,iw,ih);
  }
  else{
    iw*=480/iw
    ih*=320/ih
    ctx.drawImage(is,0,0,iw,ih);
  }
}


recursive_onload=function(n_files,fls){
if(n_files>0){
  reader = new FileReader();
  reader.onload = function(e){
  imagea.src=e.target.result};

//d_file);
  imagea.onload = function(){
    c_clear();
  draw_img(imagea.width,imagea.height,imagea)
  fetch('/',{method:'POST',body:CanvasToBMP.toArrayBuffer(canvas)})
  a=document.getElementById('dwn');
  recursive_onload(n_files-1,fls);
}
reader.readAsDataURL(files[n_files-1]);}

}


function on_drop(){
files=document.getElementById('dropfile').files;
d_len=document.getElementById('dropfile').files.length;
//d_file = document.getElementById('dropfile').files[0];

/*for(b=0;b<d_len;b++){
  loaded=false;
  console.log("img");
  reader = new FileReader();
  reader.onload = function(e){
  imagea.src=e.target.result};


imagea.onload = function(){
  console.log('loaded');
loaded=true;
draw_img(imagea.width,imagea.height,imagea)
durl=CanvasToBMP.toDataURL(canvas);
img.src = durl;
document.body.appendChild(img);
a=document.getElementById('dwn');
a.href=durl;
a.click();*/
recursive_onload(d_len,files);

};










