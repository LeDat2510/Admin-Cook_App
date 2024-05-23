
export const saveUserDataToLocalStorage = (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  };
  
  export const getUserDataFromLocalStorage = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  };
  
  export const clearUserDataFromLocalStorage = () => {
    localStorage.removeItem('userData');
  };