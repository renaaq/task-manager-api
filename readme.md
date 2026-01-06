# Task Manager API

Task manager fullstack que armé para practicar Node + PostgreSQL.

## Demo
**Live:** https://mi-app.railway.app

## Qué hace
- CRUD completo tasks (listar, crear, toggle, borrar)
- Frontend Vanilla JS (sin React)
- Backend Node/Express/PostgreSQL
- Deploy Railway

## Uso local
```bash
git clone https://github.com/renaaq/task-manager-api
npm install
# DATABASE_URL en .env
npm start


GET    /api/tasks           # Lista
POST   /api/tasks           # Crear {"title","description","user_id":2}
GET    /api/tasks/:id       # Una task
PUT    /api/tasks/:id       # Update task
DELETE /api/tasks/:id       # Borrar
