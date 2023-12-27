# **Project: Course Review System REST API**

### Live Preview Link: [https://course-review-system.vercel.app](https://course-review-system.vercel.app)

### API Documentation Link: [https://documenter.getpostman.com/view/27288976/2s9YkuYHrZ](https://documenter.getpostman.com/view/27288976/2s9YkuYHrZ)

# **Project Requirements:**

### **Technology Stack:**

- **Programming Language:** TypeScript
- **Web Framework:** Express.js
- **Object Data Modeling (ODM) and Validation Library:** Mongoose for MongoDB

## **Models:**

## 1. User Model:

1. **\_id (Object ID):** A distinctive identifier generated by MongoDB.
2. **username (string):** The username of the user. This field holds a unique identifier for the user.
3. **email (string):** The email address of the user. This field stores the user's email, ensuring it is unique.
4. **password (string):** The password linked to the user's account, securely hashed. Strong password validation is encouraged, with specified format requirements. If implementing password strength validation, please provide the password format and appropriate error message for user guidance.
5. **role ('user' | 'admin'):** The role of the user, which can be either 'user' or 'admin'. This field determines the user's level of access or permissions. The default role is set to 'user'.

## 2. **Course Model:**

- **\_id (Object ID):** A distinctive identifier generated by MongoDB.
- **title (String):** A **unique** title of the course.
- **instructor (String):** The instructor of the course.
- **categoryId (Object ID):** A reference to the category collection.
- **price (Number):** The price of the course.
- **tags(Array of Object):** The "tags" field is an array of objects, each having a "name" (string) and "isDeleted" (boolean) property.
- **startDate (String):** The start date of the course.
- **endDate (String):** The end date of the course.
- **language (String):** The language in which the course is conducted.
- **provider (String):** The provider of the course.
- **durationInWeeks (Integer):** This represents the course's overall duration in weeks, **calculated by applying the ceil function to the numeric value derived from the start and end dates**. The resulting number is rounded up to the nearest integer, ensuring that the duration is expressed solely as an integer with no allowance for floating-point numbers.
- **details (Object):**
  - **level (string):** e.g., Beginner, Intermediate, Advanced.
  - **description (string):** Detailed description of the course
- **createdBy (Object ID):** A reference to the user collection.

## 3. **Category Model:**

- **\_id (Object ID):** A distinctive identifier generated by MongoDB.
- **name (String):** A unique name of the category.
- **createdBy (Object ID):** A reference to the user collection.

## 4. **Review Model:**

- **\_id (Object ID):** A distinctive identifier generated by MongoDB.
- **courseId (Object ID):** A reference to the course collection.
- **rating (Number):** Rating, which falls within the range of 1 to 5.
- **review (String):** The comment or review text provided by the user.
- **createdBy (Object ID):** A reference to the user collection.

## **Error Handling:**

Implemented proper error handling throughout the application. Used global error handling middleware to catch and handle errors, providing appropriate error responses with status codes and error messages.

### **Error Response Object:**

- **success:** false
- **message:** Error Type → Validation Error, Cast Error, Duplicate Entry
- **errorMessage**: A concise error message. A concatenated string containing detailed error information.
- **errorDetails:**: Detailed information about the error
- **stack**: Stack trace for debugging purposes

### **Sample Error Response:**

- For Cast Error

