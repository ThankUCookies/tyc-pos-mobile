import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DefaultLayoutComponent } from './components/default-layout/default-layout.component';
import { HttpClientModule } from '@angular/common/http';

import { TokenService } from './services/implementations/token.service';

import { environment } from 'src/environments/environment';

import { HttpServiceToken } from './services/contracts/http.service';
import { HttpService } from './services/implementations/http.service';
import { Network } from '@ionic-native/network/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

export function jwtOptionsFactory(tokenService: TokenService) {
  return {
    tokenGetter() {
      return tokenService.getToken();
    }
  };
}

@NgModule({
  declarations: [AppComponent, DefaultLayoutComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: environment.localDbName
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [TokenService]
      }
    })
  ],
  providers: [
    {
      provide: HttpServiceToken,
      useClass: HttpService
    },
    Network,
    TextToSpeech,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
