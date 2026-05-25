import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLoginForm } from "../useLoginForm";

// ─── Hoisted mocks ───────────────────────────────────────────────────────────

const { mockAuthLogin } = vi.hoisted(() => ({
  mockAuthLogin: vi.fn(),
}));

vi.mock("../../utils/auth", () => ({
  default: {
    login: mockAuthLogin,
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Minimal synthetic form event — checkValidity passes by default
const makeMockEvent = () =>
  ({
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    currentTarget: { checkValidity: () => true },
  } as any);

const defaultProps = {
  title: "Login" as const,
  formData: { email: "test@ontask.com", password: "" },
  setFormData: vi.fn(),
  handleSub: vi.fn(),
  authData: "loginUser",
  userIdParam: null,
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("useLoginForm", () => {
  beforeEach(() => {
    mockAuthLogin.mockReset();
    vi.clearAllMocks();
  });

  // ── handleFormChange ──────────────────────────────────────────────────────

  describe("handleFormChange", () => {
    it("calls setFormData with the updated field merged into existing formData", () => {
      const setFormData = vi.fn();
      const { result } = renderHook(() =>
        useLoginForm({ ...defaultProps, setFormData })
      );

      act(() => {
        result.current.handleFormChange({
          target: { name: "email", value: "new@ontask.com" },
        } as any);
      });

      expect(setFormData).toHaveBeenCalledWith({
        email: "new@ontask.com",
        password: "",
      });
    });
  });

  // ── handleSubmit — success ────────────────────────────────────────────────

  describe("handleSubmit - success", () => {
    it("calls Auth.login with the loginUser token on successful login", async () => {
      const handleSub = vi.fn().mockResolvedValue({
        data: { loginUser: { token: "login-token" } },
      });

      const { result } = renderHook(() =>
        useLoginForm({ ...defaultProps, handleSub, authData: "loginUser" })
      );

      await act(async () => {
        await result.current.handleSubmit(makeMockEvent());
      });

      expect(mockAuthLogin).toHaveBeenCalledWith("login-token");
    });

    it("calls Auth.login with the addUser token on successful signup", async () => {
      const handleSub = vi.fn().mockResolvedValue({
        data: { addUser: { token: "signup-token" } },
      });

      const { result } = renderHook(() =>
        useLoginForm({ ...defaultProps, handleSub, authData: "addUser" })
      );

      await act(async () => {
        await result.current.handleSubmit(makeMockEvent());
      });

      expect(mockAuthLogin).toHaveBeenCalledWith("signup-token");
    });

    it("does not open the error modal on success", async () => {
      const handleSub = vi.fn().mockResolvedValue({
        data: { loginUser: { token: "token" } },
      });

      const { result } = renderHook(() =>
        useLoginForm({ ...defaultProps, handleSub })
      );

      await act(async () => {
        await result.current.handleSubmit(makeMockEvent());
      });

      expect(result.current.errorModalOpen).toBe(false);
    });
  });

  // ── handleSubmit — error parsing ──────────────────────────────────────────
  // The backend can return errors in several shapes. Each branch below
  // tests a different path through the error handling logic in handleSubmit.

  describe("handleSubmit - error parsing", () => {
    it("formats a JSON array of error objects into a bullet list", async () => {
      const handleSub = vi.fn().mockRejectedValue({
        message: JSON.stringify([
          { message: "Email already in use" },
          { message: "Username already taken" },
        ]),
      });

      const { result } = renderHook(() =>
        useLoginForm({ ...defaultProps, handleSub })
      );

      await act(async () => {
        await result.current.handleSubmit(makeMockEvent());
      });

      expect(result.current.errorMsg).toContain("Email already in use");
      expect(result.current.errorMsg).toContain("Username already taken");
    });

    it("uses the raw message string when JSON parsing fails", async () => {
      const handleSub = vi.fn().mockRejectedValue({
        message: "Invalid credentials",
      });

      const { result } = renderHook(() =>
        useLoginForm({ ...defaultProps, handleSub })
      );

      await act(async () => {
        await result.current.handleSubmit(makeMockEvent());
      });

      expect(result.current.errorMsg).toBe("Invalid credentials");
    });

    it("uses the raw message when JSON is valid but not an error array", async () => {
      const weirdJson = JSON.stringify({ error: "unexpected shape" });
      const handleSub = vi.fn().mockRejectedValue({ message: weirdJson });

      const { result } = renderHook(() =>
        useLoginForm({ ...defaultProps, handleSub })
      );

      await act(async () => {
        await result.current.handleSubmit(makeMockEvent());
      });

      expect(result.current.errorMsg).toBe(weirdJson);
    });

    it("uses the first graphQLErrors message when present", async () => {
      // graphQLErrors branch only fires when err.message is absent
      const handleSub = vi.fn().mockRejectedValue({
        graphQLErrors: [{ message: "Unauthorized" }],
      });

      const { result } = renderHook(() =>
        useLoginForm({ ...defaultProps, handleSub })
      );

      await act(async () => {
        await result.current.handleSubmit(makeMockEvent());
      });

      expect(result.current.errorMsg).toBe("Unauthorized");
    });

    it("shows a network error message when networkError is present", async () => {
      const handleSub = vi.fn().mockRejectedValue({
        networkError: new Error("Failed to fetch"),
      });

      const { result } = renderHook(() =>
        useLoginForm({ ...defaultProps, handleSub })
      );

      await act(async () => {
        await result.current.handleSubmit(makeMockEvent());
      });

      expect(result.current.errorMsg).toBe(
        "Network error. Please check your connection."
      );
    });

    it("falls back to the default message when the error has no useful info", async () => {
      const handleSub = vi.fn().mockRejectedValue({});

      const { result } = renderHook(() =>
        useLoginForm({ ...defaultProps, handleSub })
      );

      await act(async () => {
        await result.current.handleSubmit(makeMockEvent());
      });

      expect(result.current.errorMsg).toBe(
        "Something went wrong. Please try again."
      );
    });

    it("opens the error modal on any error", async () => {
      const handleSub = vi.fn().mockRejectedValue({ message: "Oops" });

      const { result } = renderHook(() =>
        useLoginForm({ ...defaultProps, handleSub })
      );

      await act(async () => {
        await result.current.handleSubmit(makeMockEvent());
      });

      expect(result.current.errorModalOpen).toBe(true);
    });
  });

  // ── errorModalOpen controls ───────────────────────────────────────────────

  describe("errorModalOpen controls", () => {
    it("starts as false", () => {
      const { result } = renderHook(() => useLoginForm(defaultProps));
      expect(result.current.errorModalOpen).toBe(false);
    });

    it("can be closed via setErrorModalOpen", async () => {
      const handleSub = vi.fn().mockRejectedValue({ message: "Oops" });

      const { result } = renderHook(() =>
        useLoginForm({ ...defaultProps, handleSub })
      );

      await act(async () => {
        await result.current.handleSubmit(makeMockEvent());
      });

      expect(result.current.errorModalOpen).toBe(true);

      act(() => {
        result.current.setErrorModalOpen(false);
      });

      expect(result.current.errorModalOpen).toBe(false);
    });
  });
});