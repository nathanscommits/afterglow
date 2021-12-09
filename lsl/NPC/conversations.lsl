key urlRequestId;
string url;
key HTTP_REQUEST_ID;
string URL = "https://afterglow.loca.lt";
// string URL = "https://afterglow2.loca.lt";
float VERSION = 0.1;
integer COOLDOWN = FALSE;

post(string url, string json){
    if(COOLDOWN) return;
    COOLDOWN = TRUE;
    llSetTimerEvent(2);
    HTTP_REQUEST_ID = llHTTPRequest(URL+url, 
        [HTTP_METHOD,"POST",
        HTTP_BODY_MAXLENGTH, 8000,
        HTTP_MIMETYPE,"application/json",
        HTTP_VERBOSE_THROTTLE,FALSE], 
        json
    );
    // llOwnerSay("posting: " + json);
}


integer CH = 0;
// string NPC = "example npc"; // these probably dont have to be seperate vars unless we want to name the spreadsheet differently to the in game name
string NAME;

default {

state_entry() {
    NAME = llGetObjectName();
    llListen(CH, "", "", "");
    llSetText("Call me '"+NAME+"' if you want to talk", <1,1,1>, 1);
}


listen( integer c, string n, key id, string m ) {
    m = llToLower(m);
    // llOwnerSay(m);
    if(!~llSubStringIndex(m, llToLower(NAME))) return;
    list timeList = llParseString2List(llGetTimestamp(), ["-", "T", ":", "Z"], []);
    // llOwnerSay(llDumpList2String(timeList, "\n"));
    post("/converse", llList2Json(JSON_OBJECT, [
        "message", m,
        "name", llKey2Name(llGetOwnerKey(id)),
        "uuid", llGetOwnerKey(id),
        "npc", llToLower(NAME),
        "timestamp", llList2String(timeList, 3)
    ]));
}

timer() {
    llSetTimerEvent(0);
    COOLDOWN = FALSE;
}

http_response( key id, integer status, list metadata, string body )
{
    if(id != HTTP_REQUEST_ID) return;
    list replys = llJson2List(body);
    llSay(0, llDumpList2String(replys, " "));
}

}
