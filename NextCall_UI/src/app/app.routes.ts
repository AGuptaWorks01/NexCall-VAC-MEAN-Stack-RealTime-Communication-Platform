import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthCallbackComponent } from './features/auth/auth-callback/auth-callback.component';
import { WelcomeComponent } from './features/dashboard/welcome/welcome.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [authGuard], // 🛡️ same guard
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    canActivate: [authGuard], // 🛡️ same guard
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/home/home.component').then(
        (m) => m.HomeComponent
      ),
    children: [
      {
        path: '',
        component: WelcomeComponent,
      },
      {
        path: 'group-chat',
        loadComponent: () =>
          import('./features/chat/group-chat/group-chat.component').then(
            (m) => m.GroupChatComponent
          ),
      },
      {
        path: 'single-chat',
        loadComponent: () =>
          import('./features/chat/single-chat/single-chat.component').then(
            (m) => m.SingleChatComponent
          ),
      },
    ],
  },
  {
    path: 'auth-callback',
    component: AuthCallbackComponent,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
