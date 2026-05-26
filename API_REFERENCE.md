# 🔌 Serverless API Reference: CampusCompass AI

All platform capabilities are driven through Next.js dynamic Serverless Route Handlers under `/api`. This document lists the inputs, payloads, headers, and responses for each endpoint.

---

## 🏛️ 1. Colleges Listings

### `GET /api/colleges`
Query registered Indian colleges using multi-facet query parameters.

*   **HTTP Method**: `GET`
*   **Query Parameters**:
    *   `search` (string, optional): Text matching name, city, state, or facilities.
    *   `stream` (string, optional): Filter by `"all"`, `"Engineering"`, `"Management"`, `"Medical"`, `"Arts"`, `"Science"`.
    *   `location` (string, optional): Filter by specific city (e.g. `"Mumbai"`).
    *   `fees` (string, optional): Fee bracket: `"all"`, `"under-1l"`, `"1l-3l"`, `"3l-5l"`, `"above-5l"`.
    *   `rating` (string, optional): Minimum stars: `"all"`, `"4.5"`, `"4.0"`, `"3.5"`.
    *   `sortBy` (string, optional): Sorting column: `"name"`, `"fees"`, `"rating"`, `"placements"`.
    *   `sortDir` (string, optional): Sort direction: `"asc"` or `"desc"`.
    *   `page` (string, optional): Page index (Default: `"1"`).
    *   `limit` (string, optional): Results per page (Default: `"9"`).

*   **Sample Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clt_college_1",
      "name": "Indian Institute of Technology (IIT), Bombay",
      "description": "Premium engineering institution...",
      "location": "Mumbai",
      "state": "Maharashtra",
      "established": 1958,
      "type": "Public",
      "rating": 4.8,
      "averageFees": 220000,
      "highestPlacement": 45,
      "averagePlacement": 21.8,
      "logoUrl": "https://placehold.co/100x100",
      "coverUrl": "https://placehold.co/800x400",
      "facilities": "Hostel,Library,Gym,WiFi",
      "stream": "Engineering",
      "createdAt": "2026-05-26T20:12:45.000Z",
      "updatedAt": "2026-05-26T20:12:45.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 9,
    "totalCount": 52,
    "totalPages": 6
  }
}
```

---

## 🔍 2. Autocomplete Quick Search

### `GET /api/autocomplete`
Fast-retrieval query mapping for the command palette searching engine.

*   **HTTP Method**: `GET`
*   **Query Parameters**:
    *   `q` (string, required): Query snippet (min 2 chars).
*   **Sample Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clt_college_1",
      "name": "Indian Institute of Technology (IIT), Bombay",
      "location": "Mumbai",
      "state": "Maharashtra",
      "stream": "Engineering"
    }
  ]
}
```

---

## 💖 3. Saved Wishlist Board

### `GET /api/saved`
Query wishlist colleges saved by the currently authenticated user.

*   **HTTP Method**: `GET`
*   **Authentication**: Requires valid NextAuth Session Cookie.
*   **Sample Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clt_college_1",
      "name": "Indian Institute of Technology (IIT), Bombay",
      "location": "Mumbai",
      "state": "Maharashtra"
    }
  ]
}
```

### `POST /api/saved`
Toggle a college in or out of the authenticated user's wishlist database.

*   **HTTP Method**: `POST`
*   **Authentication**: Requires valid NextAuth Session Cookie.
*   **Request Body**:
```json
{
  "collegeId": "clt_college_1"
}
```
*   **Sample Response (200 OK - Added)**:
```json
{
  "success": true,
  "saved": true,
  "message": "College saved to wishlist"
}
```
*   **Sample Response (200 OK - Removed)**:
```json
{
  "success": true,
  "saved": false,
  "message": "College removed from wishlist"
}
```

---

## 📊 4. Compare Boards Persistence

### `POST /api/comparisons`
Save a customized comparison list containing up to 3 colleges.

*   **HTTP Method**: `POST`
*   **Authentication**: Requires valid NextAuth Session Cookie.
*   **Request Body**:
```json
{
  "collegeIds": ["clt_college_1", "clt_college_2"],
  "name": "My Top Tech Choice"
}
```
*   **Sample Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "comp_abc123",
    "userId": "usr_99",
    "collegeIds": "[\"clt_college_1\",\"clt_college_2\"]",
    "name": "My Top Tech Choice",
    "createdAt": "2026-05-26T21:02:11.000Z"
  },
  "message": "Comparison saved successfully!"
}
```

---

## 💬 5. Student Reviews Testimonials

### `POST /api/reviews`
Submit a rating testimonial. Submissions automatically trigger average overall rating recalculation for the targeted university.

*   **HTTP Method**: `POST`
*   **Authentication**: Requires valid NextAuth Session Cookie.
*   **Request Body**:
```json
{
  "collegeId": "clt_college_1",
  "rating": 5,
  "comment": "Incredible infrastructure and outstanding professors! Best campus."
}
```
*   **Sample Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "rev_xyz888",
    "rating": 5,
    "comment": "Incredible infrastructure...",
    "userId": "usr_99",
    "collegeId": "clt_college_1",
    "createdAt": "2026-05-26T21:05:00.000Z"
  },
  "message": "Your review has been successfully posted!"
}
```
