import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSessionManager } from "../useSessionManager";

// ─── Hoisted mocks ───────────────────────────────────────────────────────────
// vi.mock calls are hoisted to the top of the file, so any variables they
// reference must also be hoisted via vi.hoisted — otherwise they're undefined
// at the time the factory runs.

const { mockRefreshToken, mockGetToken, mockGetProfile, mockLogout } =
  vi.hoisted(() => ({
    mockRefreshToken: vi.fn(),
    mockGetToken: vi.fn(),
    mockGetProfile: vi.fn(),
    mockLogout: vi.fn(),
  }));

vi.mock("@apollo/client/react", () => ({
  useMutation: () => [mockRefreshToken, {}],
}));

vi.mock("../../utils/auth", () => ({
  default: {
    getToken: mockGetToken,
    getProfile: mockGetProfile,
    logout: mockLogout,
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const NOW = 1_000_000_000_000; // arbitrary fixed timestamp in ms

// Returns a decoded token profile expiring `msFromNow` ms from NOW
const makeProfile = (msFromNow: number) => ({
  exp: Math.floor((NOW + msFromNow) / 1000),
  data: { _id: "u1", username: "testuser", email: "test@ontask.com" },
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("useSessionManager", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    mockGetToken.mockReset();
    mockGetProfile.mockReset();
    mockLogout.mockReset();
    mockRefreshToken.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── formatTime ──────────────────────────────────────────────────────────────

  describe("formatTime", () => {
    it("formats 0 seconds", () => {
      const { result } = renderHook(() => useSessionManager());
      expect(result.current.formatTime(0)).toBe("0:00");
    });

    it("formats seconds only", () => {
      const { result } = renderHook(() => useSessionManager());
      expect(result.current.formatTime(45)).toBe("0:45");
    });

    it("pads single-digit seconds with a leading zero", () => {
      const { result } = renderHook(() => useSessionManager());
      expect(result.current.formatTime(65)).toBe("1:05");
    });

    it("formats whole minutes", () => {
      const { result } = renderHook(() => useSessionManager());
      expect(result.current.formatTime(120)).toBe("2:00");
    });

    it("formats large values without rolling over to hours", () => {
      const { result } = renderHook(() => useSessionManager());
      expect(result.current.formatTime(3600)).toBe("60:00");
    });
  });

  // ── initial state ───────────────────────────────────────────────────────────

  describe("initial state", () => {
    it("showModal starts as false", () => {
      mockGetToken.mockReturnValue(null);
      const { result } = renderHook(() => useSessionManager());
      expect(result.current.showModal).toBe(false);
    });

    it("timeLeft starts as 0", () => {
      mockGetToken.mockReturnValue(null);
      const { result } = renderHook(() => useSessionManager());
      expect(result.current.timeLeft).toBe(0);
    });
  });

  // ── session expiry detection ────────────────────────────────────────────────

  describe("session expiry detection", () => {
    it("does not show modal when no token is present", () => {
      mockGetToken.mockReturnValue(null);

      const { result } = renderHook(() => useSessionManager(60_000));

      expect(result.current.showModal).toBe(false);
    });

    it("shows modal when token expires within the warning window", () => {
      mockGetToken.mockReturnValue("some-token");
      mockGetProfile.mockReturnValue(makeProfile(30_000)); // 30s left, warning is 60s

      const { result } = renderHook(() => useSessionManager(60_000));

      expect(result.current.showModal).toBe(true);
    });

    it("does not show modal when token is outside the warning window", () => {
      mockGetToken.mockReturnValue("some-token");
      mockGetProfile.mockReturnValue(makeProfile(120_000)); // 2 min left, warning is 60s

      const { result } = renderHook(() => useSessionManager(60_000));

      expect(result.current.showModal).toBe(false);
    });

    it("sets timeLeft to the correct remaining seconds when modal opens", () => {
      mockGetToken.mockReturnValue("some-token");
      mockGetProfile.mockReturnValue(makeProfile(30_000)); // 30s remaining

      const { result } = renderHook(() => useSessionManager(60_000));

      expect(result.current.timeLeft).toBe(30);
    });

    it("calls Auth.logout immediately when token is already expired", () => {
      mockGetToken.mockReturnValue("some-token");
      mockGetProfile.mockReturnValue(makeProfile(-5_000)); // expired 5s ago

      renderHook(() => useSessionManager(60_000));

      expect(mockLogout).toHaveBeenCalledOnce();
    });
  });

  // ── countdown ───────────────────────────────────────────────────────────────

  describe("countdown", () => {
    it("decrements timeLeft by 1 every second", () => {
      mockGetToken.mockReturnValue("some-token");
      mockGetProfile.mockReturnValue(makeProfile(30_000)); // 30s remaining

      const { result } = renderHook(() => useSessionManager(60_000));
      expect(result.current.timeLeft).toBe(30);

      act(() => {
        vi.advanceTimersByTime(3_000);
      });

      expect(result.current.timeLeft).toBe(27);
    });

    it("calls Auth.logout when the countdown reaches 0", () => {
      mockGetToken.mockReturnValue("some-token");
      mockGetProfile.mockReturnValue(makeProfile(3_000)); // 3s remaining

      renderHook(() => useSessionManager(60_000));

      act(() => {
        vi.advanceTimersByTime(4_000);
      });

      expect(mockLogout).toHaveBeenCalled();
    });
  });

  // ── handleLogout ─────────────────────────────────────────────────────────────

  describe("handleLogout", () => {
    it("calls Auth.logout", () => {
      mockGetToken.mockReturnValue(null);
      const { result } = renderHook(() => useSessionManager());

      act(() => {
        result.current.handleLogout();
      });

      expect(mockLogout).toHaveBeenCalledOnce();
    });
  });

  // ── handleExtendSession ──────────────────────────────────────────────────────

  describe("handleExtendSession", () => {
    it("stores the refreshed token in localStorage", async () => {
      mockGetToken.mockReturnValue("some-token");
      mockGetProfile.mockReturnValue(makeProfile(30_000));
      mockRefreshToken.mockResolvedValue({
        data: { refreshToken: { token: "refreshed-token" } },
      });

      const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
      const { result } = renderHook(() => useSessionManager(60_000));

      await act(async () => {
        await result.current.handleExtendSession();
      });

      expect(setItemSpy).toHaveBeenCalledWith("id_token", "refreshed-token");
    });

    it("hides the modal after a successful refresh", async () => {
      mockGetToken.mockReturnValue("some-token");
      mockGetProfile.mockReturnValue(makeProfile(30_000));
      mockRefreshToken.mockResolvedValue({
        data: { refreshToken: { token: "refreshed-token" } },
      });

      const { result } = renderHook(() => useSessionManager(60_000));
      expect(result.current.showModal).toBe(true);

      await act(async () => {
        await result.current.handleExtendSession();
      });

      expect(result.current.showModal).toBe(false);
    });

    it("resets timeLeft to 0 after a successful refresh", async () => {
      mockGetToken.mockReturnValue("some-token");
      mockGetProfile.mockReturnValue(makeProfile(30_000));
      mockRefreshToken.mockResolvedValue({
        data: { refreshToken: { token: "refreshed-token" } },
      });

      const { result } = renderHook(() => useSessionManager(60_000));
      expect(result.current.timeLeft).toBe(30);

      await act(async () => {
        await result.current.handleExtendSession();
      });

      expect(result.current.timeLeft).toBe(0);
    });

    it("calls Auth.logout when the token refresh fails", async () => {
      mockGetToken.mockReturnValue("some-token");
      mockGetProfile.mockReturnValue(makeProfile(30_000));
      mockRefreshToken.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useSessionManager(60_000));

      await act(async () => {
        await result.current.handleExtendSession();
      });

      expect(mockLogout).toHaveBeenCalled();
    });
  });
});