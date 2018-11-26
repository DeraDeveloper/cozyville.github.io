import { Injectable } from '@angular/core';
import { catchError} from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { isNullOrUndefined } from 'util';
import { of, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from 'ngx-alerts';
import { Constants } from '../utils/constants';
import { PictureRequest } from '../pages/landing/models/picture-request';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private httpClient: HttpClient, private alert: AlertService) { }

  /**
   * Construct a GET request which interprets the body as JSON and returns the full response.
   *
   * @return an `Observable` of the `HttpResponse` for the request, with a body type of `Object`.
   */
  public get(url: string, options?: {

    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: "response";
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: "json";
    withCredentials?: boolean;
  }): any {
      console.info("Making authenticated GET call to "+ url);
      return this.httpClient.get(url, {
        headers: isNullOrUndefined(options) ? this.getHeader() : (isNullOrUndefined(options.headers) ? this.getHeader() : options.headers),
        observe: isNullOrUndefined(options) ? "response" : (isNullOrUndefined(options.observe)? "response": options.observe),
        params: this.updateParams(options)
      }).pipe(catchError(this.logError));
  }

  public getHeader(contentType?: string): HttpHeaders {
    return new HttpHeaders()
      .set("Content-Type", isNullOrUndefined(contentType)? "application/json": contentType)
      .set("Accept-Version", isNullOrUndefined(contentType)? "v1": contentType)
      .set("Authorization", isNullOrUndefined(contentType)? "Client-ID "+ Constants.CLIENT_ID: contentType)
  }

  updateParams(options?: any): HttpParams {
    let param: HttpParams;
    if (isNullOrUndefined(options) || isNullOrUndefined(options.params)) {
      param = new HttpParams();
    }
    else {
      param = options.params;
    }

    //param = param.set("t", Date.now().toString());
    return param;
  }

  private logError(error: any): Observable<any> {
    let errorMessage = "";
    try {
      if (error.status === 401) {
        errorMessage = "An unauthorized request has been detected, please use the 'get inspired button' to allow this application to retrieve instagram feeds";
        console.log(errorMessage);
        setTimeout(() => {
          const a: any = document.createElement("A");
          const windowOrigin = window.location.origin;
          a.href = windowOrigin + (windowOrigin.indexOf("localhost") > -1 ? "/home" : "/home");
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, 2500);

      } else {
        
        console.error(JSON.stringify(error));
        errorMessage = "There was an issue processing your request, please try again";
      }
    } catch (err) {
      errorMessage = err.message;
    }

    console.error(errorMessage);

    if (!isNullOrUndefined(this.alert)) {
      this.alert.warning(errorMessage);
    }
    return of(error);
  }

  public getPictures(pictureRequest: PictureRequest): Observable<any> {
    const url = environment.imageSearchBaseURL.concat("?").concat("page=").concat(pictureRequest.pageNumber)
                .concat("&").concat("query=").concat(pictureRequest.searchParam);
    return this.get(url);
  }

}
