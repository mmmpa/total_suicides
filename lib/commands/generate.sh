#!bin/bash

rails g model gender content:integer name:string
rails g model area content:integer name:string
rails g model year content:integer name:string
rails g model age gender:references area:references year:references o0:integer o20:integer o30:integer o40:integer o50:integer o60:integer o70:integer o80:integer unknown:integer
rails g model housemate gender:references area:references year:references yes:integer no:integer unknown:integer
rails g model job gender:references area:references year:references self_employed:integer employed:integer total_unemployed:integer student:integer not_student:integer unemployed:integer stay_at_home:integer pensioner:integer unknown:integer
rails g model location gender:references area:references year:references home:integer building:integer vehicle:integer sea:integer mountain:integer other:integer unknown:integer
rails g model way gender:references area:references year:references hanging:integer poison:integer briquet:integer jumping:integer diving:integer other:integer unknown:integer
rails g model hour gender:references area:references year:references a0:integer a2:integer a4:integer a6:integer a8:integer a10:integer a12:integer a14:integer a16:integer a18:integer a20:integer a22:integer unknown:integer
rails g model day gender:references area:references year:references monday:integer tuesday:integer wednesday:integer thursday:integer friday:integer saturday:integer sunday:integer unknown:integer
rails g model reason gender:references area:references year:references family:integer health:integer life:integer work:integer partner:integer school:integer other:integer unknown:integer
rails g model attempted gender:references area:references year:references yes:integer no:integer unknown:integer
rails g model total gender:references area:references year:references number:integer rate:float