```json
{
  "success": false,
  "message": "Invalid ID",
  "errorMessage": "6578da845607cddc165beea4xxx is not a valid ID!",
  "errorDetails": {
    "stringValue": "\"6578da845607cddc165beea4xxx\"",
    "valueType": "string",
    "kind": "ObjectId",
    "value": "6578da845607cddc165beea4xxx",
    "path": "_id",
    "reason": {},
    "name": "CastError",
    "message": "Cast to ObjectId failed for value \"6578da845607cddc165beea4xxx\" (type string) at path \"_id\" for model \"Course\""
  },
  "stack": "CastError: Cast to ObjectId failed for value \"6578da845607cddc165beea4xxx\" (type string) at path \"_id\" for model \"Course\"\n    at SchemaObjectId.cast (/var/task/node_modules/mongoose/lib/schema/objectId.js:250:11)\n    at SchemaType.applySetters (/var/task/node_modules/mongoose/lib/schemaType.js:1219:12)\n    at SchemaType.castForQuery (/var/task/node_modules/mongoose/lib/schemaType.js:1633:15)\n    at cast (/var/task/node_modules/mongoose/lib/cast.js:375:32)\n    at Query.cast (/var/task/node_modules/mongoose/lib/query.js:4768:12)\n    at Query._castConditions (/var/task/node_modules/mongoose/lib/query.js:2200:10)\n    at model.Query._findOne (/var/task/node_modules/mongoose/lib/query.js:2484:8)\n    at model.Query.exec (/var/task/node_modules/mongoose/lib/query.js:4290:80)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
}
```

- For Validation Error (Zod)

```json
{
  "success": false,
  "message": "Validation Error",
  "errorMessage": "language is required. provider is required.",
  "errorDetails": {
    "issues": [
      {
        "code": "invalid_type",
        "expected": "string",
        "received": "undefined",
        "path": ["body", "language"],
        "message": "Required"
      },
      {
        "code": "invalid_type",
        "expected": "string",
        "received": "undefined",
        "path": ["body", "provider"],
        "message": "Required"
      }
    ],
    "name": "ZodError"
  },
  "stack": "ZodError: [\n  {\n    \"code\": \"invalid_type\",\n    \"expected\": \"string\",\n    \"received\": \"undefined\",\n    \"path\": [\n      \"body\",\n      \"language\"\n    ],\n    \"message\": \"Required\"\n  },\n  {\n    \"code\": \"invalid_type\",\n    \"expected\": \"string\",\n    \"received\": \"undefined\",\n    \"path\": [\n      \"body\",\n      \"provider\"\n    ],\n    \"message\": \"Required\"\n  }\n]\n    at get error [as error] (/var/task/node_modules/zod/lib/types.js:43:31)\n    at ZodObject.parseAsync (/var/task/node_modules/zod/lib/types.js:166:22)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
}
```

- For Duplicate Error (Mongoose)

```json
{
  "success": false,
  "message": "Duplicate Error",
  "errorMessage": "Web Development Bootcamp already exists!",
  "errorDetails": {
    "index": 0,
    "code": 11000,
    "keyPattern": {
      "title": 1
    },
    "keyValue": {
      "title": "Web Development Bootcamp"
    }
  },
  "stack": "MongoServerError: E11000 duplicate key error collection: crs-db.courses index: title_1 dup key: { title: \"Web Development Bootcamp\" }\n    at InsertOneOperation.execute (E:\\PH Next Level Web Development\\Assignment-3\\node_modules\\mongodb\\src\\operations\\insert.ts:79:13)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at executeOperationAsync (E:\\PH Next Level Web Development\\Assignment-3\\node_modules\\mongodb\\src\\operations\\execute_operation.ts:190:12)"
}
```

- For Validation Error (Mongoose)

```json
{
  "success": false,
  "message": "Validation Error",
  "errorMessage": "null is not a valid data!",
  "errorDetails": {
    "errors": {
      "provider": {
        "name": "ValidatorError",
        "message": "Provider is required",
        "properties": {
          "message": "Provider is required",
          "type": "required",
          "path": "provider"
        },
        "kind": "required",
        "path": "provider"
      },
      "language": {
        "name": "ValidatorError",
        "message": "Language is required",
        "properties": {
          "message": "Language is required",
          "type": "required",
          "path": "language"
        },
        "kind": "required",
        "path": "language"
      }
    },
    "_message": "Course validation failed",
    "name": "ValidationError",
    "message": "Course validation failed: provider: Provider is required, language: Language is required"
  },
  "stack": "ValidationError: Course validation failed: provider: Provider is required, language: Language is required\n    at model.Document.invalidate (E:\\PH Next Level Web Development\\Assignment-3\\node_modules\\mongoose\\lib\\document.js:3187:32)\n    at E:\\PH Next Level Web Development\\Assignment-3\\node_modules\\mongoose\\lib\\document.js:2980:17\n    at E:\\PH Next Level Web Development\\Assignment-3\\node_modules\\mongoose\\lib\\schemaType.js:1368:9\n    at processTicksAndRejections (node:internal/process/task_queues:77:11)"
}
```

