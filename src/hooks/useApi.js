import { useDispatch, useSelector } from 'react-redux';
import { loginUser, resetPassword, forgetPassword } from '../store/authSlice';
import { createUsers, createUser, updateUser, deleteUser } from '../store/userSlice';
import { getVoters, updateVoter } from '../store/voterSlice';

export const useApi = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const users = useSelector(state => state.users);
  const voters = useSelector(state => state.voter);

  return {
    auth: {
      login: (credentials) => dispatch(loginUser(credentials)),
      resetPassword: (data) => dispatch(resetPassword(data)),
      forgetPassword: (data) => dispatch(forgetPassword(data)),
      ...auth
    },
    users: {
      createBulk: (data) => dispatch(createUsers(data)),
      create: (data) => dispatch(createUser(data)),
      update: (data) => dispatch(updateUser(data)),
      delete: (data) => dispatch(deleteUser(data)),
      ...users
    },
    voters: {
      getList: (params) => dispatch(getVoters(params)),
      update: (data) => dispatch(updateVoter(data)),
      ...voters
    }
  };
};