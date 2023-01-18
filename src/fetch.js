import axios from "axios";
import { useQuery, useMutation } from "react-query";

// "get" in fetch request keys are important
export const apiRoutes = {
  getUser: ["get", "api/users/#"],
  getUsers: ["get", "api/users"],
  createUser: ["post", "api/users"],
  updateUser: ["put", "api/users/#"],
  deleteUser: ["delete", "api/users/#"]
};

const api = axios.create({
  baseURL: "https://reqres.in",
  headers: {
    Token: "tokenHere"
  }
});

const useAPI = (key, axiosOptions, queryConfig) => {
  const query = useQuery(
    key,
    () =>
      api
        .get(apiRoutes[key][1], { ...(axiosOptions || {}) })
        .then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      initialData: key.includes("list")
        ? { page: 0, per_page: 0, total: 0, total_pages: 0, data: [] }
        : null,
      ...queryConfig
    }
  );
  const mutation = useMutation(
    (data) => {
      return api({
        url: apiRoutes[key][1].replace("#", data.pathParam || ""),
        method: apiRoutes[key][0],
        ...data,
        ...(axiosOptions || {})
      }).then((res) => res.data);
    },
    { ...queryConfig }
  );

  return key.includes("get") ? query : mutation;
};

export default useAPI;
