import React, { ReactNode, createContext, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID, getTodos } from '../../api/todos';

export interface MyContextData {
  data: Todo[];
  error: string;
  query: string;
  tempTodo: Todo | null;
  createTempTodo: (arg: boolean) => void;
  handleFetchData: () => void;
  handleSetData: (arg: Todo[]) => void;
  handleSetError: (arg: string) => void;
  handleSetQuery: (arg: string) => void;
}

interface Props {
  children: ReactNode;
}

export const MyContext = createContext<MyContextData | string>('default value');

export const MyProvider: React.FC<Props> = ({ children }) => {
  const [data, setData] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const handleSetData = (someData: Todo[]) => {
    setData(someData);
  };

  const handleSetError = (e: string) => {
    setError(e);
  };

  const handleSetQuery = (title: string) => {
    setQuery(title);
  };

  const createTempTodo = (arg = false) => {
    const obj = { id: 0, title: query, userId: USER_ID, completed: false };

    if (arg) {
      setTempTodo(obj);
    } else {
      setTempTodo(null);
    }
  };

  const fetchData = () => {
    getTodos()
      .then(serverData => {
        handleSetData(serverData);
      })
      .catch(() => handleSetError('Unable to load todos'));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFetchData = () => {
    fetchData();
  };

  const values: MyContextData = {
    data,
    error,
    query,
    tempTodo,
    createTempTodo,
    handleFetchData,
    handleSetData,
    handleSetError,
    handleSetQuery,
  };

  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};