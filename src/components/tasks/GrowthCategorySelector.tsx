import { useMemo, useState } from "react";
import { GROWTH_CATEGORY_OPTIONS } from "../../types/task";

type GrowthCategorySelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

function GrowthCategorySelector({ value, onChange }: GrowthCategorySelectorProps) {
  const [query, setQuery] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    if (!value.startsWith("custom:")) return [];

    const customLabel = value.slice("custom:".length);
    return customLabel ? [customLabel] : [];
  });

  const trimmedQuery = query.trim();
  const categories = useMemo(
    () => [
      ...GROWTH_CATEGORY_OPTIONS.map((option) => ({
        id: option.value,
        label: option.label,
        isCustom: false,
      })),
      ...customCategories.map((label) => ({
        id: `custom:${label}`,
        label,
        isCustom: true,
      })),
    ],
    [customCategories]
  );
  const visibleCategories = categories.filter((category) =>
    category.label.toLocaleLowerCase().includes(trimmedQuery.toLocaleLowerCase())
  );
  const canAdd =
    Boolean(trimmedQuery) &&
    !categories.some(
      (category) =>
        category.label.toLocaleLowerCase() === trimmedQuery.toLocaleLowerCase()
    );

  function addCustomCategory() {
    if (!canAdd) return;

    setCustomCategories((current) => [...current, trimmedQuery]);
    onChange(`custom:${trimmedQuery}`);
    setQuery("");
  }

  function deleteCustomCategory(label: string) {
    const categoryId = `custom:${label}`;

    setCustomCategories((current) =>
      current.filter((category) => category !== label)
    );

    if (value === categoryId) {
      onChange("NONE");
    }
  }

  return (
    <div className="growth-category-field">
      <span className="growth-category-label">Habit Growth</span>
      <div className="growth-category-search-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canAdd) {
              event.preventDefault();
              addCustomCategory();
            }
          }}
          placeholder="Search or add a category"
          aria-label="Search growth categories"
        />
        <button
          type="button"
          className="growth-category-add-btn"
          onClick={addCustomCategory}
          disabled={!canAdd}
        >
          Add
        </button>
      </div>

      <div className="growth-category-chips" aria-label="Growth categories">
        {visibleCategories.map((category) => (
          <div className="growth-category-chip-wrapper" key={category.id}>
            <button
              type="button"
              className={`growth-category-chip${value === category.id ? " selected" : ""}`}
              aria-pressed={value === category.id}
              onClick={() =>
                onChange(value === category.id ? "NONE" : category.id)
              }
            >
              {category.label}
            </button>
            {category.isCustom && (
              <button
                type="button"
                className="growth-category-delete-btn"
                aria-label={`Delete custom category ${category.label}`}
                onClick={(event) => {
                  event.stopPropagation();
                  deleteCustomCategory(category.label);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {visibleCategories.length === 0 && (
          <span className="growth-category-empty">No matching categories</span>
        )}
      </div>
      <span className="growth-category-note">
        Custom categories are saved in this form only for now.
      </span>
    </div>
  );
}

export default GrowthCategorySelector;
