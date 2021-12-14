float RANGE;
integer DURATION;
float FREQ;
float DAMAGE;

default
{
    timer()
    {
        if(!--DURATION)
            llSetTimerEvent(0);

        list agents = llGetAgentList(AGENT_LIST_REGION, []);
        integer len = llGetListLength(agents);
        vector pos = llGetPos();
        list agents_in_range;
        while(len--) {
            key agent = llList2Key(agents, len) ;
            if(agent == llGetOwner()) return;
            vector agent_pos = llList2Vector( llGetObjectDetails(agent, [OBJECT_POS])  , 0);
            if(llVecDist(pos, agent_pos) <= RANGE ) {
                agents_in_range += agent;
            }
        }
        llMessageLinked(LINK_THIS, 6, llList2Json(JSON_OBJECT, [
            "avatars", llList2Json(JSON_ARRAY, agents_in_range),
            "damage", DAMAGE,
            "uuid", llGetOwner()
        ]), "agents_in_range");
        llOwnerSay(llDumpList2String(agents_in_range, "\n"));
    }

    link_message( integer s, integer n, string m, key id )
    {
        if(n == 5 && id == "aoe_attack") {
            DURATION = (integer)llJsonGetValue(m, ["duration"]);
            FREQ = (float)llJsonGetValue(m, ["freq"]);
            DAMAGE = (float)llJsonGetValue(m, ["damage"]);
            RANGE = (float)llJsonGetValue(m, ["range"]);
            llSetTimerEvent(FREQ);
        }
    }

}
