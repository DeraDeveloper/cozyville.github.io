import { CarouselModule } from 'ngx-bootstrap/carousel';
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared-service/shared.service';
import { PictureRequest } from './models/picture-request';
import { Constants } from 'src/app/utils/constants';
import { isNullOrUndefined } from 'util';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private service: SharedService, private alert: AlertService) { }

  pictureRequest: PictureRequest = new PictureRequest(Constants.SUMMER_IMAGES, Constants.DEFAULT_PAGE);
  results: any[] = [];
  selectedPackage: string = "";
  loading: boolean = false;

  ngOnInit() {
  }

  getPictures() {
    this.loading = true;
    this.service.getPictures(this.pictureRequest).subscribe(
      response => {
        this.loading = false;
        console.log(response);
        if( isNullOrUndefined(response) ||  isNullOrUndefined(response.body)){
          this.alert.danger("Sorry, no response was received.");
          this.toggleSlide('slide', 'package');
          return;
        }
        if(response.status != Constants.RESPONSE_STATUS_200){
          if(response.body.errors){
            let err = response.body.errors;
            let msg;
            err.forEach(element => {
              msg = element + "\n";
            });
            this.alert.danger(msg);
            this.toggleSlide('slide', 'package');
          }else {
            this.toggleSlide('slide', 'package');
            this.alert.danger("An error occurred in the service. Please contact admin.");
          }
          return;
        }
        this.results = response.body.results;
      }, error => {
        this.loading = false;
        this.alert.danger("An error occurred while retrieving images, please retry");
        this.toggleSlide('slide', 'package');
        console.log(error);
      }
    );
  }

  // Handle package selection, set search parameter based on current selection
  onPackageSelected(e) {
    this.results = [];
    let id = e.currentTarget.id;
    if(id == "summer"){
      this.selectedPackage = "Sunny Summer";
      this.pictureRequest.searchParam = Constants.SUMMER_IMAGES;
    }else{
      this.selectedPackage = "Cozy Winter";
      this.pictureRequest.searchParam = Constants.WINTER_IMAGES;
    }
    this.toggleSlide('package', 'slide');
    this.getPictures();
  }

  toggleSlide(first, second) {
    let x = document.getElementById('package');
    let y = document.getElementById('slide');
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

    if (y.style.display === "none") {
      y.style.display = "block";
    } else {
      y.style.display = "none";
  }
}

backToPackages() {
  this.toggleSlide('slide', 'package');
}

purchasePackage() {
  this.toggleSlide('slide', 'package');
  this.alert.success("Successfully Purchased Package! Enjoy your Vacation");
}

}
