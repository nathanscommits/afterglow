integer HUD_COMS = -235242;
float COOLDOWN = 0;
// string URL = "https://afterglow.loca.lt/";
string URL = "https://afterglowgame.herokuapp.com";
refresh_url(string url) {
    //  llClearPrimMedia( 0 );
    // llOwnerSay("TRYING TO SET MEDIA");
    //  llSetPrimMediaParams(0, [        
    //      PRIM_MEDIA_CURRENT_URL, url,     
    //      PRIM_MEDIA_HOME_URL, url,    
    //      PRIM_MEDIA_AUTO_SCALE, FALSE,      
    //      PRIM_MEDIA_AUTO_LOOP, TRUE,
    //      PRIM_MEDIA_AUTO_ZOOM, TRUE,          
    //      PRIM_MEDIA_AUTO_PLAY, TRUE,        
    //      PRIM_MEDIA_PERMS_CONTROL, PRIM_MEDIA_PERM_ANYONE,        
    //      PRIM_MEDIA_WIDTH_PIXELS, 1024,         
    //      PRIM_MEDIA_HEIGHT_PIXELS, 1024    
    // ]);
 llSetLinkMedia(LINK_THIS, 0, [
        PRIM_MEDIA_CURRENT_URL, url,     
         PRIM_MEDIA_HOME_URL, url,    
         PRIM_MEDIA_AUTO_SCALE, FALSE,      
         PRIM_MEDIA_AUTO_LOOP, TRUE,
         PRIM_MEDIA_AUTO_ZOOM, TRUE,          
         PRIM_MEDIA_AUTO_PLAY, TRUE,        
         PRIM_MEDIA_PERMS_CONTROL, PRIM_MEDIA_PERM_ANYONE,        
         PRIM_MEDIA_WIDTH_PIXELS, 1024,         
         PRIM_MEDIA_HEIGHT_PIXELS, 1024 
        ]);
}
string DATA = "/spellbar/100/100/100/100/none/0/";
default
{
    state_entry()
    {
        // llListen(HUD_COMS, "", "", "");
        refresh_url(URL);
        // llSetTimerEvent(1);
    }
    // listen( integer c, string n, key id, string body )
    // {
    //     if(llGetOwnerKey(id) != llGetOwner()) return;
    //     if(~llSubStringIndex(body, "COOLDOWN:")){
    //         COOLDOWN = (float)llGetSubString(body, 9, -1);
    //         llSetTimerEvent(1);
    //     } else {
    //         DATA = body;
    //     }
    //     refresh_url(URL);
    // }
    // timer()
    // {
    //     if(COOLDOWN > 0)--COOLDOWN;
    //     if(COOLDOWN <= 0) llSetTimerEvent(0);
    //     refresh_url(URL + DATA + (string)((integer)COOLDOWN));
    // }
}