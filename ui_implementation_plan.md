# UI Implementation Plan: Fittings Viewer Layout

## Objective
Build a split-pane user interface with a left-hand sidebar for model configuration ("Model Explorer") and a right-hand main area containing the 3D Canvas with the blueprint grid background. A top header will span the screen, and a floating title will display the active model name above the 3D Viewer.

## 1. Application Layout (`App.tsx` & `App.css`)
The layout will use Vanilla CSS Flexbox to divide the screen into a Header, Sidebar, and Main Canvas area.

**Layout Structure:**
- **Container:** Flex column (100vh).
- **Header:** Fixed height, spanning 100% width.
- **Body:** Flex row (flex-grow: 1, taking remaining height).
  - **Sidebar:** Fixed width (e.g., `300px`), light background.
  - **Main Area:** `flex-grow: 1`, relative positioning (to hold the canvas and floating title), blueprint grid background.

**Action:** 
- Update `src/App.tsx` to include the `Header`, `Sidebar`, and wrap `Viewer3D` in a `MainArea` div.
- Add CSS classes to `src/App.css` (`.app-container`, `.header`, `.body-container`, `.sidebar`, `.main-area`).

## 2. Header Component (`Header.tsx`)
A simple top navigation bar.
- **Content:** Title text "Fittings Viewer".
- **Styling:** Light gray/blue background, bold blue text, small padding, bottom border for separation.

## 3. Sidebar Component (`Sidebar.tsx`)
The "Model Explorer" section containing configuration controls.
- **State Management:** Expand `useMainContext.tsx` (MobX store) to hold state variables for:
  - `category` (e.g., "PROGold Fittings")
  - `model` (e.g., "AC-06-0017-X")
  - `material` (e.g., "Blue")
  - `crimpColor` (e.g., "Gold")
- **Form Controls:** Create styled `<select>` dropdowns for each option.
- **Styling:** White/light-gray background, padding, flex-column layout with gaps between form groups. Dropdowns should have a clean border, border-radius, and matching padding.

## 4. Main Canvas Area & Floating Title
The right side will contain the existing 3D Canvas and a floating text overlay indicating the currently selected model.

- **Floating Title:** 
  - An absolute positioned `<h1>` or `<h2>` element inside the `.main-area`.
  - Positioned at `top: 20px`, `left: 50%`, `transform: translateX(-50%)` to center it horizontally above the model.
  - Dynamically displays the `model` state from the MobX store.
- **Canvas Integration:** 
  - Ensure the `.bg-blueprint-grid` class is applied to the `.main-area` wrapper.
  - Ensure `<Canvas3D>` takes up `width: 100%` and `height: 100%` of its relatively-positioned parent container.

## 5. State Updates to `useMainContext.tsx`
Update the `RootStore` (or create a `ConfiguratorStore`) to manage the UI selections:
```typescript
class ConfiguratorStore {
  category = "PROGold Fittings";
  selectedModel = "AC-06-0017-X";
  material = "Blue";
  crimpColor = "Gold";
  // Add setters...
}
```
This state will be observed by the `Sidebar` to update dropdown values, and observed by the `MainArea` to display the active title, and eventually observed by `HosePipeModel` to load the correct 3D asset and apply material colors.

## 6. Implementation Steps
1. **CSS First:** Update `App.css` with the flexbox grid layout classes and form control styles.
2. **Store Update:** Add the `ConfiguratorStore` to `useMainContext.tsx`.
3. **Components:** Create `Header.tsx` and `Sidebar.tsx`.
4. **Assembly:** Refactor `App.tsx` to import and place these components alongside the existing `Viewer3D`.
