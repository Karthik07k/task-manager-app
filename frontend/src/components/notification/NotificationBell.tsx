import { useState, useEffect } from "react";
import { Badge } from "primereact/badge";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Bell } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "@/app/(auth)/baseURL";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [visible, setVisible] = useState(false);

 const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

   useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

   useEffect(() => {
    if (user?.userId && token) {
    fetchNotifications();
    }
  }, [user, token]);

  const fetchNotifications = async () => {
     if (!user?.userId || !token) return;
    try {
        
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      setNotifications(response.data);
      setUnreadCount(response.data.length);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const markAsRead = async () => {
    try {
       const response = await axios.get(`${API_BASE_URL}/notifications/mark-read`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking notifications as read", error);
    }
  };

  return (
    <div className="relative">
      <Button 
        icon={<Bell size={24} />} 
        onClick={() => { setVisible(true); markAsRead(); }}
        className="p-button-text"
      />
      {unreadCount > 0 && (
        <Badge value={unreadCount} severity="danger" className="absolute top-0 right-0" />
      )}

      <Dialog header="Notifications" visible={visible} onHide={() => setVisible(false)}>
        <ul>
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            notifications.map((n) => (
              <li key={n.id} className="p-2 border-b">
                {n.message}
              </li>
            ))
          )}
        </ul>
      </Dialog>
    </div>
  );
};

export default NotificationBell;
