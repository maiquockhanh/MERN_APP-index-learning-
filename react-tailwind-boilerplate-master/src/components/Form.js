import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import queryString from "query-string";
import axios from "axios";

const baseUrl = "http://localhost:4000/api/user";

export default function Form() {
  const [invalidToken, setValidToken] = useState("");

  const location = useLocation();

  const verifyToken = async () => {
    try {
      const { token, id } = queryString.parse(location.search);
      const { data } = await axios(
        `${baseUrl}/verified-token/?token=${token}&id=${id}`
      );
      if (!data.success) return setValidToken(data.error);
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) return setValidToken(data.error);
        console.log(error.response.data);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  if (invalidToken !== "")
    return (
      <div className="max-w-screen-sm m-auto pt-40">
        <h1 className="text-center text-3x1 text-gray-500 mb-3">
          Reset Token not found
        </h1>
      </div>
    );

  return (
    <div className="max-w-screen-sm m-auto pt-40">
      <h1 className="text-center text-3x1 text-gray-500 mb-3">ResetPassword</h1>
      <form className="shadow w-full rounded-lg p-10">
        <div className="space-y-8">
          <input
            type="password"
            placeholder="*********"
            className="px-3 text-lg h-10 w-full border-gray-500 border-2 rounded"
          />
          <input
            type="password"
            placeholder="*********"
            className="px-3 text-lg h-10 w-full border-gray-500 border-2 rounded"
          />
          <input
            type="submit"
            value="Reset Password"
            className="bg-gray-500 w-full py-3 text-white rounded"
          />
        </div>
      </form>
    </div>
  );
}
