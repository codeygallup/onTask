import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  calculateProjectProgress,
  useProjectStats,
} from "../useProjectStats";
import type { Project, Task } from "../../types";

// ─── Helpers ────────────────────────────────────────────────────────────────

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  _id: "t1",
  text: "Test task",
  complete: false,
  projectId: "p1",
  ...overrides,
});

const makeProject = (overrides: Partial<Project> = {}): Project => ({
  _id: "p1",
  title: "Test Project",
  description: "A test project",
  userId: "u1",
  tasks: [],
  ...overrides,
});

// ─── calculateProjectProgress ────────────────────────────────────────────────

describe("calculateProjectProgress", () => {
  it("returns 0 for a project with no tasks", () => {
    expect(calculateProjectProgress(makeProject())).toBe(0);
  });

  it("returns 0 when no tasks are complete", () => {
    const project = makeProject({
      tasks: [
        makeTask({ _id: "t1", complete: false }),
        makeTask({ _id: "t2", complete: false }),
      ],
    });
    expect(calculateProjectProgress(project)).toBe(0);
  });

  it("returns 100 when all tasks are complete", () => {
    const project = makeProject({
      tasks: [
        makeTask({ _id: "t1", complete: true }),
        makeTask({ _id: "t2", complete: true }),
      ],
    });
    expect(calculateProjectProgress(project)).toBe(100);
  });

  it("returns 50 when half the tasks are complete", () => {
    const project = makeProject({
      tasks: [
        makeTask({ _id: "t1", complete: true }),
        makeTask({ _id: "t2", complete: false }),
      ],
    });
    expect(calculateProjectProgress(project)).toBe(50);
  });

  it("rounds down to nearest integer", () => {
    // 1/3 = 33.33... → 33
    const project = makeProject({
      tasks: [
        makeTask({ _id: "t1", complete: true }),
        makeTask({ _id: "t2", complete: false }),
        makeTask({ _id: "t3", complete: false }),
      ],
    });
    expect(calculateProjectProgress(project)).toBe(33);
  });

  it("rounds up to nearest integer", () => {
    // 2/3 = 66.66... → 67
    const project = makeProject({
      tasks: [
        makeTask({ _id: "t1", complete: true }),
        makeTask({ _id: "t2", complete: true }),
        makeTask({ _id: "t3", complete: false }),
      ],
    });
    expect(calculateProjectProgress(project)).toBe(67);
  });

  it("handles a project with undefined tasks", () => {
    const project = makeProject({ tasks: undefined });
    expect(calculateProjectProgress(project)).toBe(0);
  });
});

// ─── useProjectStats ─────────────────────────────────────────────────────────

