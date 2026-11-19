---

name: RecipeBox
description: A ivory, forest-green and sage cooking companion for shared attempts and learning.
colors:
paper: "#f8f7f2"
surface: "#f0f2eb"
dark: "#e7eddf"
card: "#ffffff"
green: "#275640"
green-dark: "#1d4432"
terra: "#df492d"
brown: "#275640"
butter: "#f7e8de"
ink: "#263a2e"
muted: "#616b5e"
rule: "#dfe3d7"
danger: "#b43c25"
gold: "#d5a238"
typography:
display:
fontFamily: "Manrope, system-ui, sans-serif"
fontSize: "29px"
fontWeight: 800
lineHeight: 1.25
letterSpacing: "-0.025em"
headline:
fontFamily: "Manrope, system-ui, sans-serif"
fontSize: "28px"
fontWeight: 800
lineHeight: 1.25
letterSpacing: "-0.025em"
title:
fontFamily: "Manrope, system-ui, sans-serif"
fontSize: "19px"
fontWeight: 800
lineHeight: 1.25
letterSpacing: "-0.025em"
body:
fontFamily: "Manrope, system-ui, sans-serif"
fontSize: "14px"
fontWeight: 400
lineHeight: 1.6
label:
fontFamily: "Manrope, system-ui, sans-serif"
fontSize: "13px"
fontWeight: 700
lineHeight: 1.6
metadata:
fontFamily: "Manrope, system-ui, sans-serif"
fontSize: "12px"
fontWeight: 600
lineHeight: 1.6
rounded:
sm: "6px"
md: "8px"
control: "8px"
photo: "12px"
panel: "16px"
preview: "28px"
full: "calc(infinity * 1px)"
spacing:
1: "4px"
2: "8px"
3: "12px"
4: "16px"
5: "20px"
6: "24px"
7: "28px"
8: "32px"
components:
button-primary:
backgroundColor: "{colors.green}"
textColor: "{colors.card}"
rounded: "{rounded.control}"
padding: "8px 12px"
width: "100%"
button-primary-hover:
backgroundColor: "{colors.green-dark}"
textColor: "{colors.card}"
button-secondary:
backgroundColor: "{colors.card}"
textColor: "{colors.green}"
rounded: "{rounded.control}"
padding: "8px 12px"
width: "100%"
button-secondary-hover:
backgroundColor: "{colors.dark}"
textColor: "{colors.green}"
chip:
backgroundColor: "{colors.card}"
textColor: "{colors.muted}"
typography: "{typography.metadata}"
rounded: "{rounded.control}"
padding: "4px 10px"
chip-selected:
backgroundColor: "{colors.green}"
textColor: "{colors.card}"
rounded: "{rounded.control}"
padding: "4px 10px"
field:
backgroundColor: "{colors.card}"
textColor: "{colors.ink}"
rounded: "{rounded.control}"
padding: "7px 12px"
width: "100%"
panel:
backgroundColor: "{colors.card}"
textColor: "{colors.ink}"
rounded: "{rounded.panel}"
padding: "18px"
reflection:
backgroundColor: "{colors.dark}"
textColor: "{colors.ink}"
rounded: "{rounded.photo}"
padding: "16px"
segment-selected:
backgroundColor: "{colors.card}"
textColor: "{colors.green}"
rounded: "{rounded.sm}"
padding: "4px 6px"
---

# Design System: RecipeBox

## Overview

**Creative North Star: "Enamel Tableware"**

Enamel tableware gives RecipeBox a calm, practical cooking surface: warm ivory, forest green marks, clear ink, and small soft peach moments of encouragement. One Manrope family keeps social posts, recipes, learning, and reflection recognizably part of the same app.

The system favors readable instructions and useful rows alongside food photography. Tonal panels carry supporting guidance; stronger forest green marks actions and selection. It supports home cooks before, during, and after an attempt without introducing performance pressure.

**Key Characteristics:**

- Cream backgrounds with forest-green actions and clear ink text.
- One sans-serif family with compact, weight-led hierarchy.
- Rounded controls, outlined white containers, and useful dense rows.
- Sage reflection panels with soft peach learning and encouragement.
- A mobile-first shell that remains narrow and centered on desktop.

