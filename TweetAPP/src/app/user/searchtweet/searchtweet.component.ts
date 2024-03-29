import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Tweet } from 'src/app/Models/tweet';
import { User } from 'src/app/Models/user';
import { UserComment } from 'src/app/Models/user-comment';
import { UserTweets } from 'src/app/Models/user-tweets';
import { TweetappService } from 'src/app/services/tweetapp.service';

@Component({
  selector: 'app-searchtweet',
  templateUrl: './searchtweet.component.html',
  styleUrls: ['./searchtweet.component.css']
})
export class SearchtweetComponent implements OnInit {
form:FormGroup;
commentslist:UserComment[];
result:number;
clickedButton : {[key: number] : boolean} ={};
count:Tweet;
id:number;
todaysDataTime = new Date();
today= new Date();
username:string;
date:string;
text:string;
user:User;
list :UserTweets[];
uname:string;
password:string;
  constructor(private frombuilder:FormBuilder,private service:TweetappService,private route:Router) {
   this.Searchusers();
   }
Searchusers()
{
  this.username = localStorage.getItem("username")!
  this.password = localStorage.getItem("password")!
  this.service.Login(this.username,this.password).subscribe(res=>
    {
      
     this.user=res;
     localStorage.setItem("name",this.user.username);
      console.log(this.user);
      this.UserTweets();
    },
    err=>{
      console.log(err);
    }
    )
}
  ngOnInit(){
    this.form = this.frombuilder.group({
      username:[''],
      comment:['']
    })
  }

  UserTweets()
  {
    this.service.GetUserProfile(this.username).subscribe(res=>{
      this.list=res;
      console.log(this.list);
      this.list.forEach(element => {
       this.date=formatDate(this.today,'yyyy/MM/dd','en-US', '+0530')
        localStorage.setItem("Tweets",element.tweets);
        localStorage.setItem("UserName",element.userName);
        localStorage.setItem("Imagename",element.imagename);
        localStorage.setItem("FirstName",element.firstName);
        localStorage.setItem("LastName",element.lastName);
        localStorage.setItem("tweetDate",element.tweetDate.toString());
        var created_date=localStorage.getItem('tweetDate');
        var text=this.GetTime(created_date);
        element.datecalculated=String(localStorage.getItem('datecalculated'))
        console.log(element.datecalculated);
      });
      console.log(this.list);
    })
  }
  isCommentClicked(index : number){
    console.log(index);
    if(this.clickedButton[index]==false){
    this.clickedButton[index] = true;
  }
    else
    this.clickedButton[index] = false;
  }

  Comments(item:UserTweets)
  {
    this.service.GetAllComments(item.userName, item.tweets).subscribe(res=>{
      this.commentslist=res;
      console.log(this.commentslist);
    })
  }
  PostComments(item:UserTweets)
  {
    let comment = this.form.value['comment']
    let uname = String(localStorage.getItem('Username'))
    this.service.PostComment(comment,uname,item.userName, item.tweets).subscribe(res=>{
    alert("replies")
  console.log(res)
  this.route.navigateByUrl('VIEWTWEETS')
    },
    err=>{
      alert("Failed")
      this.onReset();
    });
    this.Searchusers();
}
GetLikes(item:UserTweets)
{
  this.count=new Tweet();
  this.service.GetLikes(item.userName, item.tweets).subscribe(res=>{
    this.count.likes=res;
    console.log(this.count);
  },err=>{
    console.log(err)
  })
  this.Searchusers();
}
GetTime(created_date:any)
{
  function getDateDiff(startDate:Date, endDate:Date) {
    var diff = endDate.getTime() - startDate.getTime();
    var days = Math.floor(diff / (60 * 60 * 24 * 1000));
    var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    if(days==0)
    {
      return hours+"h"
    }
    else if(hours==0)
    {
      return minutes+"min"
    }
    else if(minutes==0)
    {
      return seconds+"sec"
    }
    else{
      return days+"days"
    }
}
var diff = getDateDiff(new Date(created_date),new Date(this.todaysDataTime));
localStorage.setItem("datecalculated",diff);
}
Search()
  {
     this.uname = this.form.value["username"]
    localStorage.setItem("uname", this.uname);
    this.Searchusers()
  }
onReset()
{
  this.form.reset();
}
}