describe("useProjectStats", () => {
  describe("with no projects", () => {
    it("returns all zeros", () => {
      const { result } = renderHook(() => useProjectStats([]));
      expect(result.current.totalTasks).toBe(0);
      expect(result.current.completedTasks).toBe(0);
      expect(result.current.progressPercentage).toBe(0);
    });

    it("returns an empty recentProjects array", () => {
      const { result } = renderHook(() => useProjectStats([]));
      expect(result.current.recentProjects).toEqual([]);
    });
  });

  describe("totalTasks", () => {
    it("sums tasks across all projects", () => {
      const projects = [
        makeProject({
          _id: "p1",
          tasks: [makeTask({ _id: "t1" }), makeTask({ _id: "t2" })],
        }),
        makeProject({
          _id: "p2",
          tasks: [makeTask({ _id: "t3" })],
        }),
      ];
      const { result } = renderHook(() => useProjectStats(projects));
      expect(result.current.totalTasks).toBe(3);
    });

    it("handles projects with no tasks", () => {
      const projects = [
        makeProject({ _id: "p1", tasks: [] }),
        makeProject({ _id: "p2", tasks: [makeTask()] }),
      ];
      const { result } = renderHook(() => useProjectStats(projects));
      expect(result.current.totalTasks).toBe(1);
    });

    it("handles projects with undefined tasks", () => {
      const projects = [
        makeProject({ _id: "p1", tasks: undefined }),
        makeProject({ _id: "p2", tasks: [makeTask()] }),
      ];
      const { result } = renderHook(() => useProjectStats(projects));
      expect(result.current.totalTasks).toBe(1);
    });
  });

  describe("completedTasks", () => {
    it("counts only completed tasks across all projects", () => {
      const projects = [
        makeProject({
          _id: "p1",
          tasks: [
            makeTask({ _id: "t1", complete: true }),
            makeTask({ _id: "t2", complete: false }),
          ],
        }),
        makeProject({
          _id: "p2",
          tasks: [
            makeTask({ _id: "t3", complete: true }),
            makeTask({ _id: "t4", complete: true }),
          ],
        }),
      ];
      const { result } = renderHook(() => useProjectStats(projects));
      expect(result.current.completedTasks).toBe(3);
    });

    it("returns 0 when no tasks are complete", () => {
      const projects = [
        makeProject({
          tasks: [
            makeTask({ _id: "t1", complete: false }),
            makeTask({ _id: "t2", complete: false }),
          ],
        }),
      ];
      const { result } = renderHook(() => useProjectStats(projects));
      expect(result.current.completedTasks).toBe(0);
    });
  });

  describe("progressPercentage", () => {
    it("returns the correct overall percentage", () => {
      const projects = [
        makeProject({
          tasks: [
            makeTask({ _id: "t1", complete: true }),
            makeTask({ _id: "t2", complete: true }),
            makeTask({ _id: "t3", complete: false }),
            makeTask({ _id: "t4", complete: false }),
          ],
        }),
      ];
      const { result } = renderHook(() => useProjectStats(projects));
      expect(result.current.progressPercentage).toBe(50);
    });

    it("returns 0 when there are no tasks", () => {
      const { result } = renderHook(() => useProjectStats([]));
      expect(result.current.progressPercentage).toBe(0);
    });

    it("returns 100 when all tasks are complete", () => {
      const projects = [
        makeProject({
          tasks: [
            makeTask({ _id: "t1", complete: true }),
            makeTask({ _id: "t2", complete: true }),
          ],
        }),
      ];
      const { result } = renderHook(() => useProjectStats(projects));
      expect(result.current.progressPercentage).toBe(100);
    });
  });

  describe("recentProjects", () => {
    it("sorts projects by lastOpenedAt descending", () => {
      const projects = [
        makeProject({ _id: "p1", lastOpenedAt: "1000" }),
        makeProject({ _id: "p2", lastOpenedAt: "3000" }),
        makeProject({ _id: "p3", lastOpenedAt: "2000" }),
      ];
      const { result } = renderHook(() => useProjectStats(projects));
      expect(result.current.recentProjects.map((p) => p._id)).toEqual([
        "p2",
        "p3",
        "p1",
      ]);
    });

    it("returns at most 3 projects", () => {
      const projects = Array.from({ length: 5 }, (_, i) =>
        makeProject({ _id: `p${i}`, lastOpenedAt: String(i * 1000) })
      );
      const { result } = renderHook(() => useProjectStats(projects));
      expect(result.current.recentProjects).toHaveLength(3);
    });

    it("handles projects with no lastOpenedAt", () => {
      const projects = [
        makeProject({ _id: "p1", lastOpenedAt: undefined }),
        makeProject({ _id: "p2", lastOpenedAt: "5000" }),
      ];
      const { result } = renderHook(() => useProjectStats(projects));
      // p2 should come first since p1 falls back to epoch (0)
      expect(result.current.recentProjects[0]._id).toBe("p2");
    });

    it("does not mutate the original projects array", () => {
      const projects = [
        makeProject({ _id: "p1", lastOpenedAt: "1000" }),
        makeProject({ _id: "p2", lastOpenedAt: "3000" }),
      ];
      const originalOrder = projects.map((p) => p._id);
      renderHook(() => useProjectStats(projects));
      expect(projects.map((p) => p._id)).toEqual(originalOrder);
    });
  });
});