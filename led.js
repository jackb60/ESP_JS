update_raw = function(){
  d=document.getElementById('pxl').value;
  a=parseInt(document.getElementById('rd').value);
  b=parseInt(document.getElementById('gr').value);
  c=parseInt(document.getElementById('bl').value);
  console.log(a,b,c);
  console.log(a>b);
  console.log(a>c);
  if(a>=b && a>=c){
    console.log('scale to a');
    sf=255/a
  }
  else if(b>=a && b>=c){
    console.log('scale to b');
    sf=255/b
  }
  else if(c>=a && c>=b){
    console.log('scale to c');
    sf=255/c
  }
  a=Math.round(a*sf);
  b=Math.round(b*sf);
  c=Math.round(c*sf);
  console.log(a,b,c);
  bffr=new Uint8Array([d,a,b,c]).buffer;
  fetch('/LED',{method:'POST',body:bffr});
}
cls=[[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255]];
aclr=-1;
divclick=function(element){
  if(element.style.border=="4px solid black"){
    element.style.border="";
  }
  else{
  element.style.border= "4px solid black";
  }
}

clrslct=function(element){
if(element.style.border=="4px solid black"){
  }
  else{
    for(i=0;i<6;i++){
    if(document.getElementById(i+20).style.border=="4px solid black"){
  document.getElementById(i+20).style.border= "";
    }
    
    }element.style.border="4px solid black";
    aclr=element.id-20;
}}


update_rect = function(){
  for(i=0;i<20;i++){
    if(document.getElementById(i).style.border=="4px solid black"){
      console.log(i);
      console.log('send^^');
      bffr=new Uint8Array([i,cls[aclr][0],cls[aclr][1],cls[aclr][2]]).buffer;
      fetch('/LED',{method:'POST',body:bffr});
      document.getElementById(i).style.border="";
  }
}}
rdiv=document.getElementById('Rectangles');
for(i=0;i<10;i++){
  rdiv.innerHTML+="<div id='"+i+"'></div>";
  cdiv=document.getElementById(i);
  cdiv.style.position='absolute';
  cdiv.style.left=(675-(75*i)).toString()+"px";
  cdiv.style.width='50px';
  cdiv.style.height='50px';
  cdiv.style.background='blue';
  cdiv.setAttribute('onclick','divclick(this)');
}
for(i=0;i<6;i++){
  rdiv.innerHTML+="<div id='"+(i+20)+"'></div>";
  cdiv=document.getElementById(i+20);
  cdiv.style.position='absolute';
  cdiv.style.left=(150+(75*i)).toString()+"px";
  cdiv.style.top="150px";
  cdiv.style.width='50px';
  cdiv.style.height='50px';
  cdiv.style.background='rgb('+ cls[i][0] +','+ cls[i][1] + ','+ cls[i][2]+')';
  cdiv.setAttribute('onclick','clrslct(this)');
}
for(i=10;i<20;i++){
  rdiv.innerHTML+="<div id='"+i+"'></div>";
  cdiv=document.getElementById(i);
  cdiv.style.position='absolute';
  cdiv.style.left=(75*(i-10)).toString()+"px";
  cdiv.style.top="300px";
  cdiv.style.width='50px';
  cdiv.style.height='50px';
  cdiv.style.background='blue';
  cdiv.setAttribute('onclick','divclick(this)');
}
