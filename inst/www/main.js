$(document).ready(function() {
  
    $("#convert_button").attr("disabled", "disabled");
    $("#water_level").attr("disabled", "disabled");
    //automatically upload CSV file on change.
    $("#mipfile").on("change", function(){
  
      //verify that a file is selected
      if($("#mipfile")[0].files[0]){
  
        $("#successdiv").empty();
        $("#errordiv").empty()
  
        var req = ocpu.call("uploaddata", {
          mipfile : $("#mipfile")[0].files[0]   
        }, function(session){
          $("#convert_button").attr("href", session.getLoc())
          $("#water_level").removeAttr("disabled");
          $("#convert_button").removeAttr("disabled");
        }).fail(function(jqXHR){
          errormsg(jqXHR.responseText);
        })
      }
    });
    
    function successmsg(text){
      $("#successdiv").empty().append('<div class="alert alert-success alert-dismissable"><a href="#" class="close" data-dismiss="alert">&times;</a>' + text + '</div>');
    }
    
    function errormsg(text){
      $("#convert_button").attr("disabled", "disabled");
      $("#water_level").attr("disabled", "disabled");
      $("#errordiv").empty().append('<div class="alert alert-danger alert-dismissable"><a href="#" class="close" data-dismiss="alert">&times;</a>' + text + '</div>');
    }  
      
  function create_zip(data_file){
  
    $.get(file_names, function(f){
  
      var zip = new JSZip();
  
      zipname = f.split('\n')[0]
      filename = zipname.substr(0, f.split('\n')[0].length -8);
        $.get(data_file, function(d){
          zip.file(filename+'.mhp', d)
          zip.generateAsync({type:"blob"})
          .then(function(content) {
              saveAs(content, zipname);
          });
      });
    });   
  }
  
    $("#convert_button").on("click", function(){
  
      file_names = $(this).attr('href')+'files'
      
      var req = ocpu.call("mip_calculations", {
          mipfile : $("#mipfile")[0].files[0]   
        }, function(session){
          create_zip(session.getLoc()+'R/.val/tab')
        }).fail(function(jqXHR){
          errormsg(jqXHR.responseText);
      })
  
  
    });
      
    $(document).ajaxStart(function() {
      $(".progress").show();
    }); 
    
    $(document).ajaxStop(function() {
      $(".progress").hide();
    });
    
    
  });