# Team Tasks

A minimal authenticated task management app built with Next.js, Supabase, Docker, Terraform, and GitHub Actions.

## Architecture Diagram

```
[User] -> [Next.js App (Docker)] -> [Supabase (Auth + DB)]
                        |
                [Deployed via CI/CD]
                        |
                [Provisioned VM (Terraform)]
```

# Team Tasks

A production-ready authenticated task management app built with Next.js, Supabase, Docker, and AWS infrastructure via Terraform.

## Architecture

```
[User] -> [Next.js App (Docker)] -> [Supabase (Auth + DB)]
                        |
                [Deployed on AWS EC2]
                        |
                [VPC + Security Groups (Terraform)]
```

## Features

- 🔐 **Authentication**: Email/password + magic link via Supabase
- 📋 **Task Management**: CRUD operations with Row Level Security (RLS)
- 🐳 **Containerized**: Docker multi-stage build for production
- ☁️ **AWS Infrastructure**: VPC, EC2, Security Groups via Terraform
- 🚀 **Free Tier Compatible**: Runs entirely within AWS free tier limits

## Quick Start

### 1. Clone and Install
```bash
git clone <your-repo>
cd team_tasks
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Database Setup (Supabase)
1. Create a new Supabase project
2. Run `sql/001_schema_and_policies.sql` in the SQL editor
3. Run `sql/002_seed.sql` for sample data
4. Add your project URL and anon key to `.env.local`

### 4. Local Development
```bash
npm run dev
# Visit http://localhost:3000
```

## Production Deployment

### Prerequisites
- AWS CLI configured with admin access
- Terraform installed
- Docker installed

### Infrastructure Setup

1. **Configure Terraform variables:**
   ```bash
   cd infra/terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

2. **Deploy infrastructure:**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

3. **Note the outputs:**
   - Public IP for your server
   - SSH connection command
   - Application URL

### Application Deployment

1. **Connect to your server:**
   ```bash
   ssh -i ./team-tasks-key.pem ubuntu@YOUR_PUBLIC_IP
   ```

2. **Deploy your application:**
   - Transfer your code to the server
   - Build and run Docker containers
   - Configure environment variables

## Security Features

- ✅ **Network Security**: VPC with private subnets and security groups
- ✅ **SSH Restrictions**: Configurable IP whitelisting for SSH access
- ✅ **Database Security**: Supabase RLS policies protect user data
- ✅ **Secrets Management**: Environment variables for sensitive data
- ✅ **HTTPS Ready**: Security group configured for SSL termination

## Development

### Database Schema
- **Users**: Managed by Supabase Auth
- **Tasks**: User-scoped with RLS policies
- **Policies**: Row-level security ensures data isolation

### Docker
- **Multi-stage build**: Optimized for production
- **Non-root user**: Security best practices
- **Health checks**: Container monitoring

### Infrastructure
- **Modular Terraform**: Separate network and compute modules
- **State management**: Remote state recommended for teams
- **Cost optimized**: t2.micro instance with minimal resources

## Cost Estimation (AWS Free Tier)

| Resource | Free Tier Limit | Cost After Limit |
|----------|----------------|------------------|
| EC2 t2.micro | 750 hours/month | $0.0116/hour |
| EBS Storage | 30GB | $0.10/GB-month |
| Data Transfer | 15GB/month | $0.09/GB |
| Elastic IP | Free when attached | $0.005/hour when unattached |

## Cleanup

To avoid charges, destroy resources when not needed:
```bash
cd infra/terraform
terraform destroy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Security Notice

⚠️ **Important**: Never commit sensitive files to Git:
- `.env*` files with real credentials
- `terraform.tfvars` with real values  
- `*.pem` SSH private keys
- `terraform.tfstate` files
- AWS credentials or policies

Use the provided `.example` files as templates.

## Database

Two SQL files will help you set up and seed your database:

- `sql/001_schema_and_policies.sql`: Creates `tasks` table and RLS policies
- `sql/002_seed.sql`: Inserts sample tasks

Run them in Supabase SQL editor or via CLI in order.

## Auth

- Email + password sign in
- Magic link (email OTP) sign-in supported
- Confirm route is `/auth/confirm`

## Pages

- `/login`: Login form and magic link
- `/register`: Create account
- `/tasks`: CRUD UI for personal tasks

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
