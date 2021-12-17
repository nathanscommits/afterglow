list stats;

float ecto = 100;
float ecto_max = 100;

string RACE;

default{
    link_message( integer s, integer n, string m, key id )
    {
        if(n == 2) {
            //json stats from server
            stats = llJson2List(m);
            ecto = llList2Float(stats, 0);
            ecto_max = llList2Float(stats, 1);
            RACE = llList2String(stats, 4);
            llSetText("ECTO: " + (string)ecto, <1,1,1>, 1);
        } 
    }

}