This is a code-led replacement world, with no catalog world ID. The source of truth is `src/index.css`, `src/app/AppShell.tsx`, `src/app/BottomNav.tsx`, and the shared components in `src/components/ui/`. Product commitments live in `PRODUCT.md`; the direction contract lives in `.impeccable/surfaces/src-features-feed-home-tsx.md`. Captures in `.impeccable/review/` corroborate the implementation at narrow mobile and desktop widths.

## Colors

### Supplied reference

The owner’s supplied RecipeBox screenshot sets the palette: warm ivory, forest green, sage, dark green ink, white, with restrained peach, orange and gold accents. Colors were matched visually to the supplied reference. Secondary text and validation colors are darker for readable contrast. The header and footer use pure white, providing contrast with the shaded body. Layout, type and interactions are unchanged.

A warm ivory foundation and dark ink keep food photography prominent; soft peach adds a small, human note to learning and encouragement. Frontmatter values are normative and preserve the actual CSS token names.

### Primary

- **Forest Green** (`green`, with compatibility alias `brown`): primary buttons, links, active navigation, selected chips, and progress.
- **Deep Forest Green** (`green-dark`): primary-button hover and strong emphasis. The app bar uses the white card surface.

### Secondary

- **Soft Peach** (`butter`): learned reflections, supportive callouts, and confirmed encouragement. Reflection panels use the color at 60% opacity; some callouts use 50%.

### Tertiary

- **Orange** (`terra`): small accent marks. Validation text uses the darker danger token for contrast; gold marks the Home cook level.

### Neutral

- **Warm Ivory** (`paper`): shell fallback.
- **Body Surface** (`surface`): a subtle sage-tinted shade behind the scrolling content, distinct from the white header, footer and cards.
- **Soft Sage** (`dark`): the outer stage, segmented-control tracks, metadata panels, reflection blocks, and image fallbacks.
- **Glaze White** (`card`): header, footer, buttons, fields, cards and selected segments.
- **Warm Ink** (`ink`): headings and primary text.
- **Muted Olive** (`muted`): body paragraphs, metadata, placeholders, and unselected navigation.
- **Sage Rule** (`rule`): quiet dividers and container borders.

**The Semantic Alias Rule.** Treat green and brown as compatibility names for forest green, dark as soft sage, and butter as soft peach. New surfaces inherit their semantic roles, not the old color names.

## Typography

**Display Font:** Manrope, with system-ui and sans-serif fallbacks.

**Body Font:** Manrope, with the same fallbacks.

**Character:** A single approachable geometric sans carries both confident headings and practical instructions. Hierarchy relies on weight and size rather than decorative type changes.

### Hierarchy

- **Display:** the recipe title uses the display role (29px); recipe and logging titles may use local sizes appropriate to their context.
- **Headline:** the global heading default is the headline role (28px). The global app-bar title is a more compact local variant (20px, tighter tracking).
- **Title:** section headings use the title role (19px); Home feed titles use the section-title size (19px); legacy Profile/detail post titles use a local size (21px). Third-level headings use a compact bold size (16px).
- **Body:** the body role is the global default (14px). Paragraphs increase leading to 1.65 for instructions and explanatory copy.
- **Label:** field labels use the label role (13px); primary buttons use bold label-size text (13px, 700).
- **Metadata:** compact descriptive details use the metadata role (12px), with weight varying by context. Bottom-navigation labels use a local compact size (11px).

All headings default to balanced wrapping and the frontmatter heading tracking. These roles describe `src/index.css` and the observed overrides in `Recipe.tsx`, `Post.tsx`, `Header.tsx`, and `AppShell.tsx`; they are not an invented mathematical type scale.

**The One Family Rule.** Use Manrope for headings, body, and labels. The display and hand aliases also resolve to Manrope.

## Layout

