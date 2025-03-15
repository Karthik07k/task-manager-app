"use client"
import { useEffect, useRef } from "react";
import { Id, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Store active toasts with their task IDs and expiration times
interface ToastRecord {
  toastId: Id;
  expireAt: number;
  message: string;
  type: "info" | "success" | "warning" | "error";
  shownAt: number;
}

// Cache to track active toasts
const toastCache = new Map<string, ToastRecord>();

// Load toast cache from localStorage on module initialization
const loadToastCache = () => {
  try {
    const savedCache = localStorage.getItem('toastCache');
    if (savedCache) {
      const parsedCache = JSON.parse(savedCache);
      // Filter out expired toasts
      const now = Date.now();
      Object.entries(parsedCache).forEach(([taskId, record]: [string, any]) => {
        if (now < record.expireAt) {
          toastCache.set(taskId, {
            ...record,
            toastId: null // We'll create new toast IDs when needed
          });
        }
      });
    }
  } catch (error) {
    console.error('Error loading toast cache:', error);
  }
};

// Save toast cache to localStorage
const saveToastCache = () => {
  try {
    const cacheObject = Object.fromEntries(toastCache.entries());
    localStorage.setItem('toastCache', JSON.stringify(cacheObject));
  } catch (error) {
    console.error('Error saving toast cache:', error);
  }
};

// Clean expired toasts from cache
const cleanExpiredToasts = () => {
  const now = Date.now();
  let hasChanges = false;
  
  for (const [taskId, record] of toastCache.entries()) {
    if (now > record.expireAt) {
      toastCache.delete(taskId);
      hasChanges = true;
    }
  }
  
  if (hasChanges) {
    saveToastCache();
  }
};

// Check if a toast should be shown again based on time
const shouldShowToastAgain = (taskId: string, minIntervalMs = 30000) => {
  const record = toastCache.get(taskId);
  if (!record) return true;
  
  const now = Date.now();
  // Don't show the same toast if it was shown recently (within minIntervalMs)
  return now - record.shownAt > minIntervalMs;
};

export const showToast = (
  message: string,
  type: "info" | "success" | "warning" | "error" = "info",
  taskId?: string,
  duration: number = 10000 // Default to 10 seconds
) => {
  // If no taskId is provided, show toast without duplicate checking
  if (!taskId) {
    return toast[type](message, {
      position: "top-right",
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  }

  // Check if a toast for this taskId is already active or was shown recently
  if (toastCache.has(taskId) && !shouldShowToastAgain(taskId)) {
    // Toast was shown recently, don't show a duplicate
    return null;
  }

  // Show new toast and store its ID
  const toastId = toast[type](message, {
    position: "top-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    onClose: () => {
      // Mark as closed in cache but don't delete to track shown history
      const record:any = toastCache.get(taskId);
      if (record) {
        record.toastId = null;
        saveToastCache();
      }
    }
  });

  // Store in cache with expiration
  const now = Date.now();
  toastCache.set(taskId, {
    toastId,
    message,
    type,
    expireAt: now + 3600000, // 1 hour expiration for tracking purposes
    shownAt: now
  });
  
  saveToastCache();
  return toastId;
};

// Dismiss a specific toast by task ID
export const dismissToast = (taskId: string) => {
  const record:any = toastCache.get(taskId);
  if (record && record.toastId) {
    toast.dismiss(record.toastId);
    record.toastId = null;
    saveToastCache();
  }
};

const ToastNotification = () => {
  const cleanupInterval = useRef<any>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // Load existing toast cache on component mount
      loadToastCache();
      initialized.current = true;
    }
    
    // Set up interval to clean expired toasts
    cleanupInterval.current = setInterval(() => {
      cleanExpiredToasts();
    }, 60000); // Check every minute
    
    // Clean up on unmount
    return () => {
      if (cleanupInterval.current) {
        clearInterval(cleanupInterval.current);
      }
    };
  }, []);

  return <ToastContainer />;
};

export default ToastNotification;