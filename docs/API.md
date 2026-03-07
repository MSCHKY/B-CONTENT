# B/CONTENT API Documentation

This document describes the available API endpoints for the B/CONTENT application.

## 1. Generate API

### Generate Text Post
*   **Method + Path:** `POST /api/generate/text`
*   **Description:** Generates a text post based on the specified instance, content type, topic field, user input, and language using Google Gemini.

#### Request Body
```typescript
interface GenerateTextRequest {
    instance: "alex" | "ablas" | "bwg";
    contentType: string;
    topicField: string;
    userInput: string;
    language: "en" | "de";
}
```

#### Response Body
```typescript
interface GenerateTextResponse {
    text?: string;
    hashtags?: string[];
    charCount?: number;
    tokenCount?: number;
    mock: boolean;
    error?: string;
}
```

#### Example cURL
```bash
curl -X POST https://b-content.maschkeai.workers.dev/api/generate/text \
  -H "Content-Type: application/json" \
  -d '{
    "instance": "bwg",
    "contentType": "standard-post",
    "topicField": "innovation",
    "userInput": "New sustainable wire production method",
    "language": "en"
  }'
```

#### Error Responses
*   `500 Internal Server Error`: `{ "error": "Generation failed: [Error message]" }`

---

### Generate Image
*   **Method + Path:** `POST /api/generate/image`
*   **Description:** Generates an image based on the brand vDNA, instance, format, topic field, user input, and style using Google Gemini Imagen. Uploads the image to Cloudflare R2 and stores metadata in D1 database.

#### Request Body
```typescript
interface GenerateImageRequest {
    instance: "alex" | "ablas" | "bwg";
    format: "single-square" | "single-landscape" | "single-portrait" | "carousel-slide" | "company-banner";
    topicField: string;
    userInput: string;
    style?: "photo" | "illustration" | "abstract" | "infographic";
}
```

#### Response Body
```typescript
interface GenerateImageResponse {
    imageUrl?: string | null;
    imageId?: string;
    r2Key?: string;
    mimeType?: string;
    prompt?: string | null;
    modelText?: string | null;
    message?: string;
    mock: boolean;
    error?: string;
}
```

#### Example cURL
```bash
curl -X POST https://b-content.maschkeai.workers.dev/api/generate/image \
  -H "Content-Type: application/json" \
  -d '{
    "instance": "bwg",
    "format": "single-square",
    "topicField": "innovation",
    "userInput": "Futuristic wire factory",
    "style": "photo"
  }'
```

#### Error Responses
*   `500 Internal Server Error`: `{ "error": "Image generation failed: [Error message]" }`

---

### Generate Website Article
*   **Method + Path:** `POST /api/generate/website-article`
*   **Description:** Generates a cross-instance website article based on the provided topic field and user input.

#### Request Body
```typescript
interface GenerateWebsiteArticleRequest {
    topicField: string;
    userInput: string;
}
```

#### Response Body
```typescript
interface GenerateWebsiteArticleResponse {
    text?: string;
    charCount?: number;
    tokenCount?: number;
    mock: boolean;
    error?: string;
}
```

#### Example cURL
```bash
curl -X POST https://b-content.maschkeai.workers.dev/api/generate/website-article \
  -H "Content-Type: application/json" \
  -d '{
    "topicField": "sustainability",
    "userInput": "Our commitment to green energy"
  }'
```

#### Error Responses
*   `500 Internal Server Error`: `{ "error": "Generation failed: [Error message]" }`

---

## 2. Knowledge Base API

### Get Topics
*   **Method + Path:** `GET /api/knowledge/topics`
*   **Description:** Retrieves a list of all available topic fields from the knowledge base.

#### Request Body
_None_

#### Response Body
```typescript
interface TopicField {
    id: string; // e.g., "energie", "circular", etc.
    label: string;
    kernbotschaft: string;
    facts: Fact[];
}

interface Fact {
    id: string;
    content: string;
    source: string;
    topicField: string;
}

type GetTopicsResponse = TopicField[];
```

