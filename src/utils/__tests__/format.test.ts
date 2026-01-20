import { formatDate, formatTime } from "../format";

describe("formatDate", () => {
  it("should return empty string for undefined input", () => {
    expect(formatDate(undefined)).toBe("");
  });

  it("should format valid date string correctly", () => {
    const date = "2023-10-01";
    const result = formatDate(date);
    expect(result).not.toBe("");
    expect(result).not.toBe(date);
  });

  it("should return original string for invalid date", () => {
    const invalidDate = "invalid-date";
    const result = formatDate(invalidDate);
    expect(result).toBe(invalidDate);
  });
});

describe("formatTime", () => {
  it("should return empty string for undefined input", () => {
    expect(formatTime(undefined)).toBe("");
  });

  it("should format valid time string correctly", () => {
    const time = "14:30:00";
    expect(formatTime(time)).toBe("14:30");
  });

  it("should return original string if format is invalid", () => {
    expect(formatTime("invalid")).toBe("invalid");
    expect(formatTime("14")).toBe("14");
  });
});
