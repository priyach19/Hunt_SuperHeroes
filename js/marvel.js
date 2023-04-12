//------------To fetch all the characters from marvel api-------------
var marvel={
     render:function(){
         var url="http://gateway.marvel.com/v1/public/characters?ts=1&apikey=ec1a9b92b8914c79a463d25a9a4289dc&hash=2f5b3ab8ca67ce9689d0f1180ae05b3f";
         var footer=document.getElementById("footer");
         var message=document.getElementById("message");
         var marvelContainer=document.getElementById("marvel-container");
         $.ajax({
             url:url,
             type:"GET",
             beforeSend:function(){
                 message.innerHTML="Loading...";
             },
             complete:function(){
                 message.innerHTML="Successfully Done!";
             },
 
             success:function(data){
                 footer.innerHTML=data.attributionText;
                 var string="";
                 string+="<div class='row'>";
                 for(i=0;i<data.data.results.length;i++){
                     var item=data.data.results[i];
                     //console.log(item);
                     string+="<div class='col-md-3'>";
                     string+=" <a href='"+item.urls[0].url+"'target='_blank'>";
                     string+=" <img src='"+item.thumbnail.path+"/portrait_fantastic."+item.thumbnail.extension+"'/>";
                     string+=" </a>";
                     string+=" <h3>"+item.name+"</h3>";
                     string+=" </div>";
                     if((i+1%4==0)){
                         string+="</div>";
                         string+="<div class='row'>";
                     }
                 }
                 marvelContainer.innerHTML=string;
             },
             error:function(){
                 message.innerHTML="we are sorry"
             }
         })
     
     }
 
 };
 
 marvel.render();
 