The mobile web layout is a single-column phone surface with an independently scrolling content area between persistent app chrome. It occupies the viewport width through a maximum width (480px). Screen padding is 20px horizontally, 16px above, and 32px below. The shell uses viewport height; the content area can shrink and scroll without moving the main navigation.

At the existing small breakpoint (640px), the outer stage adds 24px vertical space and the centered shell gains rounded corners (28px), a shadow, and a height capped at the smaller of 900px or the viewport minus 48px. Desktop keeps the mobile information hierarchy. Every app bar is 56px tall, with 20px horizontal padding, two 24px action columns and a flexible centered title separated by 12px gaps. The 24px action boxes contain centered 20px Lucide icons. The bottom navigation is 64px tall plus the device's bottom safe-area inset.

The recurring spacing rhythm is the frontmatter's 4px scale: compact gaps (8–12px), component padding (12–20px), and section separations (20–28px). The shared panel's 18px padding is an observed component-specific exception. Shared action buttons, text fields and search fields use a compact 40px minimum height. Segmented tabs are 36px and filter chips 32px. Multi-line selection rows retain room for their descriptions; header and footer geometry stays unchanged.

Recipe hero photos use a 230px height with cover cropping. Home feed photos span the full phone width at an 8:5 aspect ratio with square corners. Small learning tiles may form a two-column grid. The save dialog remains inset by 16px on each side, with maximum width (440px) and maximum height (85dvh). Narrow-width behavior is evidenced by `learn-320.png` and the 393px recipe and reflection captures; preserve wrapping and scrolling rather than compressing text into a desktop layout.

## Elevation & Depth

The interface is flat within the phone: white surfaces, sage fields, thin sage rules, and photography establish depth. There is no decorative texture. The few shadows identify a selected control, a modal, or the desktop shell rather than lifting every card.

### Shadow Vocabulary

- **Selected segment:** the installed Tailwind `shadow-sm` value (`0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`), used by `Segments.tsx`.
- **Shell / dialog:** the installed Tailwind `shadow-xl` value (`0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`), used by the desktop shell and `SaveSheet.tsx`. The dialog adds an ink backdrop at 40% opacity.

**The Contained Depth Rule.** Keep content panels flat. Reserve shadows for the selected segmented control, modal dialog, and desktop preview shell.

## Shapes

Buttons, chips, fields and tab tracks share an 8px control radius; selected segments and small checkbox marks use 6px. Photos retain 12px corners, and substantial containers use 16px. Avatars and progress indicators remain circular or capsule shaped. The larger desktop shell radius is framing, not the default card radius.

Borders are generally thin (1px) and use Sage Rule. Selected chips and checked controls use forest green borders and fills. Photos cover their frame and retain a clear fallback when unavailable. Icons are consistent stroked Lucide SVGs at stroke weight 2: 20px for header and menu actions, 16px for inline controls, and 12px for compact metadata. Ingredient checkmarks and serving-control icons use 14px. Bottom-navigation icons retain their 24px size. Level markers use Lucide Circle, Square, Diamond and Layers icons in their existing semantic colors.

## Components

### Buttons

Confident, simple, and wide enough for touch.

- **Shape:** control corners, full width, minimum height (40px), with the frontmatter padding.
- **Primary:** forest green and white; hover deepens to Deep Forest Green.
- **Secondary:** white, forest green text, and a thin Sage Rule border; hover adds Soft Sage.
- **Focus:** a thin Forest Green keyboard outline (2px), offset by 2px. Disabled buttons reduce opacity to 40% and use the default cursor.
- **Motion:** buttons transition background and text color over 160ms with ease-out. The reduced-motion media query removes transition and animation duration.

### Chips

Compact 32px filters with 8px corners have white backgrounds, muted warm text, and a Sage Rule border. Selected chips become forest green with white text and a matching border. Interactive chips expose `aria-pressed`; static chips remain text. The shared primitive is `Chip.tsx`.

### Cards / Containers

White, outlined containers organize content without a stack of shadows. Shared panels use frontmatter padding; Home feed posts use 16px horizontal text padding and edge-to-edge photography, with no outer radius or side border. Legacy Post containers in Profile, communities and details keep the panel radius, a Sage Rule border, and clipped overflow. Supporting containers may use Soft Sage without a border.

