# SPEC_MVP.md

# I used AI to start draft this version of SPEC and manually editted it to fit my wish; I found this way to be more efficient.

# CHI — MVP Product & Engineering Specification

## 1. Overview

### Product Name

ChiGo

### One-Sentence Description

ChiGo is a mobile app that helps users understand unfamiliar restaurant menu items by turning menu photos into dish previews.

### MVP Goal

A user can upload or photograph a restaurant menu, extract dish names from the menu, select a dish, and view likely matching dish images gathered from online search and/or AI-assisted search.

### Problem Statement

In many restaurants, especially when traveling abroad, menus often contain only dish names and short descriptions without photos. Even when users can translate the words, they still may not know what the dish actually looks like. This creates uncertainty, frustration, and poor ordering decisions.

ChiGo solves this by making text menus more visual:

- capture or upload a menu image
- extract menu text
- identify likely dish entries
- allow the user to tap a dish
- show likely matching images of that dish

### Core Value Proposition

ChiGo converts a text-only menu into a more visual, understandable decision-making experience.

### MVP Success Definition

The MVP is successful if a user can:

1. Open the app
2. Select or take a menu photo
3. See extracted dish names from the menu
4. Tap a dish
5. See a result screen with likely matching dish images and basic confidence/explanation

---

## 2. Product Vision

### MVP Vision

Build a lightweight, reliable, demo-ready app that proves the core experience:
**menu photo -> OCR -> dish extraction -> image retrieval -> dish preview**

### Future Vision

In future versions, CHI may support:

- automatic translation of menu text
- dish explanation in plain language
- cuisine-aware search refinement
- AI-generated fallback dish visuals
- user favorites/history
- allergy/sensitivity warnings
- restaurant-specific context
- ranking multiple likely dish matches
- full menu parsing into sections and dish cards

---

## 3. Target Users

### Primary Users

- Travelers abroad
- International students
- Expats
- Tourists unfamiliar with local cuisine
- Users dining in languages they do not read fluently

### Secondary Users

- Users exploring unfamiliar restaurants in their own city
- Food-curious users who want visual previews before ordering
- People with visual decision-making preferences

### Typical Use Cases

- A user sees a English-only menu with no photos, so it's hard to imagine what does the dish really look like
- A student in Europe wants to know what a French or Italian dish looks like
- A traveler in China sees transliterated dish names but cannot visualize the food
- A user sees a menu item with only ingredients and wants a likely image preview

---

## 4. MVP Scope

## In Scope

- iOS-first development using Expo + React Native
- architecture designed for later Android support
- upload photo from gallery
- capture photo with camera
- OCR text extraction from menu image
- basic parsing into likely dish lines
- dish selection from extracted list
- image retrieval for a chosen dish
- result screen showing likely dish images
- loading/error/empty states
- modular architecture for future expansion

## Out of Scope for MVP

- full automatic menu understanding with perfect structure
- universal multilingual translation engine
- guaranteed exact dish identification
- restaurant POS/menu integrations
- user accounts/authentication
- social features
- payment/order integration
- offline OCR/search
- advanced AI-generated image realism
- complete menu auto-search for all dishes at once
- fine-grained allergy accuracy
- advanced restaurant/cuisine database

---

## 5. Product Principles

1. **Fast to understand**  
   A new user should understand the app’s purpose in seconds.

2. **Visual clarity first**  
   The app should present dish results in an obvious, photo-first way.

3. **Human-guided, not over-automated**  
   The app should let users choose which dish to inspect instead of trying to solve the whole menu perfectly.

4. **MVP realism**  
   The first version should use reliable, simple pipelines instead of overpromising full AI understanding.

5. **Extensible architecture**  
   The codebase should support later additions like translation, AI ranking, and multi-dish batch search.

---

## 6. User Stories

### Core MVP Stories

