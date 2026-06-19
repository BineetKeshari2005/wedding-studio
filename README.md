# Wedding Studio – AI Developer Handoff Document

## Project Overview

Wedding Studio is a premium, AI-powered wedding design platform designed to help users create a complete, cohesive wedding visual concept section-by-section, rather than merely generating isolated wedding images. 

The platform guides users through an intentional, progressive journey:
**Entry → Lounge → Dining → Bar → Stage → Photo Booth**

As users navigate this journey, they save generated concepts they love into a persistent Moodboard, building out a comprehensive event blueprint. The persistence layer and workflow architecture are fully implemented. Your responsibility is to integrate the AI generation pipeline and enforce structural and aesthetic design consistency across these sections.

---

## Current Product Status

The platform's frontend workflow and backend persistence architectures are **100% complete**. The following features have been fully implemented and tested:

* **Studio Workflow:** The end-to-end user interface for filtering, prompting, and navigating the wedding generation journey.
* **Multi-Select Concepts:** Users can select 1, 2, 3, or 4 image concepts simultaneously from the generated options.
* **Save & Continue:** Commits selected concepts to the backend and advances the user seamlessly to the next section.
* **Section Progression:** Strict chronological advancement tracking.
* **Editable Previous Sections:** Users can click back to previously completed sections (e.g., clicking 'Entry' while on 'Dining') to edit their selections non-destructively, without erasing future progress.
* **Moodboards:** A dedicated view for users to see their approved concepts.
* **Persistence Layer:** Real-time synchronization between the client cache and the PostgreSQL database.
* **Project Resume Functionality:** Users can close the browser, refresh, or leave the site and return exactly where they left off without data loss.
* **StudioProject Architecture:** First-class database entity acting as the source of truth for the wedding.
* **SavedConcept Architecture:** Relational entity associating approved concepts to sections and projects.

---

## User Journey

The complete, currently functioning user flow is as follows:

1. **User enters wedding preferences:** Utilizing the Studio sidebar, the user inputs preferences like Venue, Budget, Theme, Season, Event Flow, and Timing.
2. **User generates concepts for the current section:** (Currently mocked) The user clicks generate to see 4 visual concepts for their current section (e.g., Entry).
3. **User selects concepts:** The user selects 1 to 4 images that match their vision.
4. **User saves concepts:** The user clicks "Save & Continue", committing the selections to the backend.
5. **User moves to next section:** The workflow automatically unlocks and advances to the next chronological section (e.g., Lounge).
6. **User can revisit previous sections:** The user clicks a previous timeline node (e.g., Entry) to review or edit selections non-destructively.
7. **User builds a complete moodboard:** All approved concepts are aggregated and grouped on the Moodboards page.
8. **Progress persists automatically:** Every action (preference change, selection, section transition) is silently saved to the database.

---

## Database Architecture

We use Prisma with PostgreSQL. 

### `StudioProject`
The primary project entity. Acts as the absolute source of truth for the entire wedding project session.
* `id` (UUID): Primary key.
* `userId` (String): Links the project to an authenticated user.
* `name` (String): The title of the project.
* `status` (String): e.g., 'draft', 'completed', 'archived'.
* `weddingPreferences` (JSON): Stores all user-defined global filters (venue, budget, season, theme, eventFlow, timing, functions, guestCount, colorPalette).
* `selectedReferences` (JSON): Stores structural layout references or inspirations.
* `completedSections` (JSON Array): Tracks an array of section names the user has saved (e.g., `["Entry", "Lounge"]`).
* `currentSection` (String): Tracks the furthest/active step the user is currently editing.
* `createdAt` / `updatedAt`: Standard timestamps.

