/* =====================================================================
   PixSprites: motor de sprites en pixel art compartido por la ciudad y
   la tanda de penaltis.

   Cómo funciona:
   1. Se dibuja el muñeco con formas (elipses, rectángulos, mechones)
      en un lienzo pequeño, siempre con colores planos.
   2. Cada pixel se ajusta al color más cercano de los usados, para
      quitar el difuminado de los bordes.
   3. Se añade un contorno de 1 pixel con una versión oscura del color
      de al lado (contorno "de color", como en los sprites de combate).
   El resultado se guarda en caché y se pinta agrandado sin suavizar.
   ===================================================================== */
(function(){
"use strict";
var TAU=Math.PI*2;

function toRGB(col){
  if(col.charAt(0)==="#"){
    var h=col.slice(1);
    if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    var n=parseInt(h,16);
    return [n>>16,(n>>8)&255,n&255];
  }
  var m=col.match(/[\d.]+/g);
  return [+m[0],+m[1],+m[2]];
}
function shade(col,p){
  var c=toRGB(col),t=p<0?0:255,k=Math.abs(p);
  return "rgb("+Math.round((t-c[0])*k+c[0])+","+Math.round((t-c[1])*k+c[1])+","+Math.round((t-c[2])*k+c[2])+")";
}
function rrect(c,x,y,w,h,r){
  r=Math.max(0,Math.min(r,w/2,h/2));
  c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);
  c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();
}
function mkBuf(w,h){var c=document.createElement("canvas");c.width=w;c.height=h;return c;}

/* dibuja, limpia los bordes y pone contorno de color */
function bakeSprite(w,h,draw,o){
  o=o||{};
  var cv=mkBuf(w,h),c=cv.getContext("2d");
  var pal=[],seen={};
  function F(col){
    c.fillStyle=col;c.strokeStyle=col;
    if(!seen[col]){seen[col]=1;pal.push(toRGB(col));}
  }
  draw(c,F);
  var im=c.getImageData(0,0,w,h),d=im.data,n=w*h,i,k;
  var snap=(o.snap!==false)&&pal.length>0;
  for(i=0;i<n;i++){
    var j=i*4;
    if(d[j+3]<110){d[j+3]=0;continue;}
    if(snap){
      var r=d[j],g=d[j+1],b=d[j+2],best=0,bd=1e9;
      for(k=0;k<pal.length;k++){
        var p=pal[k],dr=p[0]-r,dg=p[1]-g,db=p[2]-b,dd=dr*dr+dg*dg+db*db;
        if(dd<bd){bd=dd;best=k;}
      }
      d[j]=pal[best][0];d[j+1]=pal[best][1];d[j+2]=pal[best][2];
    }
    d[j+3]=255;
  }
  if(o.outline!==false){
    var src=new Uint8ClampedArray(d),f=o.outDark||0.36,row=w*4;
    for(var y=0;y<h;y++)for(var x=0;x<w;x++){
      i=(y*w+x)*4;
      if(src[i+3])continue;
      var nb=-1;
      if(x>0&&src[i-4+3])nb=i-4;
      else if(x<w-1&&src[i+4+3])nb=i+4;
      else if(y<h-1&&src[i+row+3])nb=i+row;
      else if(y>0&&src[i-row+3])nb=i-row;
      if(nb<0)continue;
      d[i]=src[nb]*f;d[i+1]=src[nb+1]*f;d[i+2]=Math.min(255,src[nb+2]*f+10);d[i+3]=255;
    }
  }
  c.putImageData(im,0,0);
  return cv;
}

/* óvalo de pixeles (plataformas, sombras) */
function pixEllipse(b,cx,cy,rx,ry,col){
  b.fillStyle=col;
  for(var y=-ry;y<=ry;y++){
    var ww=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/(ry*ry))));
    if(ww>0)b.fillRect(Math.round(cx-ww),Math.round(cy+y),ww*2,1);
  }
}

/* ======================= SPRITE GRANDE (tipo combate) =======================
   Lienzo de 84x116. Los pies quedan en la fila 111 y el centro en la columna 42.
   pose: {legs:"idle"|"run1"|"run2"|"kick", arms:"down"|"up", rot:radianes, gk:true}
   ========================================================================== */
