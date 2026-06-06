import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";

function IncomingCallManager() {
  const [incomingCall, setIncomingCall] = useState(null);

  const ringtoneRef = useRef(
    new Audio("/ringtone.mp3")
  );

  useEffect(() => {
    const userInfo = JSON.parse(
      localStorage.getItem("userInfo")
    );

    if (!userInfo || userInfo.role !== "provider") {
      return;
    }

    ringtoneRef.current.loop = true;

    joinProviderRoom();

    socket.on("incomingCall", (data) => {
      setIncomingCall(data);

      ringtoneRef.current.play();
    });

    return () => {
      socket.off("incomingCall");

      ringtoneRef.current.pause();
    };
  }, []);

  const joinProviderRoom = async () => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const res = await API.get(
        "/providers/my-profile",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      socket.emit(
        "joinProviderRoom",
        res.data._id
      );
    } catch (error) {
      console.log(error);
    }
  };

  const stopRingtone = () => {
    ringtoneRef.current.pause();
    ringtoneRef.current.currentTime = 0;
  };

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-[420]px rounded-2xl shadow-2xl p-8 text-center">
        <div className="text-6xl mb-4">
          📞
        </div>

        <h2 className="text-3xl font-bold mb-3">
          Incoming Call
        </h2>

        <p className="text-lg text-gray-600 mb-6">
          {incomingCall.customerName}
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              socket.emit("acceptCall", {
                customerId:
                  incomingCall.customerId,
              });

              stopRingtone();
              setIncomingCall(null);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Accept
          </button>

          <button
            onClick={() => {
              socket.emit("declineCall", {
                customerId:
                  incomingCall.customerId,
              });

              stopRingtone();
              setIncomingCall(null);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingCallManager;