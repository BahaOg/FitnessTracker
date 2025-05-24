USER {    

    name : string
    surname : string
    email : string
    password : string

    gender : string     | These are about user's body 
    height : string    |
    weight : string     |
    birthDate: string   |

    GOAL: string
}

bugün kaç kalori yaktın? 
kaç kalori aldın

egsersizi seç örn: bisiklet, yürüyüş, koşu
+
vakit gir 
= 
yakılan kalori 

alınan kaloriyi gir 


kişinin bedeninin zaten yaktğı bir kalori var : kişinin bedenine göre hesaplanır

kişinin egzersiz ile yaktğı bir kalori var : kullanıcı girecek
kişinin aldığı kalori var : kullanıcı girecek


register
    bilgiler
    hedef

günlük
    gün için yaptığı egsersiz ve vakti
    gün içinde yedikleri 
    günlük kilo güncelleme (opsyonel)


şuanki kilo -----(

   verilmesi gereken kalori

   egsersiz ile verilmiş olan kalori <--- kalHesap(gender, height, weight, yaş, yapılan egsersiz, egsersiz vakti)

)-----> hedef kilo



DATABASE

    USER TABLE: User kaydı ve takibi
    JOURNEY TABLE: şuanki journey'nin takibi ve günlük hedef için var, şu anki journey'nin
    DAILYDATA TABLE: OPTIONAL, genel performans takibi için. Günlük performans kaydedilir. Sonra eklenebilir 


USER
{
    Genel bilgiler {
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

    tahimini end date
}

DAILYDATA{  
    date of the day: date as string, 
    daily performance: a number between 1-100,
}
