# Deployment Guide

## Production Deployment Checklist

### Pre-Deployment

- [ ] Security audit completed
- [ ] Load testing completed (1000+ concurrent users)
- [ ] Database backups configured
- [ ] Environment variables set
- [ ] SSL certificates configured
- [ ] CDN configured for static assets
- [ ] Monitoring and logging set up
- [ ] Error tracking (Sentry) configured

### Infrastructure

#### Backend Hosting Options

**Option 1: Heroku**
```bash
heroku create syntax-audio-api
heroku addons:create mongolab:sandbox
heroku addons:create rediscloud:30
heroku config:set JWT_SECRET=your-secret
heroku deploy
```

**Option 2: AWS (EC2 + RDS)**
- Launch EC2 instance (t2.medium minimum)
- Set up RDS MongoDB or use MongoDB Atlas
- Configure security groups
- Set up Elastic Beanstalk or ECS

**Option 3: DigitalOcean**
- Create Droplet (2GB RAM minimum)
- Install Node.js and PM2
- Set up MongoDB Atlas
- Configure firewall

#### Frontend Hosting

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**AWS S3 + CloudFront**
- Build: `npm run build`
- Upload to S3 bucket
- Configure CloudFront distribution

### Database Setup

#### MongoDB Atlas
1. Create cluster
2. Whitelist IP addresses
3. Create database user
4. Get connection string
5. Set `MONGODB_URI` in environment

#### Supabase
1. Create project
2. Run migrations
3. Set up Row Level Security (RLS)
4. Configure API keys

### File Storage

#### AWS S3
1. Create S3 bucket
2. Configure CORS
3. Set up IAM user with S3 permissions
4. Configure lifecycle policies for old files

#### Cloudinary
1. Create account
2. Get API credentials
3. Configure upload presets
4. Set up automatic transformations

### CI/CD Pipeline

#### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy to production
        run: |
          # Your deployment commands
```

### Environment Variables

Set these in your hosting platform:

**Backend:**
- `NODE_ENV=production`
- `PORT=3000`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `REDIS_URL=...`
- `AWS_ACCESS_KEY_ID=...`
- `AWS_SECRET_ACCESS_KEY=...`

**Frontend:**
- `VITE_API_URL=https://api.syntaxaudio.com`
- `VITE_SENTRY_DSN=...`

### SSL/TLS

- Use Let's Encrypt for free SSL
- Configure auto-renewal
- Force HTTPS redirects

### Monitoring

1. **Uptime Monitoring**: UptimeRobot or Pingdom
2. **Error Tracking**: Sentry
3. **Performance**: New Relic or DataDog
4. **Logs**: LogRocket or Papertrail

### Backup Strategy

- Database: Daily automated backups
- Files: S3 versioning enabled
- Retention: 30 days minimum

### Rollback Plan

1. Keep previous deployment version
2. Database migration rollback scripts
3. Feature flags for gradual rollout
4. Blue-green deployment strategy

## Post-Deployment

- [ ] Verify all endpoints working
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Test critical user flows
- [ ] Verify email notifications
- [ ] Check file uploads/downloads
- [ ] Verify search functionality

