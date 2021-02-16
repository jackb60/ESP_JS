update_raw = function(){
  a=document.getElementById('pxl').value;
  b=document.getElementById('rd').value;
  c=document.getElementById('gr').value;
  d=document.getElementById('bl').value;
  bffr=new Uint8Array([a,b,c,d]).buffer;
  fetch('/LED',fetch('/LED',{method:'POST',body:bffr}))
}