### `SavedConcept`
Stores the explicitly approved concepts that make up the user's Moodboard.
* `id` (UUID): Primary key.
* `projectId` (UUID): Foreign key linking to `StudioProject`.
* `section` (String): The journey step this concept belongs to (e.g., "Dining").
* `imageUrl` (String): The URL of the generated image.
* `prompt` (String): The prompt used to generate this specific image (for regeneration logic).
* `generationId` (String): The ID linking back to the AI provider.
* `selectedFilters` (JSON): The specific snapshot of filters active when this concept was approved.
* `referenceImagesUsed` (JSON): Tracks which previous concepts were fed into the AI to generate this specific image (critical for tracing consistency).
* `isFavorite` (Boolean): User toggle for preferred images.
* `createdAt`: Standard timestamp.

---

## Existing APIs

All routes are mounted under `/api/studio` and protected by JWT authentication.

### `POST /api/studio/project`
* **Purpose:** Initializes a new `StudioProject`.
* **Request:** `{ name: string, weddingPreferences?: object }`
* **Response:** Returns the newly created `StudioProject`.
* **Usage:** Called automatically by the frontend when an authenticated user enters the Studio without an active project.

### `GET /api/studio/project/:id`
* **Purpose:** Hydrates the frontend on load.
* **Request:** Requires standard JWT; reads `:id` from params.
* **Response:** Returns the `StudioProject` including `weddingPreferences`, `completedSections`, and `currentSection`.
* **Usage:** Called on component mount if a valid `projectId` exists in local storage.

### `PATCH /api/studio/project/:id`
* **Purpose:** Updates project state dynamically.
* **Request:** `{ weddingPreferences?: object, completedSections?: array, currentSection?: string }`
* **Response:** Returns the updated `StudioProject`.
* **Usage:** Triggered automatically by `StudioContext` whenever the user modifies filters, changes sections, or completes a step.

### `POST /api/studio/save-selection`
* **Purpose:** Persists approved concepts for a specific section.
* **Request:** `{ projectId: string, section: string, concepts: array }`
* **Response:** Returns an array of newly created `SavedConcept` records.
* **Usage:** Replaces all saved concepts for the target `section` with the newly provided array. It isolates modifications so future sections remain untouched.

### `GET /api/studio/moodboard/:projectId`
* **Purpose:** Retrieves the user's compiled moodboard.
* **Request:** Project ID in params.
* **Response:** Returns `SavedConcept` records, grouped by section (e.g., `{ "Entry": [...], "Lounge": [...] }`).
* **Usage:** Used by both the `StudioContext` (to hydrate previous selections in the editor) and the `Moodboards` page (to display the final result).

---

## Persistence Architecture

We employ a synchronized cache-and-push architecture to ensure the UI feels instant while remaining highly fault-tolerant.

* **StudioContext:** Acts as an in-memory and `localStorage` cache for all workflow states (`selectedConcepts`, `currentSection`, `preferences`).
* **Project Hydration:** On initial load, `StudioContext` checks for a cached `studio_projectId`. If found, it fetches the Project and Moodboard APIs to seamlessly reconstruct the user's state.
* **Backend Sync:** Interactions (toggling a selection, updating a filter dropdown) update the local React state instantly, followed by a deferred background sync to the `PATCH` or `POST` APIs.
* **Refresh Recovery:** Because of rapid `localStorage` caching backed by API hydration, users can refresh their browser window at any time—even mid-generation—and their project will completely survive without data loss.
* **Current Section Recovery:** `handleSaveAndContinue` logic calculates the user's furthest progressed point to ensure they are never forced to redundantly replay completed sections after returning to edit an old section.

---

## Moodboard System

* **How concepts are stored:** Committed individually as `SavedConcept` records via the `save-selection` API.
* **How concepts are grouped:** The backend groups them dynamically by their `section` string (`Entry`, `Lounge`, etc.) when responding to `GET /moodboard/:id`.
* **How users edit concepts:** Users navigate back to the corresponding section in the Studio timeline and select/deselect images. Clicking "Save & Continue" re-submits the array of currently active selections to the API.
* **How concepts are removed:** If a user unselects a previously saved concept and saves, the backend cleanly wipes the previous concepts for that section and replaces them with the new, reduced array.

