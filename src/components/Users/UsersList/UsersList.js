import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersAction } from "../../../redux/slices/users/usersSlices";
import LoadingComponent from "../../../utlis/LoadingComponent";
// import UsersListHeader from "./UsersListHeader";
import UsersListItem from "./UsersListItem";

const UsersList = () => {
  // create an instance of dispatch
  const dispatch = useDispatch();

    // Get the data from state
    const user = useSelector(state => state?.users);
    const { loading, appErr, serverErr, usersList, blocked, unblocked } = user;

  // Dispatch the action on component mounting to fetch list of users
  useEffect(() => {
    dispatch(fetchUsersAction());
  }, [blocked, unblocked]);


  return (
    <>
      { loading ? <LoadingComponent /> : appErr || serverErr ? <h2 className="text-yellow-400 text-center text-lg">{serverErr} {appErr}</h2> : usersList?.length <= 0 ? <h2 className="text-yellow-400 text-center text-lg">No Users Exist</h2> : (
        <section className="py-8 bg-gray-900 min-h-screen">
          {/* <UsersListHeader /> */}
          { usersList?.map(user => (
            <div key={user?._id} className="container px-4 mx-auto"><UsersListItem user={user} /></div>    
          ))}
        </section>
      )}
    </>
  );
};

export default UsersList;
