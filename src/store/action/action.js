// Country List Action for redux Async
export const getCountryListFromServer = (data) => {
  return {
    type: 'country_list',
    payload: data
  };
};