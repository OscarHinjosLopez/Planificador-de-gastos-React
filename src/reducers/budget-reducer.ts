export type BudgetAction =
  | { type: "ADD-BUDGET"; payload: { budget: number } }
  | { type: "SHOW_HIDE_MODAL" };

export type BudgetState = {
  budget: number;
  modal: boolean;
};

export const initialState: BudgetState = {
  budget: 0,
  modal: false,
};

export const budgetReducer = (
  state: BudgetState = initialState,
  action: BudgetAction,
) => {
  switch (action.type) {
    case "ADD-BUDGET":
      return {
        ...state,
        budget: action.payload.budget,
      };
    case "SHOW_HIDE_MODAL":
      return {
        ...state,
        modal: !state.modal,
      };

    default:
      return state;
  }
};