### Inputs / Fields

Fields are white with a thin Sage Rule border and control corners. The shared `.field-input` is at least 40px high, with 8px space above it. Textareas begin at 96px high, use 10px vertical / 12px horizontal padding, and remain vertically resizable. Placeholder text stays Muted Olive at full opacity. Accent and caret colors are forest green.

Focused fields use a thin green border without an outer ring. Buttons, tabs, links and native selection controls retain a visible 2px green keyboard outline. Discover, Learn and Cookbook use the shared 40px `SearchInput.tsx` with search and clear actions. Validation uses adjacent explanatory text in the darker danger color; the duplicate-cookbook state also disables the submit button. Do not infer validity from color alone. These patterns are visible in `duplicate-error.png` and `log-reflection.png`.

`Select.tsx` is the shared custom dropdown used by the cookbook picker and meal log. Its 40px trigger uses the standard control radius, a right-aligned Lucide chevron and a wrapped value. The bounded option list marks the current selection with a check and supports arrow keys, Home/End, typeahead, Enter/Space and Escape. In the save dialog, Escape closes the option list before dismissing the dialog. The first cookbook remains the default destination.

### Navigation

The five equal-width destinations remain Home, Discover, Cookbook, Groups, and Profile. White bottom navigation has a top rule; an active destination gains forest green text, heavier weight, and `aria-current="page"`. Discover and Groups use shared `PageTabs` for their top-level sections: a full-width 40px white bar immediately below the header, equal-width 13px labels, muted inactive text, bold forest green selection and a 2px green underline over a thin Sage Rule. The bar stays outside scrolling content. Section selection remains URL-backed and supports arrow/Home/End navigation with linked tab/panel semantics. Profile views and in-page workflow controls keep the compact segmented selector.

All pages use `Header.tsx`: white background, centered 20px title and plain 20px action icons in 24px button boxes. A 1px Sage Rule bottom divider separates the header from content; Groups and Discover omit this divider so the header joins the white page-tab bar below it. Home and Profile show Log a meal in the header; Discover, Cookbook and Groups leave that slot empty. Detail pages use Lucide ChevronLeft for Back. Long titles truncate within the fixed height and retain their full accessible text and title tooltip.

`HeaderHost` in AppShell provides portal outlets for the header and navigation directly below it, both above the scrolling body. Existing feature-owned Header instances render into the header outlet; PageTabs uses BelowHeader for its bar while retaining the content panel in the page. Local titles, back callbacks and tab selections stay owned by their routes. Keep one Header per page; embedded content omits its own header.

### Reflection and encouragement

`Reflection.tsx` displays existing worked, changed, and learned entries in a definition list. Soft Sage carries worked and changed; Soft Peach at 60% carries learned. Each block uses control corners and 16px padding, with forest green bold labels and ink content. New meal logs use one optional note instead of separate reflection fields.

### Recipe history and meal logging

Recipe detail has two contexts with the same ingredients/method layout. Discover, feed and shared links open the source recipe with its original quantities and source attribution, Start cooking, and Save to my recipes. A previously saved source offers Open my recipe. Source views omit Edit, Versions and empty personal history; real source-linked attempts remain accessible. Cookbook and personal attempt links open My recipe, using the current personal snapshot with compact Edit recipe and Versions actions at the header's right edge. Its secondary Cookbooks action opens the cookbook picker without a collection-membership caption. The source attribution links back to the original; authored recipes omit that attribution. With two header actions, matching 60px side columns keep the title centered; other headers retain their existing layout.

Saving creates one personal copy per source recipe and chooses its cookbook. The save dialog offers Open my recipe after confirmation. Saving into another cookbook never resets personal edits or creates duplicate versions. Personal ownership stays separate from collection membership. Source snapshots remain immutable when the personal copy is edited or restored. The recipe route uses view=mine for the personal context; direct unsaved edit/version-list URLs return to the source so it can be saved first. Cooking and logging work before saving and retain the exact original snapshot when started from a source view.

