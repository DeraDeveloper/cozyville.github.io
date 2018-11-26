import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';

import { SharedService } from './shared.service';
import { AlertService, AlertModule } from 'ngx-alerts';
import { HttpClient } from '@angular/common/http';
import { PictureRequest } from '../pages/landing/models/picture-request';

describe('SharedService', () => {

  let service: SharedService;
  let httpMock: HttpTestingController;
  let mockRequest: PictureRequest = {searchParam: "summer-holiday", pageNumber: "1"};
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AlertModule.forRoot()],
      providers: [SharedService,
        HttpClient,
        AlertService]
    });

    service = TestBed.get(SharedService);
    httpMock = TestBed.get(HttpTestingController);

  });

  it('should be created', inject([SharedService], (service: SharedService) => {
    expect(service).toBeTruthy();
  }));

  it('should submit a request to retrieve pictures', () => {
    const dummyResp = {status: "200", total: null, total_pages: null, results: {}}
    service.getPictures(mockRequest).subscribe( response => {
      const search = httpMock.expectOne("https://api.unsplash.com/search/photos");
      expect(response.status).toBe("200");
      expect(response.body.length).toBe(1);
      search.flush(dummyResp, this.header);
      httpMock.verify();
    });
    expect(service).toBeTruthy();
  });
});
