# AIVO Authentication System - Simplified Mode

## 🎯 Overview

The AIVO authentication system has been rebuilt to support **local-first authentication** that works without requiring backend services. This enables:

- ✅ Instant demo access for investors
- ✅ Quick testing without infrastructure setup
- ✅ Development without waiting for backend services
- ✅ Smooth transition to backend auth when ready

## 🚀 Quick Start

### Demo Credentials (Pre-seeded)

The system comes with pre-seeded demo accounts for each role:

| Role | Email | Password | Name |
|------|-------|----------|------|
| Parent | `parent@demo.com` | `demo123` | Sarah Johnson |
| Teacher | `teacher@demo.com` | `demo123` | Michael Chen |
| District Admin | `district@demo.com` | `demo123` | Emily Rodriguez |
| System Admin | `admin@demo.com` | `demo123` | David Smith |

### Using the Auth System

```tsx
import { AuthProvider, useAuth, DemoCredentials } from '@aivo/auth';

// 1. Wrap your app with AuthProvider
function App() {
  return (
    <AuthProvider>
      <YourAppComponents />
    </AuthProvider>
  );
}

// 2. Use authentication in components
function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login({ email, password });
      // User is now authenticated!
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      
      {/* Show demo credentials for easy testing */}
      <DemoCredentials onSelectCredentials={(email, password) => {
        setEmail(email);
        setPassword(password);
      }} />
    </div>
  );
}

// 3. Check auth status
function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Welcome, {user.firstName}!</div>;
}
```

## 🔄 How It Works

### Local Mode (Default)

- **Storage**: User data stored in `localStorage` under key `aivo_users`
- **Tokens**: Mock JWT tokens generated client-side (base64 encoded)
- **Validation**: Email/password checked against local storage
- **Session**: Persists across page reloads using localStorage

### Backend Mode (Optional)

To switch to backend authentication, set environment variable:

```env
VITE_USE_BACKEND_AUTH=true
VITE_API_BASE_URL=http://localhost:8001
```

## 📝 API Methods

### AuthService

```typescript
// Sign up new user
await authService.signup({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  role: UserRole.PARENT
});

// Login
await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get current user
const user = await authService.getCurrentUser();

// Logout
await authService.logout();

// Check if authenticated
const isAuth = authService.isAuthenticated();
```

### useAuth Hook

```typescript
const {
  user,              // Current user object or null
  session,           // Session details with tokens
  loading,           // Loading state
  error,             // Error message if any
  isAuthenticated,   // Boolean - is user logged in?
  login,             // Login function
  signup,            // Signup function
  logout,            // Logout function
  hasRole,           // Check if user has specific role
  hasPermission,     // Check if user has permission
} = useAuth();
```

## 🎭 Demo Features

### Automatic Seeding

Demo users are automatically seeded when the auth service initializes in local mode. No manual setup required!

### DemoCredentials Component

Display demo accounts to users with one-click auto-fill:

```tsx
<DemoCredentials onSelectCredentials={(email, password) => {
  // Auto-fill form fields
  setEmail(email);
  setPassword(password);
}} />
```

## 🔐 Security Notes

### Local Mode
- ⚠️ **For development/demo only** - not production-ready
- Passwords stored in plain text in localStorage
- No encryption or hashing
- Anyone with browser access can view/edit data

### Production Deployment
- Set `VITE_USE_BACKEND_AUTH=true`
- Configure proper backend with:
  - Password hashing (bcrypt)
  - Secure JWT signing
  - HTTPS only
  - Rate limiting
  - Session management
  - Token refresh flows

## 🛠️ Customization

### Add Custom Demo Users

Edit `packages/auth/src/services/demoUsers.ts`:

```typescript
export const DEMO_USERS: DemoUser[] = [
  {
    id: 'custom_user_1',
    email: 'custom@demo.com',
    password: 'custom123',
    firstName: 'Custom',
    lastName: 'User',
    role: UserRole.PARENT,
    emailVerified: true,
    mfaEnabled: false,
    createdAt: new Date().toISOString(),
  },
  // ... more users
];
```

### Clear Local Storage

To reset all users and start fresh:

```javascript
localStorage.removeItem('aivo_users');
// Reload page to re-seed demo users
```

## 📦 What's Included

- ✅ Local-first authentication
- ✅ Demo user seeding
- ✅ Login/Signup/Logout flows
- ✅ Role-based access control
- ✅ Session management
- ✅ Token refresh (mock in local mode)
- ✅ React hooks and context
- ✅ Protected route components
- ✅ Demo credentials component

## 🚫 What's NOT Included (In Local Mode)

- ❌ Password hashing
- ❌ Email verification
- ❌ Password reset via email
- ❌ MFA/2FA (disabled in local mode)
- ❌ OAuth/SSO integration
- ❌ Server-side validation
- ❌ Rate limiting
- ❌ Audit logging

## 🎯 Perfect For

- 👥 Investor demos
- 🧪 Quick testing and prototyping
- 🎨 UI/UX development
- 📱 Frontend-only development
- 🚀 Rapid iteration

## 🔄 Migration Path

When ready for production:

1. Set `VITE_USE_BACKEND_AUTH=true`
2. Implement backend authentication service
3. Test both modes work correctly
4. Deploy with backend auth enabled
5. Remove demo credentials from production builds

## 📚 Additional Resources

- **Auth Provider**: `packages/auth/src/auth-provider.ts`
- **Auth Service**: `packages/auth/src/services/authService.ts`
- **Demo Users**: `packages/auth/src/services/demoUsers.ts`
- **Type Definitions**: `packages/auth/src/types/auth.types.ts`

---

**Built for AIVO Learning Platform** | Easy demo access, powerful when you need it
