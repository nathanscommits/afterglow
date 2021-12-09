
float IMPULSE = 1; 
float IMPULSE_MODIFIER = 3;
integer CONTROL = TRUE;
default{

    experience_permissions(key agent_id)
    {
        llTakeControls(CONTROL_FWD | CONTROL_LEFT | CONTROL_RIGHT | CONTROL_BACK, TRUE, CONTROL); 
    }

    experience_permissions_denied( key agent_id, integer reason )
    {   // Permissions denied, so go away
        llSay(0, "Denied experience permissions for " + (string)agent_id + " due to reason #" + (string) reason);
        // llDie();
        llSleep(5);
        llResetScript();
    }
    control(key id, integer level, integer edge)
    {
        if(!(CONTROL_FWD | CONTROL_LEFT | CONTROL_RIGHT | CONTROL_BACK)) return;
        vector v;
        // if(IMPULSE == 1 && !CONTROL){
        //     CONTROL = TRUE;
        //     llOwnerSay((string)CONTROL);
             
        // }else if(IMPULSE != 1 && CONTROL) {
        //     CONTROL = FALSE;
        //     llOwnerSay((string)CONTROL);
        //     llTakeControls(CONTROL_FWD | CONTROL_LEFT | CONTROL_RIGHT | CONTROL_BACK, TRUE, CONTROL); 
        // }
            v.z = 0.1; //pitch up slightly to avoid drag on the ground
        IMPULSE_MODIFIER = IMPULSE * 3.5;
        if(llGetAgentInfo(id) & AGENT_CROUCHING) IMPULSE_MODIFIER *= 0.75;
        else if(llGetAgentInfo(id) & AGENT_ALWAYS_RUN) IMPULSE_MODIFIER *= 2;

        if (level & CONTROL_FWD){
            v.x = IMPULSE_MODIFIER;
            if(level & CONTROL_BACK) v.x = 0;
            if(level & CONTROL_LEFT) {
                v.x = (IMPULSE_MODIFIER/2);
                v.y = (IMPULSE_MODIFIER/2);
            }
            if(level & CONTROL_RIGHT){
                v.x = (IMPULSE_MODIFIER/2);
                v.y = -(IMPULSE_MODIFIER/2);
            }
        }else if (level & CONTROL_BACK){
             v.x = -IMPULSE_MODIFIER;
            if(level & CONTROL_FWD) v.x = 0;
            if(level & CONTROL_LEFT) {
                v.x = -(IMPULSE_MODIFIER/2);
                v.y = (IMPULSE_MODIFIER/2);
            }
            if(level & CONTROL_RIGHT){
                v.x = -(IMPULSE_MODIFIER/2);
                v.y = -(IMPULSE_MODIFIER/2);
            }
        }else if (level & CONTROL_LEFT){
            v.y = IMPULSE_MODIFIER;
        }else if (level & CONTROL_RIGHT){
            v.y = -IMPULSE_MODIFIER;
        }
        if(llGetAgentInfo(id) & AGENT_FLYING) {
            v = <0,0,-10>;
        }
       if(!(llGetAgentInfo(id) & AGENT_IN_AIR)) llSetVelocity(v, TRUE);
    }  

    link_message( integer s, integer n, string m, key id )
    {
        if(n == 6 && id == "IMPULSE"){
            IMPULSE = (float)m;
            // llOwnerSay("Impulse updated to " + m);
            if(IMPULSE == 1 && !CONTROL){
                CONTROL = TRUE;
                llOwnerSay((string)CONTROL);
                llReleaseControls();
            }else if(IMPULSE != 1 && CONTROL) {
                CONTROL = FALSE;
                llOwnerSay((string)CONTROL);
                llRequestExperiencePermissions(llGetOwner(), "");
            }
        }
    }
} 