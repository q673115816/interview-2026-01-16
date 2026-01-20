export const formatDate = (date?: string) => {
  if (!date) {
    return "";
  }
  try {
    const d = new Date(date);
    // Check if date is valid
    if (isNaN(d.getTime())) {
      return date;
    }
    return d.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  } catch {
    return date;
  }
};

export const formatTime = (time?: string) => {
  if (!time) {
    return "";
  }
  try {
    if (!time.includes(":")) {
      return time;
    }
    const parts = time.split(":");
    if (parts.length < 2) {
      return time;
    }
    const [h, m] = parts;
    return `${h}:${m}`;
  } catch {
    return time;
  }
};
