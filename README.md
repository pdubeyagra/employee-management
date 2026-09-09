# Employee Management

A browser-shaped shell that hosts widgets. The shell provides tabs, an address
bar and history; each widget is a self-contained feature it can open. Employees
is the first widget.

## Requirements

- node
- npm

## Commands

```
npm install     # install dependencies
npm run dev     # start the dev server
npm run build   # typecheck and build for production
npm test        # run the test suite
npm run test:types  # typecheck the tests
```

## How it fits together

```
src/
  main.ts                     entry point: registers widgets, then the shell
  shell/
    browser-shell.ts          tabs + toolbar + viewport
    shell-tab-strip.ts        the tab strip
    shell-toolbar.ts          back / forward / reload + address bar
    shell-new-tab.ts          widget launcher, also the not-found page
    shell-url.ts              app:// address parsing
    tab-model.ts              tab and history operations
  widgets/
    widget-registry.ts        WidgetDefinition + the registry
    widget-catalog.ts         the list of widgets the app ships
    employee/                 app://employees
    button/                   app://button
    dialog/                   app://dialog
    confirm-dialog/           app://confirm-dialog
  components/
    ui/                       generic building blocks (button, input, dialog)
    shared/                   shared composites (toast, pagination, confirm)
    gallery/                  page frame, demo card and event log for the
                              component gallery widgets
  theme/                      design tokens
```

## The component gallery

`app://button`, `app://dialog` and `app://confirm-dialog` are live documentation
for the shared components — every variant rendered for real, with an event log
that shows which event each component actually dispatches. Open them in their
own tabs alongside a widget you are building.

Widgets are addressed by `app://<widget-id>`, so `app://employees` opens the
employee widget. Typing a bare id in the address bar works too. The shell
resolves addresses through the registry only — it has no knowledge of any
individual widget.

Every open tab stays mounted and inactive ones are hidden, so switching tabs
keeps each widget's in-progress state. Reloading a tab deliberately remounts it.

## Adding a widget

1. Create `src/widgets/<name>/`.
2. Build the element as a Lit component, e.g. `<reports-widget>`.
3. Export a `WidgetDefinition` from it:

   ```ts
   export const reportsWidgetDefinition: WidgetDefinition = {
     id: "reports",
     title: "Reports",
     description: "What the widget is for.",
     icon: html`<svg viewBox="0 0 24 24">...</svg>`,
     render: () => html`<reports-widget></reports-widget>`,
   };
   ```

4. Add that definition to `WIDGET_CATALOG` in `src/widgets/widget-catalog.ts`.

It then appears on the new tab launcher and is reachable at `app://reports`.
No shell file needs to change.

State that must outlive a tab belongs in a store next to the widget, the way
`employee-store.ts` holds the roster, so two tabs on the same widget stay in
step.
