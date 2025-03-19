import React, { createContext, useState, ReactNode } from 'react';

interface ActionHandlers {
  onConfirm: () => void;
  onCancel: () => void;
}

interface ActionContextType {
  actionHandlers: ActionHandlers;
  setActionHandlers: React.Dispatch<React.SetStateAction<ActionHandlers>>;
}

// Create default context with no-op handlers
const defaultActionHandlers: ActionHandlers = {
  onConfirm: () => console.warn('onConfirm is not implemented'),
  onCancel: () => console.warn('onCancel is not implemented'),
};

// Create default context
export const ActionContext = createContext<ActionContextType>({
  actionHandlers: defaultActionHandlers,
  setActionHandlers: () => {}
});

// Create provider component
interface ActionProviderProps {
  children: ReactNode;
}

export const ActionProvider: React.FC<ActionProviderProps> = ({ children }) => {
  const [actionHandlers, setActionHandlers] = useState<ActionHandlers>(defaultActionHandlers);

  return (
    <ActionContext.Provider value={{ actionHandlers, setActionHandlers }}>
      {children}
    </ActionContext.Provider>
  );
};