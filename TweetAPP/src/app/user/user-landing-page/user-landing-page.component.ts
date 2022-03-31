import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tweet } from 'src/app/Models/tweet';
import { User } from 'src/app/Models/user';
import { UserTweets } from 'src/app/Models/user-tweets';
import { TweetappService } from 'src/app/services/tweetapp.service';

@Component({
  selector: 'app-user-landing-page',
  templateUrl: './user-landing-page.component.html',
  styleUrls: ['./user-landing-page.component.css']
})
export class UserLandingPageComponent implements OnInit {
  user:User;
  form:FormGroup;
  id:number;
  tweet:Tweet;
  username:string;
  password:string;
  clickedMoreButton : {[key: number] : boolean} ={};
  submitted = false;
  message:string;
  list:User[];
  count:number;
  uname:string
  constructor(private frombuilder:FormBuilder,private service:TweetappService,private route:Router) {
   this.Profiles();
   }
   Profiles()
{
  this.id = Number(localStorage.getItem('UserId') || '{}') ;
  this.username = String(localStorage.getItem("username") || '{}');
  this.password = String(localStorage.getItem("password") || '{}');
  this.service.Login(this.username,this.password).subscribe(res=>
    {
      this.user=res;
      console.log(this.user);
    },
    err=>{
      console.log(err);
    }
    )
    this.service.GetAllUsers().subscribe(res=>{
      this.list=res;
      console.log(this.list);
    },err=>{
      console.log(err)
    })
}
  ngOnInit(){
    this.form = this.frombuilder.group({
      username:['']
    })
  }

  Search()
  {
     this.uname = this.form.value["username"]
    localStorage.setItem("uname", this.uname);
    this.route.navigateByUrl('/SEARCH TWEET');
  }
  SearchUser(item:User)
  {
    localStorage.setItem("uname", item.username);
    this.route.navigateByUrl('/SEARCH TWEET');
  }
  isReplyClicked(index : number){
    console.log(index);
    if(this.clickedMoreButton[index]==false){
    this.clickedMoreButton[index] = true;
  }
    else
    this.clickedMoreButton[index] = false;
  }

    onReset()
    {
      this.submitted=false;
      this.form.reset();
      this.Profiles();
    }
}