Your latest attempts follows the method and shows only the two newest attempts, a View all count, and Log an attempt. Preview rows show a date, optional actual meal photo, note excerpt, version name and known visibility. Do not repeat history or version navigation in a separate Make it your own section.

The servings control sits beside Ingredients as a compact, single-line minus / count / plus stepper. Use 32px icon buttons, 12px count text, and the shared control radius; keep the serving count and unit together. Changes rescale ingredients and announce the updated count.

Method steps contain the recipe instructions without inline community-note threads or placeholder counts. Future community tips should be explicitly published and attributed, tied to the recipe and optionally a step, with one compact entry after the method opening a separate list. Public attempt notes do not automatically become cooking advice.

`LogFlow.tsx` is one form with recipe and saved-version selection, optional meal photo and note, up to three selected stats, and Public/Private visibility. Stats use a compact two-column grid. Visibility defaults to Public, with one submission action: Post attempt for public records or Save privately for private records. Public records appear on Home and Profile Posts; private records appear only in personal cooking history and do not update shared challenge leaderboards. Both retain their details and count toward personal progress. History rows open the saved attempt, including meals without a linked recipe. There is no step indicator or separate preview screen.

View all opens the recipe-specific Cooking log: a chronological list of compact attempt rows, separate from Versions. Attempt detail uses the shared photo, note and stats vocabulary in a personal record with an accurate date and recipe/version links. It omits feed author rows, encouragement counts and invented relative times. Meal photos appear only when one was recorded; recipe imagery is not used as a meal-photo fallback.

Versions is a chronological list of recipe-scoped snapshots, with name, date, change summary and Current status. Each row opens the existing recipe layout for that snapshot; its separate Lucide ellipsis menu contains Rename, Restore and Remove, with keyboard navigation and dismissal. Rename uses a focused dialog. Restore creates a new current snapshot from the selected version. Remove hides a version from the available list while keeping it reachable through past logs; the original is retained. Removed snapshots are clearly labeled and can be restored, with editing/cooking/logging actions unavailable until restored.

The recipe editor presents the selected snapshot as compact editable content. Description starts as a short paragraph with an Edit action. Ingredients use inline amount/unit/name rows with shared column labels and accessible field names; only the focused field gains a white background and green border. Method steps start as numbered previews, with one step expanded for editing at a time. Version name and change summary sit under collapsed optional Version details. Invalid fields open their step and receive focus. New ingredients focus Name; new steps focus Step title.

Edit carries the viewer's serving count, from 2 to 4, into the editor and preserves it on save or cancel. Displayed quantities match the recipe view; unchanged rounded quantities retain their original precision, while changed amounts are converted back to per-serving storage. Saving creates a new version with an automatic name/summary unless supplied. A white BottomBar outside the scrolling content holds Save changes and the Creates a new version hint; it stays visible without covering fields. Past attempts retain their captured snapshot, version identifier and name. Version routes reuse the recipe renderer and pass their snapshot through cooking and logging; cooking-mode presentation remains unchanged.

`Post.tsx` presents encouragement as a reversible pressed state. Its initial Soft Sage capsule changes to Soft Peach, adds a check icon, updates its label to “Encouragement sent,” and adjusts the visible count. The global short color transition supplies restrained feedback. Preserve the accessible pressed state and explicit confirmation.

### Profile and progress

Profile combines identity with progress. Place a compact three-column row of Meals, Followers and Following directly below the name, beside the 80px avatar. The name-and-stats column has an 80px minimum height so both sides align at the top and bottom for a single-line name; longer names can expand the column. Use 18px numbers, 11px labels and 40px stat buttons; omit the bio. Each stat occupies an equal column; Meals counts all logged attempts and opens History. Follow counts open their corresponding inline lists. Place equal-width Edit profile and Share profile actions below the stats. Settings is a plain 20px icon at the header’s right edge, mirroring the plus on the left.

Use one compact 36px segmented row for Insights, History, Goals and Posts, with 12px labels and tighter padding. Insights is the default; each other view is URL-backed. Reuse the existing insights, calendar, goals and post content without the old streak/cuisines summary or nested tab bars. Cookbook opens directly to its collections. The shared segmented control uses the same 36px height on other pages.

