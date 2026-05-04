import {
  useReducer,
  createContext,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  budgetReducer,
  initialState,
  type BudgetAction,
  type BudgetState,
} from "../reducers/budget-reducer";

type BudgetContextProps = {
  state: BudgetState;
  dispatch: Dispatch<BudgetAction>;
};

type BudgetProviderProps = {
  children: ReactNode;
};

export const BudgetContext = createContext<BudgetContextProps>(null!);

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  return (
    <BudgetContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
