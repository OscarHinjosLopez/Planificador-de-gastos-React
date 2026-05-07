import type { ChangeEvent } from "react";
import { categories } from "../db/categories";
import { useBudget } from "../hooks/useBudget";
import type { Category } from "../types/category";

export default function FilterByCategory() {
  const { dispatch } = useBudget();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "ADD_FILTER_CATEGORY", payload: { id: e.target.value } });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-10">
      <form>
        <div className="flex flex-col md:flex-row md:items-center">
          <label htmlFor="category">Filtrar Gastos</label>
          <select
            id="category"
            className="bg-slate-100 p-3 flex-1 rounded mx-4"
            onChange={handleChange}
          >
            <option value=""> -- Todas las Categorias -- </option>
            {categories.map((category: Category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
}
