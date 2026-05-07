import { categories } from "../db/categories";
import type { Category } from "../types/category";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState, type ChangeEvent } from "react";
import type { DraftExpense, Value } from "../types/expense";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
  const [error, setError] = useState<string>("");
  const [previousAmount, setPreviousAmount] = useState(0);
  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: "",
    category: "",
    date: new Date(),
  });
  const { dispatch, state, remainingBudget } = useBudget();

  const handelChangeDate = (value: Value) => {
    setExpense({ ...expense, date: value });
  };

  useEffect(() => {
    if (state.editingId) {
      const expenseToEdit = state.expenses.filter(
        (expense) => expense.id === state.editingId,
      )[0];
      if (expenseToEdit) {
        setExpense(expenseToEdit);
        setPreviousAmount(expenseToEdit.amount);
      }
    }
  }, [state.editingId]);

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement, HTMLInputElement>
      | ChangeEvent<HTMLSelectElement, HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const isAmountField = ["amount"].includes(name);

    setExpense({
      ...expense,
      [name]: isAmountField ? +value : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(expense).includes("")) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (expense.amount - previousAmount > remainingBudget) {
      setError("Este gasto se sale del presupuesto");
      return;
    }

    if (state.editingId) {
      dispatch({
        type: "UPDATE_EXPENSE",
        payload: { expense: { ...expense, id: state.editingId } },
      });
    } else {
      dispatch({ type: "ADD_EXPENSE", payload: { expense } });
    }

    setExpense({
      amount: 0,
      expenseName: "",
      category: "",
      date: new Date(),
    });
    setError("");
    setPreviousAmount(0);

    dispatch({ type: "SHOW_HIDE_MODAL" });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
        {state.editingId ? "Editar Gasto" : "Nuevo Gasto"}
      </legend>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">
          Nombre Gasto:
        </label>
        <input
          type="text"
          id="expenseName"
          placeholder="Añade el Nombre del gasto"
          className="bg-slate-100 p-2"
          name="expenseName"
          value={expense.expenseName}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Cantidad:
        </label>
        <input
          type="number"
          id="amount"
          placeholder="Añade la cantidad del gasto: ej.300"
          className="bg-slate-100 p-2"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xl">
          Categoría:
        </label>
        <select
          id="category"
          className="bg-slate-100 p-2"
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value={""}>-- Seleccione --</option>
          {categories.map((category: Category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="date" className="text-xl">
          Fecha Gasto:
        </label>
        <DatePicker
          className="bg-slate-100 p-2 border-0"
          value={expense.date}
          onChange={handelChangeDate}
        />
      </div>

      <input
        type="submit"
        className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounder-lg"
        value={state.editingId ? "Guardar cambios" : "Registrar gasto"}
      />
    </form>
  );
}
