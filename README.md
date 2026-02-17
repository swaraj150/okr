# OKR APP

OKR apps are digital tools designed to help individuals, teams, and organizations define, track, and achieve goals using the Objectives and Key Results (OKR) framework


## PROJECT SETUP

#### Clone the repository
```
git clone https://github.com/rbpata/incubyte-okr.git
```

use the following directories to access frontend and backend
- [frontend](frontend) 
- [backend_v3](backend_v3)

### Prerequisite

- install [Node](https://nodejs.org/en/download/current)
- install Docker Desktop / Podman Desktop
- setup pnpm 

### Backend Setup

#### Install
 ```
 pnpm install
 ```

#### database and prisma setup

- using docker 
```
docker compose up
```

- using podman
```
podman compose up
```

- set .env
```
DATABASE_URL="postgresql://postgres1:postgres1@localhost:5433/okrs_v2"
```

- prisma setup
 ```
pnpx prisma db push
```

#### run
```
pnpm run start:dev
```

the backend will be running on http://localhost:3000


### Frontend Setup

#### install
```
npm install
```
- setup .env
```
VITE_OBJECTIVE_BASE_URL=http://localhost:3000/v3/objective
VITE_KEYRESULT_BASE_URL=http://localhost:3000/v3/key-result
```

```
npm run dev
```

frontend will be running on http://localhost:5173





