USER {    

    name : string
    surname : string
    email : string
    password : string

    gender : string | These are about user's body 
    height : string |
    weight : string |
    birthDate: string |

    GOAL: string
}

How many calories did you burn today? 
How many calories did you take in?

choose exercise e.g. cycling, walking, jogging
+
enter time 
= 
calories burned 

enter calories in 


one's body already burns a calorie: it is calculated according to one's body

there is a calorie that a person burns with exercise: the user will enter
There are calories that the person takes in : the user will enter


register
    information
    Target

daily
    his exercise and time for the day
    what they eat during the day 
    daily weight update (optional)


current weight -----(

   calories to be given

   calories given by exercise <--- calCalculator(gender, height, weight, age, exercise performed, exercise time)

)-----> target weight



DATABASE

    USER TABLE User registration and tracking
    JOURNEY TABLE: there is for tracking the current journey and daily target, the current journey
    DAILYDATA TABLE: OPTIONAL, for general performance tracking. Daily performance is recorded. Can be added later 


USER
{
    General information {
        name : string
        surname : string
        email : string
        password : string
        gender : string   
        height : string    
        weight : string    
        birthDate: string  

    }
    
    CurrentJourney : JOURNEY
}


JOURNEY{
    start_weight
    goal_weight

    start date

    DailyData : DAILYDATA[]

    forecast end date
}

DAILYDATA{  
    date of the day: date as string, 
    daily performance: a number between 1-100,
}

