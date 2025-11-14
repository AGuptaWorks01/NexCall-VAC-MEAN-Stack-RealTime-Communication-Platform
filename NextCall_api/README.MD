nextcall_backend/
│
├── 📁 src/                       
│   ├── 📁 config/                   # Configuration files (env, constants, socket)                     
│   │   ├── socket.config.js                       
│   │   └── db.config.js            # (New) DB config (e.g., MongoDB or PostgreSQL)                   
│   │   └── passport-jwt.js            # (New) DB config (e.g., MongoDB or PostgreSQL)
│   │
│   ├── 📁 controllers/             # Business logic (splitted by domain)
│   │   ├── call.controller.js
│   │   └── auth.controller.js      # (New) Login/Register logic
│   │
│   ├── 📁 routes/                  # API route definitions
│   │   ├── call.routes.js
│   │   └── auth.routes.js          # (New) Routes for login, register
│   │
│   ├── 📁 services/                # Service layer (handling data + logic)
│   │   ├── call.service.js
│   │   └── auth.service.js         # (New) Auth-specific logic (login/register, JWT)
│   │
│   ├── 📁 sockets/                 # Socket event listeners
│   │   └── call.socket.js
│   │
│   ├── 📁 utils/                   # Utility functions (e.g., logging, token, password hash)
│   │   ├── logger.js
│   │   ├── jwt.js                  # (New) JWT helpers (sign, verify, decode)
│   │   └── hash.js                 # (New) Password hashing (bcrypt)
│   │
│   ├── 📁 middleware/             # Express middlewares
│   │   ├── errorHandler.js
│   │   └── auth.middleware.js      # (New) Auth guard (JWT check)
│   │
│   ├── 📁 models/                 # Database models
│   │   ├── user.model.js
│   │   └── token.model.js          # (Optional) Store refresh tokens if needed
│   │
│   ├── 📁 validations/            # Schema validations (Joi/Zod)
│   │   ├── call.validation.js
│   │   └── auth.validation.js      # (New) Validation for login/register input
│   │
│   ├── 📁 docs/            # openAPi docs
│   │   ├── swagger.doc.yaml
│   │   └──
│   │
│   ├── server.js                  # Entry point (http + socket server)
│   └── app.js                     # Middleware, route, error setup
│
├── 📁 public/                      # Static assets
├── 📁 logs/                        # Logger output (optional)
│
├── .env
├── .gitignore
├── package.json
└── README.md



docker run -d --name my-mongo -p 27017:27017 mongo:latest


docker build -t nextcall-node .



docker run -d --name nextcall-app -p 3000:3000 --link my-mongo:mongo -e MONGO_URI="mongodb://mongo:27017/nextcalldb" nextcall-node
