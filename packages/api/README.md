# @aivo/api

Centralized, type-safe API client for the AIVO Learning Platform.

## Features

- ✅ Type-safe requests and responses
- ✅ Automatic retry logic
- ✅ Request/response interceptors
- ✅ Error handling and formatting
- ✅ Auth token injection
- ✅ React hooks for easy integration
- ✅ File upload support
- ✅ Progress tracking

## Installation

```bash
pnpm add @aivo/api
```

## Usage

### Basic Usage

```typescript
import { apiClient, API_ENDPOINTS } from '@aivo/api';

// GET request
const children = await apiClient.get(API_ENDPOINTS.children.list);

// POST request
const newChild = await apiClient.post(API_ENDPOINTS.children.create, {
  name: 'John Doe',
  age: 8,
  grade: 'Grade 3'
});

// With dynamic endpoint
const childDetails = await apiClient.get(
  API_ENDPOINTS.children.get('child-123')
);
```

### Using React Hooks

```typescript
import { useAPIGet, useAPIPost, API_ENDPOINTS } from '@aivo/api';

function ChildrenList() {
  const { data, loading, error, execute } = useAPIGet(
    API_ENDPOINTS.children.list
  );

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map(child => <li key={child.id}>{child.name}</li>)}
    </ul>
  );
}

function AddChild() {
  const { loading, execute } = useAPIPost(API_ENDPOINTS.children.create, {
    onSuccess: (data) => {
      console.log('Child created:', data);
    },
    onError: (error) => {
      console.error('Failed to create child:', error);
    }
  });

  const handleSubmit = async (formData) => {
    await execute(formData);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### File Upload

```typescript
import { useAPIUpload, API_ENDPOINTS } from '@aivo/api';

function HomeworkUpload() {
  const { progress, loading, execute } = useAPIUpload(
    API_ENDPOINTS.homework.upload
  );

  const handleFileSelect = async (file: File) => {
    const result = await execute(file);
    console.log('Upload complete:', result);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleFileSelect(e.target.files[0])} />
      {loading && <progress value={progress} max={100} />}
    </div>
  );
}
```

### Custom Configuration

```typescript
import { APIClient } from '@aivo/api';
import { tokenService } from '@aivo/auth';

const customClient = new APIClient({
  baseURL: 'https://api.aivolearning.com',
  timeout: 60000,
  retries: 5,
  getAuthToken: () => tokenService.getAccessToken(),
  onUnauthorized: () => {
    // Redirect to login
    window.location.href = '/login';
  }
});
```

## API Endpoints

All endpoints are organized by feature:

- `auth.*` - Authentication endpoints
- `children.*` - Child/student management
- `baseline.*` - Baseline assessment
- `learning.*` - Learning sessions
- `homework.*` - Homework helper
- `iep.*` - IEP management
- `curriculum.*` - Curriculum content
- `speech.*` - Speech therapy
- `sel.*` - Social-emotional learning
- `analytics.*` - Analytics and reporting
- `notifications.*` - Notifications
- `modelCloning.*` - AI model cloning
- `translation.*` - Translation services
- `billing.*` - Billing and subscriptions
- `district.*` - District management
- `aivo.*` - AIVO brain AI

## Error Handling

All API errors are formatted consistently:

```typescript
interface APIError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}
```

## License

Proprietary - AIVO Learning Platform