#### Example cURL
```bash
curl -X GET https://b-content.maschkeai.workers.dev/api/knowledge/topics
```

#### Error Responses
*   _None defined in basic flow_

---

### Get Quotes
*   **Method + Path:** `GET /api/knowledge/quotes`
*   **Description:** Retrieves quotes from the knowledge base. Can be filtered by author.

#### Request Body
_None_ (Query parameters: `?author={authorId}` optional)

#### Response Body
```typescript
interface Quote {
    id: string;
    content: string;
    author: "alex" | "ablas" | "fichtel" | "pasini";
    context?: string;
}

// When ?author is provided, returns an array of quotes for that author.
// When no author is provided, returns all quote groups.
interface QuoteGroup {
    author: string;
    quotes: Quote[];
}

type GetQuotesResponse = Quote[] | QuoteGroup[];
```

#### Example cURL
```bash
curl -X GET "https://b-content.maschkeai.workers.dev/api/knowledge/quotes?author=alex"
```

#### Error Responses
*   _None defined in basic flow_

---

### Get Content Rules
*   **Method + Path:** `GET /api/knowledge/rules`
*   **Description:** Retrieves global content rules and guidelines from the knowledge base.

#### Request Body
_None_

#### Response Body
```typescript
// Dependent on content-rules.json structure
type GetRulesResponse = any;
```

#### Example cURL
```bash
curl -X GET https://b-content.maschkeai.workers.dev/api/knowledge/rules
```

#### Error Responses
*   _None defined in basic flow_

---

## 3. Posts API

### List Posts
*   **Method + Path:** `GET /api/posts`
*   **Description:** Retrieves a list of all posts. Supports filtering and pagination.

#### Request Body
_None_ (Query parameters: `?instance={instanceId}&contentType={typeId}&status={status}&limit={50}&offset={0}` optional)

#### Response Body
```typescript
interface ListPostsResponse {
    posts: Post[];
    total: number;
}

interface Post {
    id: string;
    instance: "alex" | "ablas" | "bwg";
    content_type: string;
    topic_fields: string[];
    text: string;
    image_id?: string;
    language: "en" | "de";
    hashtags: string[];
    char_count: number;
    is_personal: boolean;
    status: "draft" | "review" | "approved" | "published";
    created_at: string;
    updated_at: string;
}
```

#### Example cURL
```bash
curl -X GET "https://b-content.maschkeai.workers.dev/api/posts?instance=bwg&limit=10"
```

#### Error Responses
*   `500 Internal Server Error`: `{ "error": "Failed to fetch posts: [Error message]" }`

---

### Create Post
*   **Method + Path:** `POST /api/posts`
*   **Description:** Saves a generated post to the D1 database.

#### Request Body
```typescript
interface CreatePostRequest {
    instance: string;
    contentType: string;
    topicFields: string[];
    text: string;
    language: string;
    hashtags: string[];
    charCount: number;
    isPersonal?: boolean;
    imageId?: string;
}
```

#### Response Body
```typescript
interface CreatePostResponse {
    id: string;
    status: "saved";
}
```

#### Example cURL
```bash
curl -X POST https://b-content.maschkeai.workers.dev/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "instance": "bwg",
    "contentType": "standard-post",
    "topicFields": ["innovation"],
    "text": "This is a new post.",
    "language": "en",
    "hashtags": ["#BenderWire"],
    "charCount": 21,
    "isPersonal": false
  }'
```

#### Error Responses
*   `500 Internal Server Error`: `{ "error": "Failed to save post: [Error message]" }`

---

### Delete Post
*   **Method + Path:** `DELETE /api/posts/:id`
*   **Description:** Deletes a specific post from the database by ID.

#### Request Body
_None_

#### Response Body
```typescript
interface DeletePostResponse {
    id: string;
    status: "deleted";
}
```

#### Example cURL
```bash
curl -X DELETE https://b-content.maschkeai.workers.dev/api/posts/123e4567-e89b-12d3-a456-426614174000
```

#### Error Responses
*   `500 Internal Server Error`: `{ "error": "Failed to delete post: [Error message]" }`