---

## AI Integration Section (YOUR DOMAIN)

**🚨 CRITICAL: AI GENERATION IS NOT YET IMPLEMENTED. 🚨**

The current application utilizes a mock API to simulate image generation. Your primary objective is to build out the real `/api/ai/couple-moodboard/generate` pipeline.

The architecture is explicitly designed to support **Contextual Consistency**. The flow of data is strictly:
**Approved Concepts ↓ Become References ↓ Used For Future Sections**

### Example:
1. **Entry Selected:** The user generates and approves an image of a floral entrance arch.
2. **Reference For Lounge:** When the user clicks "Generate" for the Lounge, the backend must use the approved Entry floral arch image (either via image prompting, ControlNet, or semantic prompt extraction) as a reference point.
3. **Lounge Selected:** The user approves a Lounge concept.
4. **Reference For Dining:** When generating the Dining area, the AI receives *both* the Entry and Lounge as context to generate matching centerpieces and table arrangements.

The objective is absolute visual consistency across the entire wedding. We are not building a generic image generator; we are building an intelligent, persistent design assistant.

---

## Recommended AI Workflow

You are free to design the specific prompting pipeline, but the recommended flow is:

1. **Generate Entry:** Driven entirely by `weddingPreferences` (Venue, Budget, Theme, Palette).
2. **User Approves:** The UI passes the selected image back to the server as a `SavedConcept`.
3. **Entry Becomes Reference:** The server maps this approved concept into the context pipeline.
4. **Generate Lounge:** The backend constructs a prompt combining the global preferences + specific Lounge requirements + the Entry image as a stylistic baseline.
5. **Generate Dining:** The backend uses the Entry + Lounge references.
6. **Continue Through Photo Booth:** By the end, the system is leveraging a rich tapestry of references to guarantee the Photo Booth aesthetically matches the rest of the venue.

---

## What The AI Developer Owns

You are fully empowered to design and build the AI generation layer. You own:

* **Model Selection:** Decide between Replicate (Flux, SDXL) or OpenAI (DALL-E 3) based on which handles multi-reference consistency best.
* **Prompt Engineering:** Craft the master prompt templates that translate raw `weddingPreferences` into beautiful outputs.
* **Wedding DNA Design:** Architect how a project's core "vibe" is codified and injected consistently into every API call.
* **Reference Image Strategy:** Decide if previous concepts are passed via Image-to-Image (img2img), IP-Adapter, or reverse-engineered into text prompts using Vision models.
* **Generation Pipeline:** Build the `ai.controller.ts` and `ai.service.ts` logic to coordinate the external API requests.
* **Regeneration Logic:** Handle how the system behaves when a user asks to regenerate a specific set of 4 images.
* **Consistency System:** Ensure the lighting, color grading, and architectural elements feel strictly identical across all rooms.

---

## Handoff Checklist

**✓ Completed (Do Not Modify)**
* ✓ Studio Workflow UI
* ✓ Moodboards UI
* ✓ Persistence Layer & Local Storage Sync
* ✓ Project Storage (Prisma)
* ✓ Backend Studio APIs (`/api/studio/*`)
* ✓ Save & Continue Logic
* ✓ Section Editing & Backward Navigation
* ✓ Multi-Select Concepts Interface

**□ Remaining (Your Tasks)**
* □ AI Generation Pipeline
* □ Wedding DNA Context System
* □ Reference Processing Engine
* □ Prompt Strategy & Engineering
* □ Image Generation Model Integration

---

## Final Goal

The final objective is non-negotiable: When a user completes the journey, the **Entry, Lounge, Dining, Bar, Stage, and Photo Booth must feel like they belong to the exact same wedding event**, rather than six unrelated, disconnected AI image generations.
