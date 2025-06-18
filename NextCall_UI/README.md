realtime-call-app/
│
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 core/                      # Singleton services, guards, interceptors, env configs
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── socket.service.ts
│   │   │   │   └── webrtc.service.ts
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── models/                  # Global interfaces & enums
│   │   │   │   ├── user.model.ts
│   │   │   │   └── call.model.ts
│   │
│   │   ├── 📁 shared/                    # Reusable UI components, pipes, and directives
│   │   │   ├── components/
│   │   │   │   ├── video-tile/
│   │   │   │   └── user-avatar/
│   │   │   ├── pipes/
│   │   │   │   └── duration.pipe.ts
│   │   │   ├── directives/
│   │   │   │   └── autofocus.directive.ts
│   │
│   │   ├── 📁 features/                  # Feature modules
│   │   │   ├── 📁 auth/                  # Login/Register/OTP/etc.
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── services/
│   │   │   ├── 📁 dashboard/            # Home dashboard after login
│   │   │   │   └── dashboard.module.ts
│   │   │   ├── 📁 call/                 # Main calling logic
│   │   │   │   ├── group-call/
│   │   │   │   ├── single-call/
│   │   │   │   ├── call-controls/
│   │   │   │   ├── services/
│   │   │   └── 📁 settings/             # Theme, profile, notifications, etc.
│   │   │       └── settings.module.ts
│   │   │   └── 📁 chat/                 # ✅ NEW: Chat feature module
│   │   │       ├── 📁 services/
│   │   │       │   └── chat.service.ts         # Handles socket connection and chat logic
│   │   │       ├── 📁 single-chat/
│   │   │       │   ├── single-chat.component.ts
│   │   │       │   └── single-chat.component.html
│   │   │       ├── 📁 group-chat/
│   │   │       │   ├── group-chat.component.ts
│   │   │       │   └── group-chat.component.html
│   │   ├── 📁 layout/                   # UI layout components
│   │   │   ├── header/
│   │   │   ├── sidebar/
│   │   │   ├── theme-switcher/
│   │
│   │   └── app.component.ts
│
├── 📁 assets/
│   ├── i18n/                            # Translations
│   ├── icons/
│   ├── images/
│   └── styles/
│       ├── themes/                     # Light/Dark themes
│       └── global.scss
│
├── 📁 environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
├── angular.json
├── tsconfig.json
├── package.json
└── README.md