- Not found error for invalid api endpoint (Express )

```json
{
  "success": false,
  "message": "API NOT FOUND",
  "error": ""
}
```

## **Authentication Endpoints:**

### 1. User Registration

- **Route:** `/api/auth/register`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "123456",
    "role": "user"
  }
  ```
- **Response:**
  - The password field or any other security-related field is not included in the response data.
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "User registered successfully",
    "data": {
      "_id": "54321abcde67890fghij",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  }
  ```

### 2. User Login

- **Route:** `/api/auth/login`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "username": "john_doe",
    "password": "123456"
  }
  ```
- **Response:**
  - The password field or any other security-related field is not included in the response data.
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "User login successful",
    "data": {
      "user": {
        "_id": "54321abcde67890fghij",
        "username": "john_doe",
        "email": "john@example.com",
        "role": "user"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    }
  }
  ```

In this example:

- The request body includes the user's credentials, such as `username` and `password`.
- The response includes a success indicator, status code, message, and data containing user details (such as `_id`, `username`, `email`, `role`) & JWT token.

**JWT Token Payload:**

```json
{
  "_id": "54321abcde67890fghij", // User's _id
  "role": "user", // User's role
  "email": "john@example.com", // User's email
  "iat": 1626619535, // Issued At (timestamp)
  "exp": 1626623535 // Expiration (timestamp)
}
```

### **3. Change Password**

- **Route:** **`/api/auth/change-password`**
- **Method:** POST
- **Request Headers:**

```markdown
Authorization: <JWT_TOKEN>
```

- **Request Body:**

```json
{
  "currentPassword": "123456",
  "newPassword": "new123456"
}
```

- **`currentPassword`**: The user's current password for verification.
- **`newPassword`**: The new password the user wants to set.

- **Response:**
  - Make sure that the password field or any other security-related field is not included in the response data.

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully",
  "data": {
    "_id": "54321abcde67890fghij",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-02T12:30:00.000Z"
  }
}
```

- The response includes a success indicator, status code, message, and updated user details.

### **Password Change Rules:**

- The system stores only the last 2 previous passwords with timestamps.
- During a password change attempt:
  - The user cannot reuse any of the last 2 passwords or the current one.
  - If the new password matches any of the previous 2 passwords or the current one, the password change fails.
  - If the new password is unique and different from the current password, the password change is successful.

**Response (if password change failed):**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Password change failed. Ensure the new password is unique and not among the last 2 used (last used on 2023-01-01 at 12:00 PM).",
  "data": null
}
```

## **Management Endpoints:**

### **1. Create a Course**

- **Endpoint:** **`/api/course`**
- **Method:** **POST**
- **Request Body:**

```json
{
  "title": "Next Level Web Development",
  "instructor": "Jhankar Mahbub",
  "categoryId": "6578d94030fa7cbd554505f5",
  "price": 55,
  "tags": [
    { "name": "TypeScript", "isDeleted": false },
    { "name": "MongoDB", "isDeleted": false },
    { "name": "NextJs", "isDeleted": false }
  ],
  "startDate": "2023-11-01",
  "endDate": "2024-04-1",
  "language": "Bangla",
  "provider": "Programming Hero",
  "details": {
    "level": "Intermediate",
    "description": "Advance web development with latest technologies."
  }
}
```