### Home feed

Home starts directly with author rows beneath the header. There are no feed tabs, greeting/intro blocks, or separate community-discovery modules. Own and followed-cook posts come first; a small “Suggested for you” section heading marks the recommendation transition. Sample authors are identified in their metadata.

`FeedPost.tsx` is the reusable Home presentation. Each post has a compact avatar/name/context row, full-width 8:5 photo, recipe title, two-line reflection preview, up to three stats, and a consistent encouragement/comment/share row. A 40px bookmark control over the photo opens the existing cookbook picker. Longer notes expand inline; recorded attempts retain a link to their full detail view. `FeedComments.tsx` owns the inline composer, and `useFeedInteractions` keeps cheers/comments stable across route changes. Existing Profile and community post layouts are unchanged.

### Cookbook library

Start with a 40px search field and adjacent outlined plus, opening New cookbook / New recipe choices. This local Add control is separate from the header’s global Log action. Search matches saved recipe titles and cookbook names, deduplicates recipes across collections, and uses the URL’s `q` value so returning from details restores the query. While searching, show grouped cookbook/recipe results with a clear no-results recovery.

Below the toolbar, Recently cooked is a thin horizontal strip of up to six distinct recipes from the meal log, newest first. Use 48px thumbnails, compact names and cooking dates. It opens recipe details; attempts and versions stay inside those details. Hide the strip during search or when there are no linked recipe attempts.

Cookbooks form two columns of square image collages. Use one image for one recipe, two stacked vertically for two, one wide image above two smaller images for three, and a 2×2 arrangement for four or more. Cap cover images at four while keeping the total count accurate. Empty cookbooks use a quiet book placeholder. Names and counts sit below the image on the page surface, with no colored card shell. Long names wrap within their column.

Cookbook details use a compact 24px title, 12px recipe count and the shared RecipeRow’s compact variant: 64px square thumbnails, 14px names, tighter metadata and 10px vertical row padding. Discover and library search retain the standard row size.

### Community directory

The Communities section starts with shared search and a local 40px create plus. Remove the Joined/Browse selector and introductory paragraphs. Your communities uses consistent full-width horizontal cards with 72px square covers, 16px bold names, member counts and descriptions. Hide the section when empty. Suggested communities appears only while no communities are joined, using smaller 48px images, names, member metadata, descriptions and Join / Request to join actions.

Search matches names and descriptions across all communities and replaces both sections with results. Joined and Requested are status labels, with leaving/cancelling managed inside community details. Joining publicly moves a community into Your communities; pending private requests stay visible as Requested in search, and in suggestions while no community is joined. Preserve focus on the community after membership changes. Search is URL-backed via `q`; legacy browse URLs still open the unified directory. The create plus reuses the existing community-creation flow.

## Do's and Don'ts

### Do:

- **Do** keep the five main destinations in their established order: Home, Discover, Cookbook, Groups, Profile.
- **Do** use forest green for primary actions and selected controls, soft sage for supporting surfaces, and soft peach for learning or encouragement.
- **Do** pair selected color with a text, icon, weight, or accessible state change.
- **Do** retain visible keyboard focus and remove transitions when reduced motion is requested.
- **Do** allow labels, notes, and recipe names to wrap at narrow mobile widths.

### Don't:

- **Don't** introduce a new palette without the owner’s direction.
- **Don't** add decorative paper textures or offset shadows to this tableware world.
- **Don't** replace food photography with invented interface decoration.
- **Don't** make hover the only indication that an action or selection is available.

No craft-floor defect is promoted into these rules. Small local type variants and compatibility color names are recorded as implementation facts; screenshot inspection and the completed finish review did not identify unresolved material visual drift requiring a UI change in this documentation pass.

Header actions render Lucide components imported directly from the package, all at 20px in 24px button boxes, without per-icon scaling. Bottom navigation uses 24px icons with 11px labels. Hover, pressed, and keyboard-focus feedback remain visible.
