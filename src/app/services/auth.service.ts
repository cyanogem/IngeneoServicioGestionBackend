import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { switchMap, tap } from 'rxjs';
import {TokenService} from 'src/app/services/token.service'
import{ Response } from  'src/app/models/response'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.API_URL;
  constructor(
    private http: HttpClient,
    private tokenservices: TokenService
  ) { }

  login(usuario: string, contraseña: string){
    return this.http.post<Response>(`${this.apiUrl}/api/Login/Login`,{
      usuario,
      contraseña
    })
    .pipe(
      tap(response => {
        if(response.success){
          this.tokenservices.saveToken(response.objectResponse)
        }
        return response;
      })
      );
  }

  registro(name: string,email: string, password: string){
    console.log(name,email,password);
    return this.http.post(`${this.apiUrl}/api/v1/auth/register`,{
      name,
      email,
      password
    });
}

  validaruser(email: string){
  return this.http.post<{isAvailable: boolean}>(`${this.apiUrl}/api/v1/auth/is-available`,{
    email
  });
}

registroAndlogin(name: string,email: string, password: string){
  return this.registro(name,email,password).pipe(
    switchMap(()=> this.login(email,password))
    );
}

recovery(email: string){
  return this.http.post(`${this.apiUrl}/api/v1/auth/recovery`,{
    email
  });
}

changePassword(token: string, newPassword: string){
  return this.http.post(`${this.apiUrl}/api/v1/auth/change-password`,{
    token,
    newPassword
  });
}

logout(){
  this.tokenservices.removeToken();
}

}