1. As a user, I want to photograph a menu so I can extract the dish names from it.
2. As a user, I want to upload an existing menu photo from my phone.
3. As a user, I want the app to identify likely dish names from the image.
4. As a user, I want to tap a dish name and see what it probably looks like.
5. As a user, I want multiple candidate images if the result is uncertain.
6. As a user, I want a loading state so I know the app is working.
7. As a user, I want an error state if OCR or image retrieval fails.
8. As a user, I want to return to the extracted menu list and try another dish.

### Nice-to-Have Later Stories

1. As a user, I want translated dish names.
2. As a user, I want ingredient explanations in plain language.
3. As a user, I want cuisine-aware search refinement.
4. As a user, I want to save dishes I viewed.
5. As a user, I want generated fallback visualizations if no good image exists.

---

## 7. Functional Requirements

## 7.1 Photo Input

The app must let the user:

- take a new menu photo with the device camera
- choose an existing menu photo from the device library

Requirements:

- support common image formats
- support portrait and landscape photos
- allow retake/reselect
- show selected image preview before OCR starts

## 7.2 OCR Extraction

The app must:

- send the selected image to an OCR pipeline
- receive extracted text
- display a parsed list of likely menu items

Requirements:

- extracted text should be stored in app state
- raw OCR text should be preserved for debugging/fallback
- parsing should be separate from OCR service

## 7.3 Menu Parsing

The app must convert OCR text into likely dish entries.

MVP expectations:

- simple heuristic-based parsing is acceptable
- each detected dish should be shown as a selectable row/card
- if parsing confidence is weak, the app should still present the raw lines and let the user choose

## 7.4 Dish Selection

The app must allow the user to:

- tap a dish from the extracted list
- trigger image retrieval for that chosen dish

## 7.5 Dish Image Retrieval

The app must:

- construct a search query from the dish name and optional description
- fetch likely matching images
- display at least 1–5 candidate images

Possible sources:

- web image search
- AI-assisted query enhancement before search
- optional future fallback AI generation

## 7.6 Results Display

The app must show:

- selected dish name
- optional description if available
- candidate dish images
- optional confidence/explanation text such as:
  - “Best visual guess”
  - “Search based on dish name”
  - “Result may vary by restaurant/cuisine”

## 7.7 Error Handling

The app must provide clear UI for:

- no camera permission
- no photo selected
- OCR failure
- no dish entries found
- no image results found
- network failure
- unsupported image/problematic upload

## 7.8 Navigation

The user must be able to:

- return from results to extracted menu list
- restart the flow from the beginning
- retake/reselect a menu image

---

## 8. Non-Functional Requirements

## 8.1 Performance

- OCR initiation should begin quickly after image selection
- visible loading states must be shown for any operation over ~300ms
- result screen should load progressively if images arrive incrementally

## 8.2 Reliability

- app should fail gracefully
- no crashing on malformed OCR results
- no crashing on empty or poor-quality images

## 8.3 Usability

- large tap targets
- clear action buttons
- minimal visual clutter
- understandable to non-technical users

## 8.4 Maintainability

- service layer abstraction required
- reusable UI components required
- screen logic should be separated from API/service logic
- types must be centralized

## 8.5 Extensibility

Architecture should support:

- swapping OCR providers
- adding translation
- adding AI dish interpretation
- adding ranking logic
- supporting Android later

---

## 9. Recommended Tech Stack

## Frontend

- Expo
- React Native
- TypeScript
- Expo Router

## Device APIs

- `expo-image-picker` for photo library selection
- `expo-camera` for taking menu photos
- `expo-file-system` only if needed later
- `expo-router` for navigation

## Backend / Service Layer (MVP)

Recommended simple architecture:

- lightweight backend endpoint(s) for OCR and search orchestration
- backend may use:
  - OCR API or OCR model
  - search/query enhancement logic
  - image search or retrieval pipeline

## Why a Backend is Recommended for MVP

