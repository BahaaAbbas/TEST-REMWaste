# TEST-REMWaste
TEST-REMWaste


## Approach

* **Data Fetching:** Uses `axios` in `useEffect` to fetch skip data on mount, with loading and error states handled.
* **Responsive UI:** Uses MUI’s `useMediaQuery` to switch between a sidebar (desktop) and drawer (mobile) for the progress steps.
* **Skip Cards:** Displays skip options in a grid with badges showing features (heavy waste, road permission). Users can select a skip, highlighted visually.
* **Pricing:** Calculates final price including VAT.
* **Progress Steps:** Shows steps with icons and colors indicating completed, active, or pending.
* **Navigation:** Back and Continue buttons with Continue disabled until a skip is selected.

---

## Tech Stack

* React (hooks)
* Axios for API calls
* Material-UI (MUI) components
* Lucide React icons
* Tailwind CSS for styling


