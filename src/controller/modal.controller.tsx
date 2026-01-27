import React, { useContext, useMemo, useReducer } from 'react';

type State = { openned: boolean };

const defaultState: State = { openned: false };

type Action = { type: 'open' | 'close' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'open':
      return { ...state, openned: true };
    case 'close':
      return { ...state, openned: false };
  }
};

const ContextData = React.createContext({
  openned: false,
});

const ContextApi = React.createContext({
  open: () => {},
  close: () => {},
});

export const useModalData = () => useContext(ContextData);
export const useModalApi = () => useContext(ContextApi);

export const ModalController = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const data = useMemo(
    () => ({
      openned: state.openned,
    }),
    [state]
  );

  const api = useMemo(
    () => ({
      open: () => dispatch({ type: 'open' }),
      close: () => dispatch({ type: 'close' }),
    }),
    []
  );

  return (
    <ContextData.Provider value={data}>
      <ContextApi.Provider value={api}>{children}</ContextApi.Provider>
    </ContextData.Provider>
  );
};
