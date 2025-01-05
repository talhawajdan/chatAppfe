import LogoIcon from "@assets/icons/logo-icon";
import { SplashScreen } from "@components/splash-screen";
import { socketEvent } from "@enums/event";
import { BASE_URL } from "@root/config";
import { micsActions } from "@store/slice/mics/reducer";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";

const SocketContext = createContext<any>(null);

const getSocket = () => useContext(SocketContext);
const SocketProvider = ({ children }: any) => {
  const [socket, setSocket] = useState<any>(null);
  const dispatch=useDispatch();
  const { accessToken } = useSelector((state: any) => state.auth);
  useEffect(() => {
    if (!socket) {
      const socketInstance = io(BASE_URL, {
        query: {
          accessToken: accessToken,
        },
        autoConnect: true, // automatically attempt to connect
      });

      // Store the socket instance in the state
      setSocket(socketInstance);

      // Cleanup when the component unmounts
      return () => {
        socketInstance.disconnect();
      };
    }
  }, []); // Only run once on initial mount

  useEffect(() => {
    if (socket) {
      socket.on(socketEvent.onlineUsers, (data:any) => {
       
        dispatch(micsActions.setOnlineUsers(data));
        
      });

      // Cleanup socket event listeners on unmount
      return () => {
        socket.off("connect");
      };
    }
  }, [socket]);

  if (!socket) {
    return (
      <SplashScreen>
        <LogoIcon
          sx={{
            width: 800,
            height: 100,
          }}
        />
      </SplashScreen>
    ); // Display loading if socket is not initialized yet
  }

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { getSocket, SocketProvider };
