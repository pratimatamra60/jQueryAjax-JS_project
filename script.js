var JsonFile = $('body').data('json')
//console.log(Json_file);
var members = [];
var filter = {
    parties: {
        D: true,
        R: true,
        I: true
    },
    activeState: ""
}

$.getJSON(JsonFile, function(data, textStatus, jqXHR) {
    console.log("got a server response");
    //CreateTableFromJSON(data.results[0].members);
    members = data.results[0].members;
    createDropdown();
    updateTable();
    findNoOfRep();
    leastLoyal();
    mostLoyal();
    leastEng();
    mostEng();

});

function updateTable() {
    $("#tableData tbody").html("");
    CreateTableFromJSON();
}

//-----------------------
//------------------------create dropdownMenu--------------------------------
function createDropdown() {
    var select = $("#stateFilter");
    var state_new = [];
    var dprodownList = [];
    for (var i = 0; i < members.length; i++) {
        var member = members[i];
        state_new.push(member.state);
    }
    state_new = Array.from(new Set(state_new)).sort();
    for (var i = 0; i < state_new.length; i++) {
        var option = $("<option value= '" + (state_new[i]) + "'>")
        option.text(state_new[i]);
        dprodownList.push(option);
    }
    select.append(dprodownList);

}

//---------------------------------------dropdown filter-----------------------------------
$("#stateFilter").on("change", function() {

    var selectedState = $(this).val();

    filter.activeState = selectedState;
    updateTable();
    //console.log(filter);
});

//-------------------------create Table------------------------------------
function CreateTableFromJSON() {
    var memLength = members.length;
    var tableRows = []; //to push all data in array and render data at once
    var table = $("#tableData tbody");
    for (var i = 0; i < memLength; i++) {
        var member = members[i];
        var full_name;
        if (filter.parties[member.party]) { // checking for the party

            if (member.state == filter.activeState || filter.activeState == "") {

                var row = $("<tr class =" + member.party + ">"); // creating table row with class name so it can be used for filter purpose
                // var row = $("<tr>"); // create tr and assign it to row

                //---------------join fname mname and Lname-----------------------------
                if (member.middle_name == null) {
                    full_name = member.first_name + " " + member.last_name;
                } else {
                    full_name = member.first_name + " " + member.middle_name + " " + member.last_name;
                }

                //------------------------------------------------------------------------
                var link = $("<td>").appendTo(row);
                //$("<a>",{href:member.url}).text(full_name).appendTo(link);// down is the proper way to define attribute 
                $("<a>").attr("href", member.url).attr("target", "_blank").text(full_name).appendTo(link); // target:_blank opens page in newtab
                $("<td>").text(member.party).appendTo(row);
                $("<td>").text(member.state).appendTo(row);
                $("<td>").text(member.seniority).appendTo(row);
                $("<td>").text(member.votes_with_party_pct).appendTo(row);
                tableRows.push(row);
            }
        }
        //$("table tbody").append(row);// to render data at one do this step outside loop
    }
    table.append(tableRows);
}

//-----------checkboxFilter----------------------------------------

$(".partySelector").on("change", function() {

    var party = $(this).attr("value") //  D R or I

    var checked = $(this).prop("checked") // true or false

    filter.parties[party] = checked
    updateTable();
    console.log(filter)

});


//--------------------read Less and more----------
$("#toggle").click(function() {
    var elem = $("#toggle").text();
    if (elem == "Read More") {
        //slide down when btn is in the read more state
        $("#demo").slideDown();
        $("#toggle").text("Read Less");

    } else {
        //Slide up when btn is in the read less state
        $("#toggle").text("Read More");
        $("#demo").slideUp();
    }
});

//----------------------------------------------------------
var statistics = {
    "representatives": {
        "numOfD": 0,
        "numOfR": 0,
        "numOfI": 0
    },
    "votes": {
        "votePerD": 0,
        "votePerR": 0,
        "votePerI": 0
    }

}

function findNoOfRep() {
    var addVoteR = 0;
    var addVoteD = 0;
    var addVoteI = 0;
    var countR, countD, countI = 0;

    for (var i = 0; i < members.length; i++) {
        var member = members[i];

        if (member.party == "R") {
            countR = ++statistics.representatives.numOfR;

            addVoteR += member.votes_with_party_pct;
            var averageVoteR = (addVoteR / countR).toFixed(2);

        } else if (member.party == "D") {
            countD = ++statistics.representatives.numOfD;

            addVoteD += member.votes_with_party_pct;
            var averageVoteD = (addVoteD / countD).toFixed(2);
        } else {
            var countI = ++statistics.representatives.numOfI;

            addVoteI += member.votes_with_party_pct;
            var averageVoteI = (addVoteI / countI).toFixed(2);
        }
    }

    var total = countR + countD + countI;

    $("#attendance tr.rep td").eq(1).html(countR);
    $("#attendance tr.dem td").eq(1).html(countD);
    $("#attendance tr.ind td").eq(1).html(countI);
    $("#attendance tr.total td").eq(1).html(total);

    $("#attendance tr.rep td").eq(2).html(averageVoteR);
    $("#attendance tr.dem td").eq(2).html(averageVoteD);
    $("#attendance tr.ind td").eq(2).html(averageVoteI);

}
//--------------------Loyalty-------------------------------

