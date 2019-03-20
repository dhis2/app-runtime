import React, { useState, useEffect, useContext } from "react";
import { DataContext, DataContextType } from "./DataContext";
import { FetchError } from "./FetchError";

interface DataRequestRenderInput {
  loading: boolean;
  error: FetchError | undefined;
  data: Object | undefined;
}
interface DataRequestInput {
  resourcePath: string;
  children: (input: DataRequestRenderInput) => React.ReactNode;
}

export const DataRequest = ({
  resourcePath,
  children
}: DataRequestInput): React.ReactNode => {
  const context = useContext(DataContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchError | undefined>(undefined);
  const [data, setData] = useState<Object | undefined>(undefined);

  useEffect(() => {
    context
      .fetch(resourcePath)
      .then(setData)
      .catch(() =>
        setError({
          type: "unknown",
          message: `Failed to fetch ${resourcePath}`
        })
      )
      .then(() => setLoading(false));
  }, []);

  return children({ loading, error, data });
};
