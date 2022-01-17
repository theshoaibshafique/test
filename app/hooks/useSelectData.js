import React from 'react';
import { request } from '../utils/global-functions';

const useSelectData = (endpoint, token, requestData, tokenSource) => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(false);

  React.useEffect(() => {
    const fetchTileData = async () => {
      setLoading(true);
      try {
        const retrieveTileData = request('post');
        const retrieved = await retrieveTileData(endpoint, token, requestData, tokenSource);
        if (retrieved?.tiles?.length) {
          setData(retrieved.tiles);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchTileData();
  }, []);

  return { loading, data };
};

export default useSelectData;