- **Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Course created successfully",
  "data": {
    "title": "Next Level Web Development",
    "instructor": "Jhankar Mahbub",
    "categoryId": "6578d94030fa7cbd554505f5",
    "price": 55,
    "tags": [
      {
        "name": "TypeScript",
        "isDeleted": false,
        "_id": "6579a07668bad099b39bd8ef"
      },
      {
        "name": "MongoDB",
        "isDeleted": false,
        "_id": "6579a07668bad099b39bd8f0"
      },
      {
        "name": "NextJs",
        "isDeleted": false,
        "_id": "6579a07668bad099b39bd8f1"
      }
    ],
    "startDate": "2023-11-01",
    "endDate": "2024-04-1",
    "language": "Bangla",
    "provider": "Programming Hero",
    "details": {
      "level": "Intermediate",
      "_id": "6579a07668bad099b39bd8f2"
    },
    "createdBy": {
      "_id": "658c52d3dcc803ef42fb469b",
      "username": "siam",
      "email": "siam@example.com",
      "role": "admin"
    },
    "_id": "6579a07668bad099b39bd8ee",
    "durationInWeeks": 22,
    "__v": 0
  }
}
```

### 2. Get Paginated and Filtered Courses.

- **Endpoint:** **`/api/courses`**
- **Method:** **GET**

### Query Parameters for API Requests:

When interacting with the API, you can utilize the following query parameters to customize and filter the results according to your preferences.

- page: (Optional) Specifies the page number for paginated results. Default is 1.
  Example: ?page=2
- limit: (Optional) Sets the number of items per page. Default is a predefined limit.
  Example: ?limit=10

- sortBy: (Optional) Specifies the field by which the results should be sorted. Only applicable to the following fields: `title`, `price`, `startDate`, `endDate`, `language`, `durationInWeeks`.
  Example: ?sortBy=startDate

- sortOrder: (Optional) Determines the sorting order, either 'asc' (ascending) or 'desc' (descending).
  Example: ?sortOrder=desc

- minPrice, maxPrice: (Optional) Filters results by a price range.
  Example: ?minPrice=20.00&maxPrice=50.00

- tags: (Optional) Filters results by the name of a specific tag.
  Example: ?tags=Programming

- startDate, endDate: (Optional) Filters results by a date range.
  Example: ?startDate=2023-01-01&endDate=2023-12-31

- language: (Optional) Filters results by the language of the course.
  Example: ?language=English

- provider: (Optional) Filters results by the course provider.
  Example: ?provider=Tech Academy

- durationInWeeks: (Optional) Filters results by the duration of the course in weeks.
  Example: ?durationInWeeks=8

- level: (Optional) Filters results by the difficulty level of the course.
  Example: ?level=Intermediate

**Filter Request:** **/api/courses/**`?startDate=2023-01-15&endDate=2023-05-01&level=Intermediate&provider=Data Science Institute&language=English&durationInWeeks=8&minPrice=25&maxPrice=50&limit=2&page=1&tags=Data Science`

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Courses retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 2,
    "total": 8
  },
  "data": [
    {
      "_id": "6578da725607cddc165bee9d",
      "title": "Machine Learning Fundamentals",
      "instructor": "Jane Smith",
      "categoryId": "657764baa6238555266e7110",
      "price": 49.99,
      "tags": [
        {
          "name": "Python",
          "isDeleted": false,
          "_id": "6578da725607cddc165bee9e"
        },
        {
          "name": "Intermediate",
          "isDeleted": false,
          "_id": "6578da725607cddc165bee9f"
        },
        {
          "name": "Data Science",
          "isDeleted": false,
          "_id": "6578da725607cddc165beea0"
        }
      ],
      "startDate": "2023-02-10",
      "endDate": "2023-04-01",
      "language": "English",
      "provider": "Data Science Institute",
      "details": {
        "level": "Intermediate",
        "_id": "6578da725607cddc165beea1"
      },
      "createdBy": {
        "_id": "658c52d3dcc803ef42fb469b",
        "username": "siam",
        "email": "siam@example.com",
        "role": "admin"
      },
      "durationInWeeks": 8,
      "__v": 0
    }
  ]
}
```

