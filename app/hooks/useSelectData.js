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
        const data = await retrieveTileData(endpoint, token, requestData, tokenSource);
        if (data?.tiles?.length) {
          setData(data.tiles);
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
