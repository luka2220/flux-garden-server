# Deploy FastAPI + SQLite + Docker on a Hostinger Ubuntu 24.04 VPS

Here’s a **simple, linear, step‑by‑step guide** to deploy your existing **FastAPI + SQLite + Docker** backend on your **Hostinger Ubuntu 24.04 VPS**.

Assumptions:

- You already have:
  - A `Dockerfile` for your FastAPI app.
  - Your app listens on `0.0.0.0:8000` inside the container.
  - Your SQLite DB is (or will be) at `./data/db.sqlite` in your project.
- You can SSH into your VPS.

---

## 1. SSH into your VPS

From your local machine:

```bash
ssh your-username@YOUR_VPS_IP
```

---

## 2. Install Docker & Docker Compose plugin

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
```

Allow your user to run Docker:

```bash
sudo usermod -aG docker $USER
newgrp docker    # or log out and back in
```

Verify Docker works:

```bash
docker ps
```

---

## 3. Get your backend code onto the VPS

### Option A – Clone from Git (if repo is on GitHub/GitLab, etc.)

```bash
cd ~
git clone https://github.com/YOUR_USER/YOUR_REPO.git app
cd app
```

### Option B – Copy files via `scp` (if repo is private / local)

On your **local** machine (in your project directory):

```bash
scp -r . your-username@YOUR_VPS_IP:~/app
```

Then on VPS:

```bash
cd ~/app
```

---

## 4. Set up a persistent directory for SQLite

Inside `~/app` on the VPS:

```bash
mkdir -p data
chmod 755 data
```

Your SQLite DB file will live at `~/app/data/db.sqlite` on the host, and you’ll map that into the container.

---

## 5. Create/update `docker-compose.yml`

In `~/app`, create or edit `docker-compose.yml` to look like this (adapt paths/command if needed):

```yaml
version: "3.8"

services:
  web:
    build: . # builds from your existing Dockerfile
    restart: unless-stopped
    environment:
      # Use this in your FastAPI code for DB connection string
      - DATABASE_URL=sqlite:///app/data/db.sqlite
    volumes:
      # host ./data -> container /app/data
      - ./data:/app/data
    ports:
      # expose container port 8000 to VPS port 8000
      - "8000:8000"
```

**Key points:**

- `build: .` assumes your `Dockerfile` is in the same directory as `docker-compose.yml`.
- Your FastAPI app should read `DATABASE_URL` and use that for SQLite.

---

## 6. Build and start the container

From `~/app`:

```bash
docker compose up -d --build
```

Check that it’s running:

```bash
docker compose ps
```

Look at logs:

```bash
docker compose logs -f web
```

If logs show your app started on `0.0.0.0:8000`, it’s good.

---

## 7. Test the API via IP and port

From your **local** machine (or any machine that can reach the VPS):

```bash
curl http://YOUR_VPS_IP:8000/your-endpoint
```

Or open in browser:

- `http://YOUR_VPS_IP:8000/docs` (if you kept FastAPI’s docs)

If this works, your backend is deployed and reachable on port 8000.

---

## 8. (Optional) Put Nginx in front with a domain + HTTPS

If you want `https://yourdomain.com` instead of `http://IP:8000`, do this.

### 8.1 Install Nginx and Certbot

On the VPS:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 8.2 Create Nginx config

Create a file for your site:

```bash
sudo nano /etc/nginx/sites-available/yourdomain.com
```

Paste:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Now `http://yourdomain.com` should proxy to your FastAPI app on port 8000.

### 8.3 Enable HTTPS (Let’s Encrypt)

```bash
sudo certbot --nginx -d yourdomain.com
```

Follow the prompts. After this, `https://yourdomain.com` should work.

---

## 9. Make sure it keeps running

Your `docker-compose.yml` uses:

```yaml
restart: unless-stopped
```

So if the VPS reboots, Docker will restart the container automatically.

You can manually control it:

```bash
# stop
docker compose down

# start again
docker compose up -d
```

---

## 10. Useful commands for debugging

- Show containers:

  ```bash
  docker ps
  ```

- Show web logs:

  ```bash
  docker compose logs -f web
  ```

- Exec into the container shell:

  ```bash
  docker compose exec web sh
  ```

- See where the DB file is on the host:

  ```bash
  ls -l ~/app/data
  ```
