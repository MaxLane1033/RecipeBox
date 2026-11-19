# RecipeBox

<!-- impeccable:product-schema 1 -->

## Platform

Web, optimized for mobile. React 19, Expo Router, Metro and Tailwind CSS v4. The main app runs inside RecipeBox's existing Better Auth protected route group.

RecipeBox helps home cooks find a starting point, cook at their experience level, reflect on each attempt, and build confidence together. Its distinctive loop connects social inspiration, recipes, repeated attempts, shared learning, and personal progress.

## People and context

Home cooks, including beginners, use a mobile web app before, during, and after cooking. They need readable instructions, clear actions, useful reflection prompts, and encouragement without performance pressure. Authentication and account profile use the existing API. Product features retain seeded content and account-scoped session state.

## Product structure

- Home: one continuous, full-width social feed. Recent followed-cook updates precede clearly labeled suggestions. No feed tabs, introductory copy, or separate community-discovery section.
- Discover: Recipes and Learn. Learning includes techniques and courses.
- Cookbook: saved recipes, collections, and recipe creation.
- Groups: Communities and Challenges. Communities are persistent interest groups, organized by search, Your communities and Suggested communities, with a local create action. Challenges are shared, time-bound activities. Personal goals belong in Progress.
- Profile: identity; Meals, Followers and Following stats; Edit/Share actions; compact Insights/History/Goals/Posts tabs. Progress lives here. Settings is in the top-right header, mirroring the global plus.
- Global Log a meal action plus contextual recipe logging. A single form captures the recipe, optional photo and note, selected stats, and visibility. Public is the default and shares to Home and Profile Posts; Private keeps the attempt in personal history. New logs use a single note rather than separate reflection fields. Both visibility choices retain the recipe relationship and contribute to personal progress.
- A cooking log records one dated cooking event and can link to a saved recipe version. Editing a recipe creates a new snapshot; versions are separate from logs. Restore makes a new current version, and removing a version preserves snapshots referenced by past logs. Recipe detail previews two latest attempts with View all; Edit and Versions live in its header. Full logs and version lists have separate destinations, and a version opens the familiar recipe layout.
- Discovery shows the original source recipe. Save to my recipes creates a personal copy in a cookbook; later saves reuse that copy. My recipe opens the personal current version with Edit, Versions and cooking history. Revisited sources offer Open my recipe. Attribution survives copying and editing, and personal edits never change the source. Cooking and logging do not require saving first.

## Constraints and commitments

Preserve existing features, content, URL-backed selections, detail URLs, shared session state, and back navigation. Improve the individual pages and their UX before polishing the distinctive visual system. Reuse components. Do not implement backend services or unbuilt product features as part of the redesign. Onboarding remains disabled.

The considered subscription model informs grouping but is invisible in this prototype: no paid labels, locks, or upgrade prompts. Analytics, goals, challenges, recipe iteration, and skill learning remain accessible.

## Success

A new visitor can follow inspiration → recipe → cooking attempt → sharing without explanation, and find saved recipes, learning, personal insights, and group activities independently. The 45-second demo emphasizes inspiration, experience-aware recipes, reflection, sharing, and confidence; the full interface retains supporting features.

## Migration scope

Browser screens retain the RecipeBoxDemo interactions and visual system. The existing native Home and authentication flow remain available on iOS and Android. Recipe, cookbook, log, version, community and progress persistence require separate API features.

## Visual commitment

The owner requested the green and light-yellow palette, compact mobile navigation, a plain global plus icon, and Lucide icons on 2026-11-17.

The supplied RecipeBox reference screenshot supersedes the earlier yellow palette: warm ivory, forest green, sage, white and small orange/gold accents. Apply its colors while retaining the established layouts and typography.
