# Guía de Despliegue - Trading Academy

## Opción 1: Vercel (Recomendado - más fácil)

### Pasos:
1. Crea cuenta en [vercel.com](https://vercel.com)
2. Conecta tu repositorio Git (GitHub/GitLab)
3. Importa el proyecto desde el dashboard de Vercel
4. Configura variables de entorno en **Settings → Environment Variables**:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `ABACUSAI_API_KEY`
   - `WEB_APP_ID`
   - `NOTIF_ID_VERIFICACIN_DE_EMAIL`
5. En **Build Settings**:
   - Framework Preset: `Next.js`
   - Root Directory: `nextjs_space`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Click **Deploy**

### Base de datos:
- Usa [Neon](https://neon.tech) o [Supabase](https://supabase.com) para PostgreSQL gratis
- Copia el connection string a `DATABASE_URL`
- Ejecuta migraciones: `npx prisma db push` (desde tu local apuntando a producción)

---

## Opción 2: VPS propio (Ubuntu/Linux)

### Pre-requisitos:
```bash
# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 (gestor de procesos)
sudo npm install -g pm2
```

### Despliegue:
```bash
# 1. Subir código al servidor (vía Git)
cd /var/www
git clone tu-repositorio.git trading-academy
cd trading-academy/nextjs_space

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env con tus variables
nano .env
# (pega las variables del .env.example)

# 4. Generar cliente Prisma y sincronizar BD
npx prisma generate
npx prisma db push

# 5. Build de producción
npm run build

# 6. Iniciar con PM2
pm2 start npm --name "trading-academy" -- start
pm2 save
pm2 startup
```

### Configurar Nginx (proxy reverso):
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar configuración
sudo ln -s /etc/nginx/sites-available/trading-academy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL con Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## Opción 3: Railway

### Pasos:
1. Crea cuenta en [railway.app](https://railway.app)
2. Click **New Project → Deploy from GitHub**
3. Selecciona tu repositorio
4. Railway detecta Next.js automáticamente
5. Agrega servicio **PostgreSQL** desde el dashboard
6. En **Variables**, copia `DATABASE_URL` automático + agrega resto:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (Railway te da una URL automática)
   - `ABACUSAI_API_KEY`
   - `WEB_APP_ID`
   - `NOTIF_ID_VERIFICACIN_DE_EMAIL`
7. En **Settings**:
   - Root Directory: `nextjs_space`
   - Build Command: `npm run build && npx prisma db push`
   - Start Command: `npm start`
8. Deploy automático

---

## Checklist Final (todas las opciones)

- [ ] Variables de entorno configuradas
- [ ] Base de datos PostgreSQL creada y accesible
- [ ] `npx prisma db push` ejecutado exitosamente
- [ ] (Opcional) `npx prisma db seed` para datos iniciales
- [ ] Build sin errores: `npm run build`
- [ ] Dominio apuntando al servidor (DNS configurado)
- [ ] SSL/HTTPS habilitado
- [ ] Prueba flujo completo: registro → verificación → login → dashboard

---

## Comandos útiles post-despliegue

```bash
# Ver logs (VPS con PM2)
pm2 logs trading-academy

# Reiniciar app
pm2 restart trading-academy

# Actualizar código
git pull origin main
npm install
npm run build
pm2 restart trading-academy

# Ver status
pm2 status
```

---

## Troubleshooting

### Error: "Cannot connect to database"
- Verifica `DATABASE_URL` en variables de entorno
- Comprueba que la BD acepta conexiones externas (whitelist IP)

### Error: "NEXTAUTH_SECRET missing"
- Genera uno: `openssl rand -base64 32`
- Agrégalo a variables de entorno

### Página en blanco después de deploy
- Revisa logs del servidor
- Verifica que `NEXTAUTH_URL` apunta al dominio correcto
- Comprueba que build terminó sin errores

### Emails no se envían
- Verifica credenciales de Abacus AI
- Revisa logs de API en `/api/signup`
