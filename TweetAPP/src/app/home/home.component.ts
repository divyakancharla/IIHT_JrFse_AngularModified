import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Token } from '../Models/token';
import { User } from '../Models/user';
import { TweetappService } from '../services/tweetapp.service';

@Component({
  selector: 'app-login',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user:User;
  submitted=false;
  token:Token;
  userForm:FormGroup;
  message:string;
  constructor(private frombuilder:FormBuilder,private service:TweetappService,private route:Router) { }

  ngOnInit() {
    this.userForm = this.frombuilder.group({
        username:['',Validators.required],
        password:['',[Validators.required]],
      });
  }

  onSubmitLogin(){
    this.submitted=true;
    if(this.userForm.invalid){
     return;
    }
      else {
      this.Validate();
      }
    }
     public Validate()
      {
        let username=this.userForm.value['username']
        let password=this.userForm.value['password']
          let token=new Token()
          this.service.Login(username,password).subscribe(res=>{this.token=res,console.log(this.token)
            if(this.token!=null)
            {
              alert("welcome")
       console.log(this.token)
          //localStorage.setItem("token",this.token.tokens);
          localStorage.setItem("id",this.token.userId);
          localStorage.setItem("username",this.token.username);
          localStorage.setItem("password",password);
          this.route.navigateByUrl('USER')
            }
            else{
              alert("invalid username or password")
              this.onReset();
            }
        });
      }
      get f(){return this.userForm.controls;}

    onReset()
    {
      this.submitted=false;
      this.userForm.reset();
    }
}