var bigCache={},bigCount=0;
function poseKey(p){return p?[p.legs||"",p.arms||"",p.rot||0,p.gk?1:0,p.size||1].join(","):"";}
function bigSprite(look,kit,num,back,pose){
  var key=[look.skin,look.hair,look.style,look.beard?1:0,kit.jersey,kit.shorts,kit.socks,kit.trim,
    kit.design,kit.boot||"",kit.bootAcc||"",num,back?1:0,poseKey(pose)].join("|");
  var s=bigCache[key];
  if(!s){
    s=bakeBig(look,kit,num,back,pose||{});
    bigCache[key]=s;
    if(++bigCount>300){bigCache={};bigCount=0;}
  }
  return s;
}
function bakeBig(look,kit,num,back,pose){
  var rot=pose.rot||0,sz=pose.size||1;
  var W=Math.ceil((rot?140:84)*sz),H=Math.ceil((rot?140:116)*sz);
  return bakeSprite(W,H,function(c,F){
    c.translate(W/2,H/2);if(rot)c.rotate(rot);if(sz!==1)c.scale(sz,sz);c.translate(-40,-48);
    var sk=look.skin,sk2=shade(sk,-0.2),sk3=shade(sk,0.16),sk4=shade(sk,-0.4);
    var h1=look.hair,h2=shade(h1,-0.32),h3=shade(h1,0.4),h4=shade(h1,-0.56);
    var je=kit.jersey,je2=shade(je,-0.3),je3=shade(je,0.24),je4=shade(je,-0.5);
    var sh=kit.shorts,sh2=shade(sh,-0.26),sh3=shade(sh,0.2);
    var so=kit.socks,so2=shade(so,-0.28),tr=kit.trim;
    var bo=kit.boot?shade(kit.boot,-0.35):"#22232b",bo2=kit.boot||"#3c3f4c",bo3=kit.boot?shade(kit.boot,0.35):"#6a7086";
    var bAcc=kit.bootAcc||null;
    var st=look.style,dsg=kit.design||"plain";
    var shd=(dsg==="stripes"||dsg==="hoops"||dsg==="halves")?je4:je2;

    function E(x,y,rx,ry,col){F(col);c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}
    function R(x,y,w,h,col){F(col);c.fillRect(x,y,w,h);}
    function RR(x,y,w,h,r,col){F(col);rrect(c,x,y,w,h,r);c.fill();}
    function PG(pts,col){
      F(col);c.beginPath();c.moveTo(pts[0],pts[1]);
      for(var i=2;i<pts.length;i+=2)c.lineTo(pts[i],pts[i+1]);
      c.closePath();c.fill();
    }
    /* mechón: base ancha que acaba en punta */
    function lobe(bx,by,tx,ty,w,col){
      var dx=tx-bx,dy=ty-by,L=Math.sqrt(dx*dx+dy*dy)||1,nx=-dy/L,ny=dx/L;
      F(col);c.beginPath();
      c.moveTo(bx+nx*w/2,by+ny*w/2);
      c.quadraticCurveTo(bx+dx*0.55+nx*w*0.32,by+dy*0.55+ny*w*0.32,tx,ty);
      c.quadraticCurveTo(bx+dx*0.55-nx*w*0.32,by+dy*0.55-ny*w*0.32,bx-nx*w/2,by-ny*w/2);
      c.closePath();c.fill();
    }
    /* mechón con sombra a la derecha y brillo a la izquierda */
    function clump(bx,by,tx,ty,w){
      var dx=tx-bx,dy=ty-by,L=Math.sqrt(dx*dx+dy*dy)||1,nx=-dy/L,ny=dx/L;
      if(nx<0){nx=-nx;ny=-ny;}
      lobe(bx,by,tx,ty,w,h1);
      lobe(bx+nx*w*0.24,by+ny*w*0.24,tx+nx*0.5,ty+ny*0.5,w*0.46,h2);
      lobe(bx-nx*w*0.2,by-ny*w*0.2,bx+dx*0.6-nx*w*0.1,by+dy*0.6-ny*w*0.1,w*0.22,h3);
    }
    function curl(x,y,rx,ry){
      E(x,y,rx,ry,h1);
      E(x+rx*0.3,y+ry*0.3,rx*0.55,ry*0.55,h2);
      R(Math.round(x-rx*0.5),Math.round(y-ry*0.6),2,1,h3);
    }
    function clipBelow(maxY){c.beginPath();c.rect(-30,-40,140,maxY+40);c.clip();}
    function shortCap(){
      c.save();clipBelow(21.5);
      E(40,20,14.5,11,h1);
      c.beginPath();c.ellipse(40,20,14.5,11,0,0,TAU);c.clip();
      R(46,6,14,16,h2);R(29,10,8,2,h3);R(31,8,4,1,h3);
      c.restore();
    }
    function sideburns(){
      PG([26.5,20,30,20,29.5,30,27,29],h2);
      PG([53.5,20,50,20,50.5,30,53,29],h2);
    }
    function stipple(y0,y1){
      for(var yy=y0;yy<y1;yy+=3)for(var xx=29;xx<52;xx+=3)R(xx+((yy/3)%2),yy,1,1,h4);
    }
    function crest(){
      clump(36,15,32,-3,8);clump(44,15,48,-3,8);clump(40,14,40,-8,9);
      E(40,15,5,4,h1);
    }
    function spikesBack(){
      [200,222,246,270,294,318,340].forEach(function(a){
        var ra=a*Math.PI/180,cx=Math.cos(ra),cy=Math.sin(ra);
        clump(40+cx*9,19+cy*7,40+cx*28,19+cy*24,10);
      });
    }
    function afroMass(){
      E(40,16,23,20,h1);
      for(var a=140;a<=400;a+=20){
        var ra=a*Math.PI/180,px=40+Math.cos(ra)*21,py=16+Math.sin(ra)*18;
        E(px,py,6,5.5,h1);E(px+2,py+2,3.4,3,h2);
      }
      E(24,28,7,10,h1);E(56,28,7,10,h1);E(58,30,4,7,h2);
      E(31,4,6,2.2,h3);E(27,8,2.4,1.6,h3);
    }
    /* pelo que queda detrás del cuerpo (vista de frente) */
    function hairBack(){
      if(st==="long"){
        RR(24,14,10,38,4,h1);RR(46,14,10,38,4,h1);
        R(51,16,4,34,h2);R(26,16,2,32,h3);
        clump(29,46,27,57,8);clump(51,46,53,57,8);
      }else if(st==="ponytail"){
        clump(50,16,66,46,10);
      }else if(st==="afro"){
        afroMass();
      }else if(st==="spiky"){
        spikesBack();
      }
    }
    /* pelo por delante de la cara */
    function hairFront(){
      if(st==="bald")return;
      if(st==="buzz"){
        c.save();clipBelow(22);E(40,21,13.5,10.5,h1);
        c.beginPath();c.ellipse(40,21,13.5,10.5,0,0,TAU);c.clip();
        R(46,9,12,14,h2);stipple(12,21);R(31,12,6,1,h3);
        c.restore();return;
      }
      if(st==="curly"){
        c.save();clipBelow(22);E(40,20,14,10.5,h1);c.restore();
        for(var a=190;a<=350;a+=20){
          var ra=a*Math.PI/180;curl(40+Math.cos(ra)*14,20+Math.sin(ra)*11,4.3,4);
        }
        [30,35,40,45,50].forEach(function(x){curl(x,21,3.2,2.8);});
        return;
      }
      if(st==="afro"){
        c.save();clipBelow(20);E(40,16,15,8,h1);c.restore();
        [29,34.5,40,45.5,51].forEach(function(x){curl(x,15,4.6,4);});
        return;
      }
      if(st==="mohawk"){
        c.save();clipBelow(22);E(40,21,13.5,10.5,h2);
        c.beginPath();c.ellipse(40,21,13.5,10.5,0,0,TAU);c.clip();
        stipple(12,21);c.restore();
        crest();return;
      }
      shortCap();
      if(st==="long"){
        clump(35,12,31,6,7);clump(44,11,48,6,7);
        clump(30,15,28,27,7);clump(35,14,38,22,8);clump(44,14,46,22,8);clump(51,15,53,27,7);
        clump(27,22,24,42,6);clump(53,22,56,42,6);
      }else if(st==="spiky"){
        clump(31,16,28,24,7);clump(37,15,36,24,7);clump(43,15,45,23,7);clump(50,16,53,24,6);
        sideburns();
      }else if(st==="ponytail"){
        clump(31,15,27,22,7);clump(38,13,45,19,8);clump(46,14,52,21,7);
        sideburns();R(53,17,4,4,"#e0405a");
      }else{
        clump(35,12,31,6,7);clump(44,11,48,6,7);
        clump(30,17,27,23.5,7);clump(35,15,33,23,7);clump(41,15,41,23,7);
        clump(47,15,49,23,7);clump(51,17,54,24,6);
        sideburns();
      }
    }
    /* pelo visto de espaldas */
    function hairBackView(){
      if(st==="bald"){E(36,15,4,2,shade(sk,0.3));return;}
      if(st==="afro"){afroMass();return;}
      if(st==="spiky")spikesBack();
      if(st==="long"){
        RR(26,20,28,34,8,h1);R(46,22,8,30,h2);R(29,24,2,26,h3);
        clump(30,48,29,58,8);clump(37,50,37,60,8);clump(43,50,43,60,8);clump(50,48,51,58,8);
      }
      var base=(st==="mohawk")?h2:h1;
      c.save();clipBelow(st==="buzz"?34:36);
      E(40,23,st==="buzz"?13:14.5,st==="buzz"?13:14,base);
      c.beginPath();c.ellipse(40,23,14.5,14,0,0,TAU);c.clip();
      R(46,6,14,32,st==="mohawk"?h4:h2);
      if(st==="buzz"||st==="mohawk")stipple(10,34);
      R(30,10,8,2,h3);R(32,8,4,1,h3);
      c.restore();
      if(st!=="buzz"&&st!=="mohawk"){
        clump(31,29,30,37,6);clump(36,30,36,38,6);clump(42,30,42,38,6);clump(48,29,49,37,6);
      }
      if(st==="short"){clump(35,12,31,6,7);clump(44,11,48,6,7);}
      if(st==="curly"){
        for(var yy=12;yy<=32;yy+=6)for(var xx=30;xx<=50;xx+=6)curl(xx+((yy/6)%2?3:0),yy,3.4,3.2);
        for(var a=190;a<=350;a+=20){
          var ra=a*Math.PI/180;curl(40+Math.cos(ra)*14,20+Math.sin(ra)*11,4.3,4);
        }
      }
      if(st==="mohawk")crest();
      if(st==="ponytail"){clump(40,28,40,56,10);R(37,27,6,3,"#e0405a");}
    }

    /* ---- piernas ---- */
    var lift={idle:[0,0],run1:[5,0],run2:[0,5],kick:[0,9]}[pose.legs||"idle"]||[0,0];
    function leg(lx,up){
      RR(lx,69,8,12,3,sk);R(lx,70,2,10,sk3);R(lx+5,70,3,10,sk2);
      RR(lx,80-up,8,13,2,so);R(lx+5,80-up,3,13,so2);R(lx,83-up,8,2,tr);R(lx,86-up,8,1,so2);
      RR(lx-1,92-up,10,7,3,bo2);R(lx-1,96-up,10,3,bo);R(lx+1,93-up,4,1,bo3);
      if(bAcc)R(lx,95-up,8,1,bAcc);
      if(!back)R(lx+2,94-up,4,1,"#e8e8ee");
      else{R(lx,99-up,2,1,bo3);R(lx+5,99-up,2,1,bo3);}
    }
    /* ---- brazos ---- */
    function limb(x,y,ang,len,w,col,hi,lo){
      c.save();c.translate(x,y);c.rotate(ang);
      F(col);rrect(c,-w/2,0,w,len,w/2.2);c.fill();
      if(hi){F(hi);c.fillRect(-w/2+1,1,1.6,len-2);}
      if(lo){F(lo);c.fillRect(w/2-2.6,1,1.6,len-2);}
      c.restore();
    }
    function arm(side){
      var up=pose.arms==="up",sx=side<0?27:53,sy=42;
      var a=up?2.45:0.16;if(side>0)a=-a;
      var dx=-Math.sin(a),dy=Math.cos(a);
      limb(sx,sy,a,12,9,je,je3,je2);
      var ex=sx+dx*10,ey=sy+dy*10;
      c.save();c.translate(ex,ey);c.rotate(a);F(tr);c.fillRect(-4.5,-1,9,2);c.restore();
      limb(ex,ey,a,13,7,sk,sk3,sk2);
      var hx=ex+dx*14,hy=ey+dy*14;
      if(pose.gk){
        E(hx,hy,5.2,5.2,"#f4f7ff");E(hx+1.5,hy+1.5,2.6,2.6,"#c3cee3");
        R(Math.round(hx-4),Math.round(hy-1),8,1,"#7fb2ff");
      }else{
        E(hx,hy,4.2,3.8,sk);E(hx+1,hy+1,2.4,2,sk2);
      }
    }
    /* ---- tronco ---- */
    function torso(){
      F(je);rrect(c,25,38,30,26,7);c.fill();
      c.save();rrect(c,25,38,30,26,7);c.clip();
      if(dsg==="stripes")[29,35,41,47,53].forEach(function(x){R(x,38,3,26,je2);});
      else if(dsg==="hoops")[44,51,58].forEach(function(y){R(25,y,30,3,je2);});
      else if(dsg==="sash")PG([25,58,25,52,55,38,55,44],tr);
      else if(dsg==="halves")R(40,38,15,26,je2);
      R(49,38,6,26,shd);R(27,40,4,20,je3);
      R(31,56,7,1,shd);R(42,52,6,1,shd);R(36,47,1,5,shd);
      R(25,61,30,3,shd);
      c.restore();
      if(!back){
        PG([34,38,46,38,40,45],tr);PG([36,38,44,38,40,43],sk2);
        E(33.5,45,2.4,2.8,tr);E(33.8,45.2,1.1,1.4,je2);
        F("#ffffff");c.font="bold 10px Verdana";c.textAlign="center";c.fillText(String(num),45,57);
      }else{
        R(33,38,14,3,tr);
        F("#ffffff");c.font="bold 17px Verdana";c.textAlign="center";c.fillText(String(num),40,59);
      }
    }
    function shorts(){
      RR(28,60,24,14,4,sh);R(30,61,7,2,sh3);
      R(28,70,24,3,sh2);R(28,62,2,10,tr);R(50,62,2,10,tr);
      R(39,65,2,9,sh2);
    }
    function head(){
      RR(35,33,10,9,3,sk2);R(35,38,10,3,sk4);
      E(28,27,2.6,3.6,back?sk2:sk);E(52,27,2.6,3.6,sk2);
      if(!back){E(28.3,27,1.2,2,sk2);E(51.7,27,1.2,2,sk4);}
      E(40,25,12,13,sk);
      c.save();c.beginPath();c.ellipse(40,25,12,13,0,0,TAU);c.clip();
      R(46,10,8,30,sk2);R(28,14,3,18,sk3);E(40,39,11,4,sk2);
      c.restore();
    }
    function face(){
      var lash="#241815",iris="#5a3a22";
      R(31,22,7,2,h4);R(42,22,7,2,h4);R(32,21,5,1,h4);R(43,21,5,1,h4);
      E(35,27,3.4,2.7,"#ffffff");E(45,27,3.4,2.7,"#ffffff");
      E(35.8,27.3,2,2.6,iris);E(45.8,27.3,2,2.6,iris);
      R(35,26,2,3,"#141018");R(45,26,2,3,"#141018");
      R(34,25,1,1,"#ffffff");R(44,25,1,1,"#ffffff");
      R(31,24,8,1,lash);R(41,24,8,1,lash);
      R(40,28,1,4,sk2);R(38,31,4,1,sk4);
      if(look.beard){
        c.save();c.beginPath();c.ellipse(40,25,12,13,0,0,TAU);c.clip();
        E(40,37,12,6.5,h2);R(36,32,8,2,h2);R(30,30,2,5,h2);R(48,30,2,5,h2);
        c.restore();
        R(37,34,6,1,"#5a2525");
      }else{
        R(37,34,6,1,"#7d3434");R(36,33,1,1,"#7d3434");R(43,33,1,1,"#7d3434");R(38,35,4,1,sk2);
      }
    }

    if(!back)hairBack();
    leg(30,lift[0]);leg(42,lift[1]);
    shorts();
    arm(-1);arm(1);
    torso();
    head();
    if(!back){face();hairFront();}
    else hairBackView();
  },{outDark:0.36});
}

window.PixSprites={
  toRGB:toRGB,shade:shade,mkBuf:mkBuf,bakeSprite:bakeSprite,
  bigSprite:bigSprite,pixEllipse:pixEllipse
};
})();
