import './style.css';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { App } from './app';

bootstrapApplication(App, {
  providers: [provideZonelessChangeDetection()],
}).catch((err: unknown) => console.error(err));
