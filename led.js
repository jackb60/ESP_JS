update_raw = function(){
  a=document.getElementById('pxl');
  b=document.getElementById('rd');
  c=document.getElementById('gr');
  d=document.getElementById('bl');
  bffr=new Uint8Array([a,b,c,d]).buffer;
  fetch('/LED',fetch('/LED',{method:'POST',body:bffr}))
}