**Sort Request:** **/api/courses/**`?sortBy=price&sortOrder=desc`

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Courses retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8
  },
  "data": [
    {
      "_id": "6578da9c5607cddc165beeb3",
      "title": "Data Science Essentials",
      "instructor": "Dr. Maria Martinez",
      "categoryId": "657764a0a6238555266e710e",
      "price": 129.99,
      "tags": [
        {
          "name": "Python",
          "isDeleted": false,
          "_id": "6578da9c5607cddc165beeb4"
        },
        {
          "name": "Data Science",
          "isDeleted": false,
          "_id": "6578da9c5607cddc165beeb5"
        },
        {
          "name": "Beginner",
          "isDeleted": false,
          "_id": "6578da9c5607cddc165beeb6"
        }
      ],
      "startDate": "2023-05-20",
      "endDate": "2023-07-15",
      "language": "English",
      "provider": "Data Insights",
      "details": {
        "level": "Beginner",
        "_id": "6578da9c5607cddc165beeb7"
      },
      "createdBy": {
        "_id": "658c52d3dcc803ef42fb469b",
        "username": "siam",
        "email": "siam@example.com",
        "role": "admin"
      },
      "durationInWeeks": 8,
      "__v": 0
    },
    {
      "_id": "6578da845607cddc165beea4",
      "title": "Web Development Bootcamp",
      "instructor": "Alex Johnson",
      "categoryId": "6578d94030fa7cbd554505f5",
      "price": 99.99,
      "tags": [
        {
          "name": "HTML",
          "isDeleted": false,
          "_id": "6578da845607cddc165beea5"
        },
        {
          "name": "CSS",
          "isDeleted": false,
          "_id": "6578da845607cddc165beea6"
        },
        {
          "name": "JavaScript",
          "isDeleted": false,
          "_id": "6578da845607cddc165beea7"
        },
        {
          "name": "Intermediate",
          "isDeleted": false,
          "_id": "6578da845607cddc165beea8"
        }
      ],
      "startDate": "2023-03-15",
      "endDate": "2023-05-01",
      "language": "English",
      "provider": "Code Masters",
      "details": {
        "level": "Intermediate",
        "_id": "6578da845607cddc165beea9"
      },
      "createdBy": {
        "_id": "658c52d3dcc803ef42fb469b",
        "username": "siam",
        "email": "siam@example.com",
        "role": "admin"
      },
      "durationInWeeks": 7,
      "__v": 0
    }
    // more objects
  ]
}
```

### 3. Create a Category

- **Endpoint:** **`/api/categories`**
- **Method:** **POST**
- **Request Body:**

```json
{
  "name": "Electronics"
}
```

- **Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Category is created successfully",
  "data": {
    "name": "Electronics",
    "createdBy": "658c52d3dcc803ef42fb469b",
    "_id": "6579a17f332277e55bdace8c",
    "__v": 0
  }
}
```

### 4. Get All Categories

- **Endpoint:** **`/api/categories`**
- **Method:** **GET**
- **Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories are retrieved successfully",
  "data": [
    {
      "_id": "65772a74855a0b6e2c9ad918",
      "name": "Programming",
      "createdBy": {
        "_id": "658c52d3dcc803ef42fb469b",
        "username": "siam",
        "email": "siam@example.com",
        "role": "admin"
      },
      "__v": 0
    },
    {
      "_id": "65772ac2855a0b6e2c9ad91c",
      "name": "UI/UX Design",
      "createdBy": {
        "_id": "658c52d3dcc803ef42fb469b",
        "username": "siam",
        "email": "siam@example.com",
        "role": "admin"
      },
      "__v": 0
    },
    {
      "_id": "657764a0a6238555266e710e",
      "name": "Data Science",
      "createdBy": {
        "_id": "658c52d3dcc803ef42fb469b",
        "username": "siam",
        "email": "siam@example.com",
        "role": "admin"
      },
      "__v": 0
    }
    // more categories
  ]
}
```

### 5. Create a Review

- **Endpoint:** **`/api/reviews`**
- **Method:** **POST**
- **Request Body:**

```json
{
  "courseId": "6579a07668bad099b39bd8ee",
  "rating": 5,
  "review": "Best course ever!!!"
}
```

- **Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Review created successfully",
  "data": {
    "_id": "658c5be6dcc803ef42fb471e",
    "courseId": "658c569fdcc803ef42fb46b2",
    "rating": 5,
    "review": "Shei",
    "createdBy": {
      "_id": "658c51720ad4f1deee11093e",
      "username": "saidul",
      "email": "saidul@example.com",
      "role": "user"
    },
    "createdAt": "2023-12-27T17:16:22.375Z",
    "updatedAt": "2023-12-27T17:16:22.375Z"
  }
}
```

### 6. Update a Course (Partial Update with Dynamic Update)\*\*

- **Endpoint:** **`/api/courses/:courseId`**
- **Method:** **PUT**
- **Request Body:**
  - You can send the partial body data to update the fields you want to update or the full data if you want to update every field of a course. Dynamic updating is ensured for both primitive and non-primitive data to prevent the mutation of non-primitive data.

```json
{
  "durationInWeeks": 5000, // Can't update directly
  "price": 60, // Trying to update
  "language": "Banglish", // Trying to update
  "details": {
    "level": "Advanced" // Trying to update
  },
  "tags": [
    {
      "name": "TypeScript",
      "isDeleted": false,
      "_id": "6579a07668bad099b39bd8ef"
    },
    {
      "name": "Mongoose", // Trying to update
      "isDeleted": false,
      "_id": "6579a07668bad099b39bd8f0"
    },
    {
      "name": "NextJs",
      "isDeleted": false,
      "_id": "6579a07668bad099b39bd8f1"
    },
    {
      "name": "AWS", // Trying to update
      "isDeleted": false,
      "_id": "6579a07668bad099b39bd8f1"
    }
  ],
  "startDate": "2023-11-01",
  "endDate": "2024-04-30" // Trying to update
}
```

- **Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Course updated successfully",
  "data": {
    "_id": "6579a07668bad099b39bd8ee",
    "title": "Next Level Web Development",
    "instructor": "Jhankar Mahbub",
    "categoryId": "6578d94030fa7cbd554505f5",
    "price": 60, // Updated Data
    "tags": [
      {
        "name": "TypeScript",
        "isDeleted": false,
        "_id": "6579a07668bad099b39bd8ef"
      },
      {
        "name": "Mongoose", // Updated Data
        "isDeleted": false,
        "_id": "6579a07668bad099b39bd8f0"
      },
      {
        "name": "NextJs",
        "isDeleted": false,
        "_id": "6579a07668bad099b39bd8f1"
      },
      {
        "name": "AWS", // Updated Data
        "isDeleted": false,
        "_id": "6579a07668bad099b39bd8f1"
      }
    ],
    "startDate": "2023-11-01",
    "endDate": "2024-04-1", // Updated Data
    "language": "Banglish", // Updated Data
    "provider": "Programming Hero",
    "details": {
      "level": "Advanced", // Updated Data
      "_id": "6579a07668bad099b39bd8f2"
    },
    "createdBy": {
      "_id": "658c51720ad4f1deee11093e",
      "username": "saidul",
      "email": "saidul@example.com",
      "role": "admin"
    },
    "durationInWeeks": 26, // Updated with start and end date
    "__v": 0
  }
}
```

### 7. Get Course by ID with Reviews\*\*

- **Endpoint:** **`/api/courses/:courseId/reviews`**
- **Method:** **GET**
- **Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Course and Reviews retrieved successfully",
  "data": {
    "course": {
      "_id": "6579a07668bad099b39bd8ee",
      "title": "Next Level Web Development",
      "instructor": "Jhankar Mahbub",
      "categoryId": "6578d94030fa7cbd554505f5",
      "price": 55,
      "tags": [
        {
          "name": "TypeScript",
          "isDeleted": false,
          "_id": "6579a07668bad099b39bd8ef"
        },
        {
          "name": "MongoDB",
          "isDeleted": false,
          "_id": "6579a07668bad099b39bd8f0"
        },
        {
          "name": "NextJs",
          "isDeleted": false,
          "_id": "6579a07668bad099b39bd8f1"
        }
      ],
      "startDate": "2023-11-01",
      "endDate": "2024-04-1",
      "language": "Bangla",
      "provider": "Programming Hero",
      "details": {
        "level": "Intermediate",
        "_id": "6579a07668bad099b39bd8f2"
      },
      "createdBy": {
        "_id": "658c51720ad4f1deee11093e",
        "username": "saidul",
        "email": "saidul@example.com",
        "role": "admin"
      },
      "durationInWeeks": 22,
      "__v": 0
    },
    "reviews": [
      {
        "_id": "6579a36a68bad099b39bd904",
        "courseId": "6579a07668bad099b39bd8ee",
        "rating": 5,
        "review": "Best course ever!!!",
        "createdBy": {
          "_id": "658c51720ad4f1deee11093e",
          "username": "saidul",
          "email": "saidul@example.com",
          "role": "user"
        },
        "__v": 0
      },
      {
        "_id": "6579a37968bad099b39bd906",
        "courseId": "6579a07668bad099b39bd8ee",
        "rating": 5,
        "review": "Awesome Course!!!",
        "createdBy": {
          "_id": "658c51720ad4f1deee11093e",
          "username": "saidul",
          "email": "saidul@example.com",
          "role": "user"
        },
        "__v": 0
      },
      {
        "_id": "6579a38868bad099b39bd908",
        "courseId": "6579a07668bad099b39bd8ee",
        "rating": 5,
        "review": "Love it!",
        "createdBy": {
          "_id": "658c51720ad4f1deee11093e",
          "username": "saidul",
          "email": "saidul@example.com",
          "role": "user"
        },
        "__v": 0
      }
      // Additional Reviews
    ]
  }
}
```

### 8. Get the Best Course Based on Average Review (Rating)

- **Endpoint:** **`/api/course/best`**
- **Method:** **GET**
- **Response:**
  - The response includes details about the course, its average rating, and the total number of reviews

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Best course retrieved successfully",
  "data": {
    "course": {
      "_id": "6578da9c5607cddc165beeb3",
      "title": "Data Science Essentials",
      "instructor": "Dr. Maria Martinez",
      "categoryId": "657764a0a6238555266e710e",
      "price": 129.99,
      "tags": [
        {
          "name": "Python",
          "isDeleted": false,
          "_id": "6578da9c5607cddc165beeb4"
        },
        {
          "name": "Data Science",
          "isDeleted": false,
          "_id": "6578da9c5607cddc165beeb5"
        },
        {
          "name": "Beginner",
          "isDeleted": false,
          "_id": "6578da9c5607cddc165beeb6"
        }
      ],
      "startDate": "2023-05-20",
      "endDate": "2023-07-15",
      "language": "English",
      "provider": "Data Insights",
      "details": {
        "level": "Beginner",
        "_id": "6578da9c5607cddc165beeb7"
      },
      "createdBy": {
        "_id": "658c51720ad4f1deee11093e",
        "username": "saidul",
        "email": "saidul@example.com",
        "role": "admin"
      },
      "durationInWeeks": 8,
      "__v": 0
    },
    "averageRating": 5,
    "reviewCount": 1
  }
}
```

      

## Validation with Zod

- Used Zod to validate incoming data for course, category and review creation and updating operations.
- Ensured that the data adheres to the structure defined in the models.
- Handled validation errors gracefully and provide meaningful error messages in the API responses.

### Unauthorized Error Response

        If an unauthorized access attempt is detected, the system will respond with the following error message:

        ```json
        {
            "success": false,
            "message": "Unauthorized Access",
            "errorMessage": "You do not have the necessary permissions to access this resource.",
            "errorDetails": null,
            "stack": null
        }
        ```

        This error may occur under the following circumstances:

        - **JWT Expiry:** The provided JWT (JSON Web Token) has expired.
        - **Invalid JWT:** The JWT provided is invalid or malformed.
        - **Undefined JWT:** No JWT is provided in the request headers.
        - **Not Authorized User:** The user does not possess the required permissions for the requested action or resource.
        - **Access Denied:** The user is attempting to access a resource without the necessary authorization.