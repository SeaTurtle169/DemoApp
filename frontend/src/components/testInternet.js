import { useEffect, useState } from "react";

function NetworkInterval() {
  const [info, setInfo] = useState({});
  const [localIp, setLocalIp] = useState("");

  // Hàm lấy Local IP (private IP trong mạng LAN)
  async function getLocalIP() {
    return new Promise((resolve, reject) => {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel("");
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(err => reject(err));

      pc.onicecandidate = (event) => {
        if (!event || !event.candidate) return;
        const candidate = event.candidate.candidate;
        const parts = candidate.split(" ");
        const ip = parts[4];
        if (ip.startsWith("192.") || ip.startsWith("10.") || ip.startsWith("172.")) {
          resolve(ip);
          pc.close();
        }
      };
    });
  }

  useEffect(() => {
    // Gọi khi component mount để lấy Local IP
    getLocalIP()
      .then(ip => {
        setLocalIp(ip);
        console.log("Local IP:", ip);
      })
      .catch(err => console.error(err));
  }, []);

  // Lấy thông tin network từ Network Information API
  useEffect(() => {
    if ("connection" in navigator) {
      const connection = navigator.connection;

      const updateInfo = () => {
        setInfo({
          type: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });
      };

      updateInfo();
      const interval = setInterval(updateInfo, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div>
      <h3>Thông tin mạng (cập nhật mỗi giây)</h3>
      {info.type ? (
        <ul>
          <li><b>Loại mạng:</b> {info.type}</li>
          <li><b>Tốc độ download (ước lượng):</b> {info.downlink} Mbps</li>
          <li><b>Độ trễ RTT:</b> {info.rtt} ms</li>
          <li><b>Tiết kiệm dữ liệu:</b> {info.saveData ? "Có" : "Không"}</li>
        </ul>
      ) : (
        
        <p>Trình duyệt không hỗ trợ Network Information API</p>
      )}

      <h3>💻 Local IP (Private): {localIp || "Đang lấy..."}</h3>
    </div>
  );
}

export default NetworkInterval;
