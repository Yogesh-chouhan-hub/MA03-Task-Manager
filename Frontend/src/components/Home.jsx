import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:3000/",
          {},
          {
            withCredentials: true,
          },
        );

        if (!data.status) {
          navigate("/login");
          return;
        }

        setUsername(data.user);

        toast(`Hello ${data.user}`, {
          position: "top-right",
        });
      } catch (error) {
        console.error("Verification error:", error);

        navigate("/login");
      }
    };

    verifyUser();
  }, [navigate]);

  const Logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/logout",
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error(error);
    }

    navigate("/login");
  };

  return (
    <>
      <div className="home_page">
        <h4>
          Welcome <span>{username}</span>
        </h4>

        <button onClick={Logout}>LOGOUT</button>
      </div>

      <ToastContainer />
    </>
  );
};

export default Home;