A backend keeps the app simpler because:

- OCR providers and keys stay server-side
- query-cleaning logic can be improved without app redeploy
- image search and AI logic can evolve independently
- future caching becomes easier

## Suggested Backend Stack

Any of the following are acceptable for MVP:

- FastAPI
- Flask
- Node/Express

Recommended:

- Python FastAPI for clarity and future AI integrations

---

## 10. Architecture Overview

## High-Level Flow

1. User chooses or captures menu image
2. App uploads image to OCR service/backend
3. OCR returns raw text
4. Parsing layer converts raw text into likely dish entries
5. User selects one dish entry
6. App sends selected dish data to search service
7. Search service returns likely image URLs and metadata
8. App shows result screen

## MVP Architecture Principle

Keep app logic modular and thin:

- UI handles user interaction and display
- services handle OCR/search requests
- parsing utilities transform OCR text
- backend handles heavy/secret/external integrations

---

## 11. Suggested Folder Structure

```text
app/
  index.tsx
  upload.tsx
  parse-results.tsx
  dish-result.tsx

components/
  PrimaryButton.tsx
  ImageSourceCard.tsx
  DishListItem.tsx
  LoadingState.tsx
  ErrorState.tsx
  EmptyState.tsx
  ScreenContainer.tsx
  PhotoPreview.tsx

services/
  ocrService.ts
  menuParser.ts
  dishSearchService.ts
  aiQueryService.ts   // optional abstraction even if mocked in MVP

types/
  menu.ts
  dish.ts
  api.ts
  navigation.ts

constants/
  theme.ts
  copy.ts

hooks/
  useImageSelection.ts
  useOcr.ts
  useDishSearch.ts

utils/
  normalizeText.ts
  extractDishCandidates.ts
  buildDishQuery.ts
  dedupeImages.ts


⸻

12. Screen Specifications

12.1 Home Screen

Purpose

Introduce the app and let the user begin.

Required Elements
	•	app name/logo: CHI
	•	short value proposition
	•	primary CTA: “Scan a Menu”
	•	secondary CTA: “Choose Photo”
	•	small helper text explaining what the app does

Example Copy
	•	Title: “See What’s on the Menu”
	•	Subtitle: “Upload a menu photo and preview what unfamiliar dishes may look like.”

Actions
	•	navigate to image acquisition flow

⸻

12.2 Image Input Screen

Purpose

Allow user to either:
	•	take a photo
	•	choose a photo from gallery

Required Elements
	•	“Take Photo” button
	•	“Choose from Library” button
	•	permission messaging if needed
	•	selected image preview
	•	“Continue” button after image is selected
	•	“Retake / Rechoose” button

States
	•	no image selected
	•	image selected
	•	permission denied
	•	uploading/processing

⸻

12.3 OCR / Parse Results Screen

Purpose

Display extracted text as likely dish entries.

Required Elements
	•	header: “Select a Dish”
	•	selected menu photo thumbnail or mini preview
	•	list of parsed dish items
	•	optional raw text view toggle for debugging/fallback
	•	“Try Another Photo” button

Dish Row/Card Data

Each row may include:
	•	dish name
	•	optional short description
	•	optional confidence or “likely match” indicator

Behavior
	•	tapping a dish triggers search and navigates to loading/result flow

⸻

12.4 Dish Result Screen

Purpose

Show likely visual previews for one selected menu item.

Required Elements
	•	selected dish name
	•	optional original menu text/description
	•	image gallery or scrollable image cards
	•	optional notes:
	•	“Best guess based on dish name”
	•	“Results may vary by restaurant”
	•	“Back to Menu Items” button
	•	“Try Another Dish” button
	•	“Start Over” button

Result Variants
	1.	successful image results
	2.	no image results
	3.	weak-confidence/ambiguous results
	4.	network failure

⸻

12.5 Optional Debug Screen (Developer Only)

Not required for release UI, but architecture may support:
	•	raw OCR text
	•	parsed candidates
	•	built search query
	•	API payload summary

⸻

13. UX Requirements

13.1 General UX
	•	keep flow linear and obvious
	•	avoid excessive options
	•	prioritize single clear action per screen
	•	user should never wonder what to do next

13.2 Accessibility
	•	readable font sizes
	•	high color contrast
	•	buttons with text labels, not icon-only
	•	screen-reader-friendly labels where practical
	•	image cards should have accessible labels such as “Possible dish image result 1”

13.3 Loading UX

Show explicit loading indicators for:
	•	OCR in progress
	•	parsing in progress if separate
	•	dish image search in progress

Suggested copy:
	•	“Reading menu text…”
	•	“Finding likely dishes…”
	•	“Looking for images…”

⸻

14. Data Models

14.1 MenuImage

type MenuImage = {
  id: string;
  uri: string;
  width?: number;
  height?: number;
  source: 'camera' | 'library';
  createdAt: string;
};

14.2 OCRResult

type OCRResult = {
  rawText: string;
  lines: string[];
  languageHint?: string;
  confidence?: number;
};

14.3 DishCandidate

type DishCandidate = {
  id: string;
  name: string;
  description?: string;
  originalText: string;
  parseConfidence?: number;
};

14.4 DishSearchQuery

type DishSearchQuery = {
  dishName: string;
  description?: string;
  cuisineHint?: string;
  searchText: string;
};

14.5 DishImageResult

type DishImageResult = {
  id: string;
  imageUrl: string;
  sourceName?: string;
  sourceUrl?: string;
  title?: string;
  relevanceScore?: number;
};

14.6 DishSearchResponse

type DishSearchResponse = {
  query: DishSearchQuery;
  results: DishImageResult[];
  explanation?: string;
};


⸻

15. State Management

MVP Recommendation

Use local React state and lightweight hooks. No global state library is required for MVP unless complexity increases.

Suggested State Buckets
	•	selected image
	•	OCR loading/error/result
	•	parsed dish list
	•	selected dish
	•	image search loading/error/result

If needed later:
	•	add Zustand or Context for shared state

⸻

16. Navigation Specification

Primary Flow

Home -> Image Input -> OCR/Parse Results -> Dish Result

Navigation Rules
	•	user can always go back one step
	•	user can restart from Home
	•	state should persist reasonably while navigating backward within the current session

Suggested Routes
	•	/
	•	/upload
	•	/parse-results
	•	/dish-result

⸻

17. Service Contracts

17.1 OCR Service

Purpose:
	•	receive image
	•	return raw OCR text

Example interface:

async function extractMenuText(imageUri: string): Promise<OCRResult>

17.2 Menu Parser

Purpose:
	•	convert OCR text into likely dish candidates

Example interface:

function parseDishCandidates(ocr: OCRResult): DishCandidate[]

17.3 Dish Search Service

Purpose:
	•	build and send search query for one selected dish
	•	return image candidates

Example interface:

async function searchDishImages(candidate: DishCandidate): Promise<DishSearchResponse>

17.4 AI Query Enhancement Service (Optional MVP Stub)

Purpose:
	•	normalize ambiguous dish names
	•	improve search query quality

Example interface:

async function enhanceDishQuery(candidate: DishCandidate): Promise<DishSearchQuery>

In MVP, this may be mocked or bypassed.

⸻

18. Backend API Specification (Recommended MVP)

18.1 POST /ocr

Purpose

Extract text from uploaded menu image.

Request
	•	multipart form data with image file
or
	•	JSON body with image URL/base64 depending on implementation

Response

{
  "rawText": "Spicy beef noodles\nMapo tofu\nCucumber salad",
  "lines": ["Spicy beef noodles", "Mapo tofu", "Cucumber salad"],
  "confidence": 0.89
}

18.2 POST /parse-menu (Optional if parsing is client-side)

Purpose

Parse OCR text into likely dish candidates.

Request

{
  "rawText": "..."
}

Response

{
  "dishes": [
    {
      "id": "1",
      "name": "Mapo Tofu",
      "description": "Spicy tofu with chili oil",
      "originalText": "Mapo tofu - spicy tofu with chili oil",
      "parseConfidence": 0.84
    }
  ]
}

18.3 POST /search-dish-images

Purpose

Return likely image matches for a selected dish.

Request

{
  "dishName": "Mapo Tofu",
  "description": "Spicy tofu with chili oil"
}

Response

{
  "query": {
    "dishName": "Mapo Tofu",
    "description": "Spicy tofu with chili oil",
    "searchText": "Mapo Tofu spicy tofu with chili oil dish"
  },
  "results": [
    {
      "id": "r1",
      "imageUrl": "https://...",
      "sourceName": "Example Source",
      "sourceUrl": "https://...",
      "title": "Mapo Tofu",
      "relevanceScore": 0.93
    }
  ],
  "explanation": "Best match based on dish name and description"
}

18.4 GET /health

Purpose

Basic service health check.

⸻

19. Search Strategy for MVP

Preferred MVP Strategy

Use a layered retrieval approach:

Step 1: OCR

Extract raw text from menu image

Step 2: Parsing

Identify likely dish entries

Step 3: Query Building

Construct a strong search query using:
	•	dish name
	•	optional description
	•	optional cuisine hint if inferable
	•	optional “food dish” keyword

Step 4: Search Results

Retrieve likely candidate images

Step 5: Display

Show top candidates with disclaimer that results may vary

Important MVP Constraint

The app is not guaranteeing exact dish identity. It is providing a likely visual preview.

⸻

20. Error States & Recovery

20.1 No Camera Permission

Message:
	•	explain why permission is needed
	•	offer gallery upload as fallback

20.2 No Photo Selected

Message:
	•	prompt user to take or choose a menu image

20.3 OCR Failed

Message:
	•	“We couldn’t read the menu clearly.”
Actions:
	•	retry
	•	choose another photo
	•	retake photo

20.4 No Dishes Parsed

Message:
	•	“We found text, but couldn’t confidently identify menu items.”
Actions:
	•	show raw text lines
	•	allow user to select from raw lines
	•	try another photo

20.5 No Image Results

Message:
	•	“We couldn’t find a strong visual match for this dish.”
Actions:
	•	try another dish
	•	adjust query later in future versions
	•	show explanation

20.6 Network Failure

Message:
	•	“Network connection required for search.”
Actions:
	•	retry
	•	return to previous screen

⸻

21. Design & Branding Direction

Brand Personality
	•	helpful
	•	curious
	•	travel-friendly
	•	reassuring
	•	modern

Style Direction
	•	clean
	•	photo-forward
	•	minimal
	•	soft but confident
	•	not overly playful

Visual Priorities
	1.	selected image / dish result images
	2.	clear primary action buttons
	3.	readable dish names
	4.	low-clutter layout

Color Direction

Suggested:
	•	primary: warm orange or coral accent
	•	neutral: off-white / light gray background
	•	text: dark charcoal
	•	success: muted green
	•	error: accessible red

Typography
	•	clean sans-serif
	•	bold large headings
	•	comfortable body spacing
	•	strong button labels

⸻

22. Analytics & Logging

MVP Analytics Events

Track only essential product events:
	•	app_opened
	•	photo_selected
	•	photo_captured
	•	ocr_started
	•	ocr_succeeded
	•	ocr_failed
	•	dish_candidate_selected
	•	image_search_started
	•	image_search_succeeded
	•	image_search_failed
	•	no_results_returned

MVP Logging Goals
	•	debug OCR failures
	•	debug parsing failures
	•	debug search-quality issues

No heavy analytics infrastructure is required for MVP.

⸻

23. Privacy & Trust

MVP Privacy Principles
	•	clearly explain image usage
	•	menu photos should only be used for OCR/search processing
	•	do not over-collect user data
	•	no account required
	•	no unnecessary personal profile collection

User Trust Messaging

The app should communicate:
	•	results are likely matches, not guaranteed exact replicas
	•	dish appearance may vary by restaurant and region

⸻

24. Testing Requirements

Functional Tests
	•	choose photo from library
	•	capture photo with camera
	•	OCR returns text
	•	parser returns dish candidates
	•	selecting a candidate loads result screen
	•	returning back preserves current state reasonably

Edge Case Tests
	•	blurry image
	•	empty image
	•	image with no menu text
	•	menu with many lines
	•	menu with mixed formatting
	•	no network
	•	backend timeout
	•	no results

Device Testing

MVP target:
	•	iPhone simulator for non-camera UI development
	•	real iPhone for camera testing

Architecture should still be Android-friendly, but Android testing is not required in the first pass unless time allows.

⸻

25. Development Milestones

Milestone 1 — Shell App
	•	create Expo app
	•	basic navigation
	•	home screen
	•	image input screen

Milestone 2 — Image Acquisition
	•	camera/photo library selection
	•	image preview
	•	permission flow

Milestone 3 — OCR Flow
	•	connect OCR service
	•	loading/error states
	•	raw OCR output

Milestone 4 — Menu Parsing
	•	parse dish candidates
	•	render list
	•	selection flow

Milestone 5 — Dish Image Search
	•	query building
	•	search results integration
	•	result gallery

Milestone 6 — Polish MVP
	•	empty/error states
	•	visual cleanup
	•	navigation refinement
	•	basic instrumentation

⸻

26. Cursor Implementation Guidance

Cursor should implement the app with these engineering priorities:
	1.	Use TypeScript throughout
	2.	Keep all service calls abstracted in /services
	3.	Do not hardcode OCR/search logic inside screens
	4.	Build reusable presentational components
	5.	Start with mock data if needed, but preserve real service interfaces
	6.	Keep parsing logic isolated in utilities or service helpers
	7.	Prefer simple, readable code over clever abstractions
	8.	Make screens shippable even if backend is initially mocked
	9.	Ensure the app can run end-to-end with placeholder responses during early development
	10.	Keep future Android support in mind when choosing libraries

⸻

27. Explicit MVP Build Order

Cursor should build in this order:

Phase 1
	•	Home screen
	•	Image selection / capture
	•	Preview selected image

Phase 2
	•	OCR service interface
	•	Mock OCR output for development
	•	Parse results screen

Phase 3
	•	dish candidate selection
	•	image search service interface
	•	mock image results screen

Phase 4
	•	replace mocks with real integrations
	•	improve loading/error states
	•	polish UI

⸻

28. What the MVP Must Demonstrate in a Demo

A successful demo should show:
	1.	User opens CHI
	2.	User selects or captures a menu photo
	3.	App extracts visible menu text
	4.	App presents dish options
	5.	User selects one unfamiliar dish
	6.	App shows likely dish images
	7.	User says: “Now I can understand what this probably looks like.”

That is the core demo outcome.

⸻

29. Final MVP Definition

CHI MVP is complete when:
	•	the app runs on iOS in Expo/React Native
	•	a user can input a menu photo
	•	OCR text is extracted
	•	likely dish entries are shown
	•	a selected dish returns candidate images
	•	the experience is understandable, stable, and demo-ready

⸻

30. Future Extensions (Not Required Now)
	•	automatic translation of menu items
	•	batch image previews for all detected dishes
	•	better cuisine classification
	•	AI-based dish name normalization
	•	generative fallback visualizations
	•	ingredient explanation
	•	dietary/allergy filtering
	•	favorites/history
	•	restaurant-specific retrieval
	•	Android production optimization
```
