list stats;

float ecto = 100;
float ap = 100;
float ecto_max = 100;
float ap_max = 100;

string RACE;

default{
    state_entry()
    {
        // llSetTimerEvent(2);
        llSensorRepeat("", "", AGENT, 10, PI, 2);
    }
    link_message( integer s, integer n, string m, key id )
    {
        if(n == 2) {
            //json stats from server
            stats = llJson2List(m);
            ecto = llList2Float(stats, 0);
            ecto_max = llList2Float(stats, 1);
            ap = llList2Float(stats, 2);
            ap_max = llList2Float(stats, 3);
            RACE = llList2String(stats, 4);
            llSetText("ECTO: " + (string)ecto + "\nPK: " + (string)ap, <1,1,1>, 1);
        } 
    }

    // timer()
    // {
    //     if(ap < 0) ap = 0;
    //     ap += 1;
    //     if(ap > ap_max) ap = ap_max;

    //     llMessageLinked(LINK_THIS, 4, (string)ap, "ap_update");
    //     llSetText("ECTO: " + (string)ecto + "\nPK: " + (string)ap, <1,1,1>, 1);
    // }

    sensor( integer num )
    {
        if(ap < 0) ap = 0;
        if(RACE == "demon") {
            ap += (1 + num);
        } else {
            ap += 1;
        }
        if(ap > ap_max) ap = ap_max;

        llMessageLinked(LINK_THIS, 4, (string)ap, "ap_update");
        llSetText("ECTO: " + (string)ecto + "\nPK: " + (string)ap, <1,1,1>, 1);
    }
}