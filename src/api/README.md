# API Architecture Documentation

## Overview

This directory contains all external API integrations using RTK Query. The architecture is designed to be clean, scalable, and maintainable following senior developer best practices.

## 📁 Folder Structure

```
src/api/
├── index.ts                     # Main exports
├── base/                        # Base configurations
│   ├── baseApi.ts              # Base RTK Query setup
│   ├── endpoints.ts            # Common utilities
│   └── index.ts                # Base exports
├── external/                    # Third-party APIs
│   ├── licenseValidation/      # DMV license validation
│   │   ├── api.ts             # API endpoints
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── index.ts           # Module exports
│   └── index.ts               # External API exports
└── internal/                   # Internal APIs (admin, etc.)
    └── index.ts               # Internal API exports
```

## 🎯 When to Use RTK Query vs Services

### ✅ Use RTK Query for:
- **External REST APIs** that benefit from caching
- **Third-party integrations** (payment processors, validation services)
- **APIs with complex state management** needs
- **Data that changes infrequently** and can be cached
- **APIs that need optimistic updates**

### ❌ Don't use RTK Query for:
- **Firebase operations** (use FirebaseService directly)
- **Realm database operations** (use RealmService directly)
- **Real-time data** (use Firebase listeners)
- **File uploads to Firebase** (use FirebaseService)
- **Simple one-off API calls**

## 🚀 Creating a New External API

### Step 1: Create the folder structure
```bash
mkdir -p src/api/external/your-api-name
touch src/api/external/your-api-name/{api.ts,types.ts,index.ts}
```

### Step 2: Define types (`types.ts`)
```typescript
export interface YourApiRequest {
  // Define request interface
}

export interface YourApiResponse {
  // Define response interface
}
```

### Step 3: Create API endpoints (`api.ts`)
```typescript
import { baseApi } from '../../base/baseApi';
import { CACHE_TIMES } from '../../base/endpoints';
import type { YourApiRequest, YourApiResponse } from './types';

export const yourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    yourEndpoint: builder.query<YourApiResponse, YourApiRequest>({
      query: (params) => ({
        url: 'https://your-api.com/endpoint',
        method: 'POST',
        body: params,
      }),
      providesTags: ['YourTag'],
      keepUnusedDataFor: CACHE_TIMES.MEDIUM,
    }),
  }),
});

export const { useYourEndpointQuery } = yourApi;
```

### Step 4: Export from module (`index.ts`)
```typescript
export * from './api';
export * from './types';
```

### Step 5: Add to external index
```typescript
// src/api/external/index.ts
export * from './your-api-name';
```

## 📝 Usage Examples

### Basic Query
```typescript
import { useValidateDriverLicenseQuery } from '@/api/external/licenseValidation';

function DriverValidation({ licenseNumber, state }) {
  const { data, isLoading, error } = useValidateDriverLicenseQuery({
    licenseNumber,
    state,
  });

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  
  return <div>License is {data.isValid ? 'valid' : 'invalid'}</div>;
}
```

### Lazy Query (trigger manually)
```typescript
import { useLazyValidateDriverLicenseQuery } from '@/api/external/licenseValidation';

function ManualValidation() {
  const [validateLicense, { data, isLoading }] = useLazyValidateDriverLicenseQuery();

  const handleValidate = () => {
    validateLicense({
      licenseNumber: 'D123456789',
      state: 'CA',
    });
  };

  return (
    <button onClick={handleValidate} disabled={isLoading}>
      Validate License
    </button>
  );
}
```

### Mutation
```typescript
import { useBulkValidateLicensesMutation } from '@/api/external/licenseValidation';

function BulkValidation() {
  const [bulkValidate, { isLoading }] = useBulkValidateLicensesMutation();

  const handleBulkValidate = async () => {
    try {
      const result = await bulkValidate({
        licenses: [
          { licenseNumber: 'D123', state: 'CA' },
          { licenseNumber: 'D456', state: 'NY' },
        ],
      }).unwrap();
      
      console.log('Validation results:', result);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <button onClick={handleBulkValidate} disabled={isLoading}>
      Bulk Validate
    </button>
  );
}
```

## 🔧 Configuration

### Cache Configuration
```typescript
// Available cache times
CACHE_TIMES = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes  
  LONG: 900,        // 15 minutes
  VERY_LONG: 3600,  // 1 hour
}
```

### Error Handling
All APIs automatically use the error interceptor for consistent error handling:
- Network errors are caught and displayed as toasts
- API errors are transformed to user-friendly messages
- Errors are logged for debugging

### Authentication
The base API automatically adds authentication headers when available:
```typescript
// Automatically added to all requests
headers.set('authorization', `Bearer ${token}`);
```

## 🧪 Testing

### Mocking APIs for Tests
```typescript
// In your test files
import { setupApiMocks } from '@/test-utils/api-mocks';

beforeEach(() => {
  setupApiMocks({
    validateDriverLicense: {
      isValid: true,
      status: 'active',
      // ... mock response
    },
  });
});
```

## 🔍 Best Practices

1. **Always define TypeScript interfaces** for requests and responses
2. **Use appropriate cache times** based on data freshness needs
3. **Transform responses** to match your app's data structure
4. **Provide meaningful tags** for cache invalidation
5. **Handle loading and error states** in components
6. **Use lazy queries** for user-triggered actions
7. **Keep API modules focused** on single responsibilities
8. **Document your APIs** with JSDoc comments

## 🚨 Common Pitfalls

- ❌ Don't use RTK Query for Firebase operations
- ❌ Don't cache data that changes frequently
- ❌ Don't forget to handle error states
- ❌ Don't use mutations for GET requests
- ❌ Don't ignore TypeScript warnings

## 📚 Additional Resources

- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Error Interceptor Documentation](../interceptors/README.md)
- [Services Documentation](../services/README.md)