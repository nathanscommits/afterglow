
INNIT(){
    llSensorRepeat("", "", ( PASSIVE | ACTIVE ), 20, PI, 1);
}
list SENSOR_OBJECTS;
vector LKL; 
default {
     state_entry()
    {
        llRequestExperiencePermissions(llGetOwner(), "");
    }

    experience_permissions(key agent_id)
    {
        llSay(0, "Experience permissions granted for " + (string)agent_id);
        INNIT();
    }

    experience_permissions_denied( key agent_id, integer reason )
    {   // Permissions denied, so go away
        llSay(0, "Denied experience permissions for " + (string)agent_id + " due to reason #" + (string) reason);
        // llDie();
        llSleep(5);
        llResetScript();
    }

     sensor( integer num )
    {
        llSetText((string)llGetListLength(SENSOR_OBJECTS), <1,1,1>, 1);
        //check if user is sitting, and if they are sittign on an object that is not in sensor_objects, then teleport them if they are back to last known location
        if(llGetAgentInfo(llGetOwner()) & AGENT_SITTING) {
            string obj =  llList2Key(llGetObjectDetails(llGetOwner(),[OBJECT_ROOT]),0);
            llOwnerSay("sat on"+obj);
            // key obj =  llList2Key(llGetObjectDetails(llGetOwner(),[OBJECT_ROOT]),0);
            if(obj != llGetOwner() && !~llListFindList(SENSOR_OBJECTS, [obj])) {
                llOwnerSay("Sit not allowed\n" + llDumpList2String(SENSOR_OBJECTS, "\n"));
                llTeleportAgent(llGetOwner(), "", LKL, <0,0,0>);
                return;
            }
        }
        LKL = llGetPos();
        SENSOR_OBJECTS = [];
        while(num--){
            string oname = llDetectedKey(num);
            // llOwnerSay(llDetectedName(num));
            // string name = llToLower(oname);
            SENSOR_OBJECTS += oname;
            //sofa couch
            // if(~llSubStringIndex(name, "stool") || ~llSubStringIndex(name, "chair") || ~llSubStringIndex(name, "bench") || ~llSubStringIndex(name, "bed") || ~llSubStringIndex(name, "seat"))
            // SENSOR_OBJECTS += llDetectedKey(num);
        }

        // llOwnerSay("all sit objects:\n" + llDumpList2String(SENSOR_OBJECTS, "\n"));
    }
}