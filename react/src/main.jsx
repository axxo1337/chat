import ReactDOM from "react-dom/client";
import { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./index.css";

const ENDPOINT = "http://127.0.0.1:8080";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [msg, setMsg] = useState([]);

  let socket = socketIOClient(ENDPOINT);

  const userRef = useRef();
  const msgRef = useRef();

  const setupSocket = (user) => {
    socket.emit("join", user);

    socket.on("new_user", (data) => {
      setMsg([...data]);
    });

    socket.on("new_msg", (data) => {
      Array.isArray(data)
        ? setMsg([...data])
        : setMsg((oldMsg) => {
            return [...oldMsg, data];
          });
    });
  };

  useEffect(() => {
    if (user) {
      setupSocket(user);
    }

    setLoaded(true);
  }, []);

  const onNewUser = (e) => {
    e.preventDefault();

    const input = userRef.current.value;

    if (input) {
      localStorage.setItem("user", input);
      setUser(input);
      setupSocket();
    }
  };

  const onNewMsg = () => {
    socket.emit("msg", { user: user, content: msgRef.current.value });
    msgRef.current.value = "";
  };

  if (loaded) {
    return user ? (
      <div className="Frame gap-5 items-center">
        <div className="w-full rounded-md border-2 lg:min-w-[50vw] min-h-[50vh] max-h-[50vh] overflow-scroll px-4 py-3 flex flex-col gap-3">
          {msg.map((m) => (
            <div>
              <span className={`${m.user === user && "text-blue-400"}`}>
                [{m.user}] :
              </span>
              <span>{m.content}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full">
          <input
            className="w-full border-2 rounded-md px-4"
            placeholder="Send message"
            type="text"
            ref={msgRef}
          />
          <button onClick={onNewMsg}>Send</button>
        </div>
      </div>
    ) : (
      <form className="Frame items-center gap-5" onSubmit={onNewUser}>
        <label>Enter username</label>
        <input
          className="w-full border-2 rounded-md px-4"
          type="text"
          placeholder="username"
          ref={userRef}
        />
        <button type="submit">Let's go</button>
      </form>
    );
  } else {
    return <></>;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
