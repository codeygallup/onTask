import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTask } from "../useTask";
import type { Task } from "../../types";

// ─── Hoisted mocks ───────────────────────────────────────────────────────────

const { mockMutate, mockUseQuery, mockRefetch } = vi.hoisted(() => ({
  mockMutate: vi.fn(),
  mockUseQuery: vi.fn(),
  mockRefetch: vi.fn(),
}));

// All three useMutation calls (addTask, removeTasks, updateComplete) share one
// mock function — we distinguish them by the variables they're called with.
vi.mock("@apollo/client/react", () => ({
  useQuery: mockUseQuery,
  useMutation: () => [mockMutate, {}],
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  _id: "t1",
  text: "Test task",
  complete: false,
  projectId: "p1",
  ...overrides,
});

const TASKS = [
  makeTask({ _id: "t1", text: "Task 1", complete: false }),
  makeTask({ _id: "t2", text: "Task 2", complete: true }),
  makeTask({ _id: "t3", text: "Task 3", complete: false }),
  makeTask({ _id: "t4", text: "Task 4", complete: true }),
];

const BASE_PROJECT = {
  _id: "p1",
  title: "Test Project",
  description: "A project",
  userId: "u1",
  tasks: TASKS,
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("useTask", () => {
  beforeEach(() => {
    mockMutate.mockReset();
    mockMutate.mockResolvedValue({});
    mockRefetch.mockReset();
    mockRefetch.mockResolvedValue({});

    mockUseQuery.mockReturnValue({
      data: { oneProject: BASE_PROJECT },
      refetch: mockRefetch,
    });
  });

  // ── initial state ─────────────────────────────────────────────────────────

  describe("initial state", () => {
    it("selectedTasks starts as an empty array", () => {
      const { result } = renderHook(() => useTask("p1"));
      expect(result.current.selectedTasks).toEqual([]);
    });

    it("selectedOption starts as 'allTasks'", () => {
      const { result } = renderHook(() => useTask("p1"));
      expect(result.current.selectedOption).toBe("allTasks");
    });

    it("exposes the project returned from the query", () => {
      const { result } = renderHook(() => useTask("p1"));
      expect(result.current.project._id).toBe("p1");
    });
  });

  // ── filteredTasks ─────────────────────────────────────────────────────────

  describe("filteredTasks", () => {
    it("returns all tasks when selectedOption is 'allTasks'", () => {
      const { result } = renderHook(() => useTask("p1"));
      expect(result.current.filteredTasks).toHaveLength(4);
    });

    it("returns only completed tasks when selectedOption is 'completedTasks'", () => {
      const { result } = renderHook(() => useTask("p1"));

      act(() => {
        result.current.setSelectedOption("completedTasks");
      });

      expect(result.current.filteredTasks).toHaveLength(2);
      expect(result.current.filteredTasks.every((t) => t.complete)).toBe(true);
    });

    it("returns only incomplete tasks when selectedOption is 'incompletedTasks'", () => {
      const { result } = renderHook(() => useTask("p1"));

      act(() => {
        result.current.setSelectedOption("incompletedTasks");
      });

      expect(result.current.filteredTasks).toHaveLength(2);
      expect(result.current.filteredTasks.every((t) => !t.complete)).toBe(true);
    });

    it("returns an empty array when no tasks match the active filter", () => {
      mockUseQuery.mockReturnValue({
        data: {
          oneProject: {
            ...BASE_PROJECT,
            tasks: [makeTask({ complete: false })],
          },
        },
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useTask("p1"));

      act(() => {
        result.current.setSelectedOption("completedTasks");
      });

      expect(result.current.filteredTasks).toHaveLength(0);
    });

    it("handles a project with no tasks", () => {
      mockUseQuery.mockReturnValue({
        data: { oneProject: { ...BASE_PROJECT, tasks: [] } },
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useTask("p1"));
      expect(result.current.filteredTasks).toHaveLength(0);
    });

    it("handles missing project data gracefully", () => {
      mockUseQuery.mockReturnValue({ data: undefined, refetch: mockRefetch });

      const { result } = renderHook(() => useTask("p1"));
      expect(result.current.filteredTasks).toHaveLength(0);
    });
  });

  // ── handleAddTask ─────────────────────────────────────────────────────────

  describe("handleAddTask", () => {
    it("calls the mutation with the correct text and projectId", async () => {
      const { result } = renderHook(() => useTask("p1"));

      await act(async () => {
        await result.current.handleAddTask({ text: "New task" });
      });

      expect(mockMutate).toHaveBeenCalledWith({
        variables: { text: "New task", projectId: "p1" },
      });
    });

    it("calls refetch after the mutation resolves", async () => {
      const { result } = renderHook(() => useTask("p1"));

      await act(async () => {
        await result.current.handleAddTask({ text: "New task" });
      });

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  // ── handleDeleteSelectedTasks ─────────────────────────────────────────────

  describe("handleDeleteSelectedTasks", () => {
    it("calls the mutation with the currently selected task IDs", async () => {
      const { result } = renderHook(() => useTask("p1"));

      act(() => {
        result.current.setSelectedTasks(["t1", "t2"]);
      });

      await act(async () => {
        await result.current.handleDeleteSelectedTasks();
      });

      expect(mockMutate).toHaveBeenCalledWith({
        variables: { taskIds: ["t1", "t2"] },
      });
    });

    it("resets selectedTasks to empty after deletion", async () => {
      const { result } = renderHook(() => useTask("p1"));

      act(() => {
        result.current.setSelectedTasks(["t1"]);
      });

      await act(async () => {
        await result.current.handleDeleteSelectedTasks();
      });

      expect(result.current.selectedTasks).toEqual([]);
    });

    it("resets selectedOption back to 'allTasks' after deletion", async () => {
      const { result } = renderHook(() => useTask("p1"));

      act(() => {
        result.current.setSelectedOption("completedTasks");
        result.current.setSelectedTasks(["t2"]);
      });

      await act(async () => {
        await result.current.handleDeleteSelectedTasks();
      });

      expect(result.current.selectedOption).toBe("allTasks");
    });

    it("calls refetch after deletion", async () => {
      const { result } = renderHook(() => useTask("p1"));

      act(() => {
        result.current.setSelectedTasks(["t1"]);
      });

      await act(async () => {
        await result.current.handleDeleteSelectedTasks();
      });

      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});