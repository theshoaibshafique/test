import React from 'react';
import { request } from '../utils/global-functions';

/*
* Returns some data from an API endpoint by making any type of request
* @param {string} endpoint - The environment endpoint you want to hit
* @param {type} type - The type of request you want to make
* @param {(string | object)} token - The token you want to use
* @param {object} requestData - The payload you want to send (optional, can be left off)
* @param {?} tokenSource - The axios cancel token source (could be a function but I didn't bother to check at the time of writing)
* @returns {boolean, object} loading, data - The loading state and the data object we expect to utilize on the pages this hook is called on.
*/

const useSelectData = (endpoint, type, token, requestData = {}, tokenSource) => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(false);

  React.useEffect(() => {
    const fetchTileData = async () => {
      setLoading(true);
      try {
        const retrieveTileData = request(type || 'post');
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
