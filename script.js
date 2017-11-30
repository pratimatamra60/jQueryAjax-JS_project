var Json_file = $('body').data('json')
console.log(Json_file);

$.getJSON(Json_file,function(data,textStatus,jqXHR){
	console.log("got a server response");
  CreateTableFromJSON(data.results[0].members);
  FilterTable(data.results[0].members);
   
});

  function CreateTableFromJSON(members){
    var memlength = members.length;
    var tableRows = []; //to push all data in array and render data at once
    var table = $("#tableData tbody");
   for (var i = 0; i < memlength; i++) {
          var member = members[i];
          var full_name;
          var row = $("<tr>");

          if(member.middle_name==null){
            full_name = member.first_name +" "+ member.last_name;
          }
          else{
              full_name = member.first_name + " "+member.middle_name+" "+member.last_name;
          }

          var link = $("<td>").appendTo(row);
          $("<a>").attr("href",member.url).attr("target","_blank").text(full_name).appendTo(link);// target:_blank opens page in newtab
          $("<td>").text(member.party).appendTo(row);
          $("<td>").text(member.state).appendTo(row);
          $("<td>").text(member.seniority).appendTo(row);
          $("<td>").text(member.votes_with_party_pct).appendTo(row);
          tableRows.push(row);

          }
          table.append(tableRows);
     }


 
 
 
 
 