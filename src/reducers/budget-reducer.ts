import type { Category } from "../types/category";
import type { DraftExpense, Expense } from "../types/expense";
import { v4 as uuidv4 } from "uuid";

export type BudgetAction =
  | { type: "ADD_BUDGET"; payload: { budget: number } }
  | { type: "SHOW_HIDE_MODAL" }
  | { type: "ADD_EXPENSE"; payload: { expense: DraftExpense } }
  | { type: "DELETE_EXPENSE"; payload: { id: Expense["id"] } }
  | { type: "EDIT_EXPENSE"; payload: { expense: Expense["id"] } }
  | { type: "UPDATE_EXPENSE"; payload: { expense: Expense } }
  | { type: "RESET_APP" }
  | { type: "ADD_FILTER_CATEGORY"; payload: { id: Category["id"] } };

export type BudgetState = {
  budget: number;
  modal: boolean;
  expenses: Expense[];
  editingId: Expense["id"];
  currentCategory: Category["id"];
};

const initialBudguet = (): number => {
  const localStorageBudget = localStorage.getItem("budget");
  return localStorageBudget ? +localStorageBudget : 0;
};

const localStorageExpenses = (): Expense[] => {
  const localStorageExpenses = localStorage.getItem("expenses");
  return localStorageExpenses ? JSON.parse(localStorageExpenses) : [];
};

export const initialState: BudgetState = {
  budget: initialBudguet(),
  modal: false,
  expenses: localStorageExpenses(),
  editingId: "",
  currentCategory: "",
};

const createExpense = (drafExpense: DraftExpense): Expense => {
  return {
    ...drafExpense,
    id: uuidv4(),
  };
};

export const budgetReducer = (
  state: BudgetState = initialState,
  action: BudgetAction,
) => {
  switch (action.type) {
    case "ADD_BUDGET":
      return {
        ...state,
        budget: action.payload.budget,
      };
    case "SHOW_HIDE_MODAL":
      if (state.editingId) {
        return {
          ...state,
          modal: !state.modal,
          editingId: "",
        };
      }
      return {
        ...state,
        modal: !state.modal,
      };
    case "ADD_EXPENSE":
      const newExpense = createExpense(action.payload.expense);

      return {
        ...state,
        expenses: [...state.expenses, newExpense],
      };

    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload.id,
        ),
      };
    case "EDIT_EXPENSE":
      return {
        ...state,
        editingId: action.payload.expense,
        modal: true,
      };
    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.expense.id
            ? action.payload.expense
            : expense,
        ),
        editingId: "",
      };
    case "RESET_APP":
      return {
        ...state,
        budget: 0,
        expenses: [],
      };
    case "ADD_FILTER_CATEGORY":
      return {
        ...state,
        currentCategory: action.payload.id,
      };
    default:
      return state;
  }
};