function leastLoyal() {
    var count = 0;
    var tableRows = [];
    var count = members.length;
    var ten_per = count * 0.1;
    

      var sorted = members.sort(function(a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct
    });

      for (var i = 0; i < ten_per; i++) {
        var row = $("<tr>"); // create tr and assign it to row

        //---------------join fname mname and Lname-----------------------------
        if (sorted[i].middle_name == null) {
            full_name = sorted[i].first_name + " " + sorted[i].last_name;
        } else {
            full_name = sorted[i].first_name + " " + sorted[i].middle_name + " " + sorted[i].last_name;
        }
        numOfVotes = (sorted[i].total_votes * sorted[i].votes_with_party_pct/100).toFixed(2);
        //------------------------------------------------------------------------
        $("<td>").text(full_name).appendTo(row);
        $("<td>").text(numOfVotes).appendTo(row);
        $("<td>").text(sorted[i].votes_with_party_pct).appendTo(row);
        tableRows.push(row);

    }
     $("#leastLoyal tbody").append(tableRows);
}

function mostLoyal() {
    var count = 0;
    var tableRows = [];
    
    var count = members.length;
    var ten_per = count * 0.1;
  
    
      var sorted = members.sort(function(a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct
    });
      //console.log(sorted);
      for (var i = 0; i < ten_per; i++) {
        var row = $("<tr>"); // create tr and assign it to row

        //---------------join fname mname and Lname-----------------------------
        if (sorted[i].middle_name == null) {
            full_name = sorted[i].first_name + " " + sorted[i].last_name;
        } else {
            full_name = sorted[i].first_name + " " + sorted[i].middle_name + " " + sorted[i].last_name;
        }

        numOfVotes = (sorted[i].total_votes * sorted[i].votes_with_party_pct/100).toFixed(2);
        $("<td>").text(full_name).appendTo(row);
        $("<td>").text(numOfVotes).appendTo(row);
        $("<td>").text(sorted[i].votes_with_party_pct).appendTo(row);
        tableRows.push(row);
    }
     $("#mostLoyal tbody").append(tableRows);
}
//-----------------------------attendance------------------------------
function leastEng() {
    var count = 0;
    var tableRows = [];
    var count = members.length;
    var ten_per = count * 0.1;
    

      var sorted = members.sort(function(a, b) {
        return a.missed_votes_pct - b.missed_votes_pct
    });

      for (var i = 0; i < ten_per; i++) {
        var row = $("<tr>"); // create tr and assign it to row

        //---------------join fname mname and Lname-----------------------------
        if (sorted[i].middle_name == null) {
            full_name = sorted[i].first_name + " " + sorted[i].last_name;
        } else {
            full_name = sorted[i].first_name + " " + sorted[i].middle_name + " " + sorted[i].last_name;
        }

        //------------------------------------------------------------------------
        $("<td>").text(full_name).appendTo(row);
        $("<td>").text(sorted[i].missed_votes).appendTo(row);
        $("<td>").text(sorted[i].missed_votes_pct).appendTo(row);
        tableRows.push(row);

    }
     $("#leastEng tbody").append(tableRows);
}

function mostEng() {
    var count = 0;
    var tableRows = [];
    
    var count = members.length;
    var ten_per = count * 0.1;
  
    
      var sorted = members.sort(function(a, b) {
        return b.missed_votes_pct - a.missed_votes_pct
    });
      for (var i = 0; i < ten_per; i++) {
        var row = $("<tr>"); // create tr and assign it to row

        //---------------join fname mname and Lname-----------------------------
        if (sorted[i].middle_name == null) {
            full_name = sorted[i].first_name + " " + sorted[i].last_name;
        } else {
            full_name = sorted[i].first_name + " " + sorted[i].middle_name + " " + sorted[i].last_name;
        }

        $("<td>").text(full_name).appendTo(row);
        $("<td>").text(sorted[i].missed_votes).appendTo(row);
        $("<td>").text(sorted[i].missed_votes_pct).appendTo(row);
        tableRows.push(row);
    }
     $("#mostEng tbody").append(tableRows);
}