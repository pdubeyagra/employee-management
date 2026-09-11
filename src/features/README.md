# Features

Each folder here is one self-contained slice of the app. A slice owns its
elements, types and rules; nothing outside it reaches past its `index.ts`.

## Layout

```
features/<name>/
  index.ts                     public surface — the only file outsiders import
  <name>-widget.ts             feature root element, composes the rest
  <name>-types.ts              domain types
  <name>-validation.ts         domain field rules and form-level checks
  components/                  elements private to the feature
    <name>-form.ts
    <name>-details.ts
    <name>-table.ts
```

`employee/` is the worked example. To add `department/`, copy that shape.

## Rules

**One public door.** Everything a feature exposes is re-exported from
`index.ts`; the shell imports `@/features/employee/index.ts` and nothing deeper.
Internals stay free to move because no outside file names them.

**Features never import each other's internals.** If `department/` needs
something from `employee/`, it goes through `employee/index.ts` — or the thing
is not really feature-specific and belongs in `components/` or `utils/`.

**Generic stays generic.** `components/ui/` holds elements that know nothing
about the domain (`ui-input`, `ui-select`, `ui-button`), and they carry the
basic validation rules — required, lengths, email shape, patterns. A feature's
`*-validation.ts` supplies only what is domain knowledge: which fields exist,
their labels and limits. See `employee/employee-validation.ts`.

**File name matches the custom element tag.** `employee-form.ts` defines
`<employee-form>`, so a tag in a template is greppable to one file.

**Imports.** `@/...` for anything outside the current folder, relative paths
within a feature. The alias is declared in `tsconfig.json` (`paths`) and
`vite.config.ts` (`resolve.alias`) — both must be kept in step.

## Tests

`test/` mirrors `src/`, so a feature's tests live in
`test/features/<name>/` and import through the `@/` alias.
