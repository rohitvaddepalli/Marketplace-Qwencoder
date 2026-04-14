import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  const isAuthenticated = !!userInfo;
  const isAdmin = userInfo?.role === 'admin';
  const isSeller = userInfo?.role === 'seller';
  const isCustomer = userInfo?.role === 'customer';

  return {
    userInfo,
    isAuthenticated,
    isAdmin,
    isSeller,
    isCustomer,
  };
};
