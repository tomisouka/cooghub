import { describe, it, expect } from "vitest";
import { validate, detectCourse } from "./upload.js";

describe("detectCourse", () => {
  it("finds a course id directly in the filename", () => {
    expect(detectCourse("automata_hw3_notes.md")).toBe("automata");
  });

  it("resolves a numeric course code alias", () => {
    expect(detectCourse("3320_notes.md")).toBe("algos");
  });

  it("returns null when nothing matches", () => {
    expect(detectCourse("random_file_name.md")).toBeNull();
  });
});

describe("validate", () => {
  it("rejects unsupported file extensions", () => {
    const result = validate("notes.docx", Buffer.from("hello"));
    expect(result.status).toBe("rejected");
    expect(result.reason).toMatch(/Unsupported type/);
  });

  it("rejects files with no detectable course id", () => {
    const result = validate("random_notes.md", Buffer.from("hello"));
    expect(result.status).toBe("rejected");
    expect(result.reason).toMatch(/No course ID found/);
  });

  it("accepts a valid file with a course id in the filename", () => {
    const result = validate("automata_notes_unique_test_file.md", Buffer.from("hello"));
    expect(result.status).toBe("ok");
    expect(result.courseId).toBe("automata");
    expect(result.inferredFrom).toBe("filename");
  });

  it("falls back to the zip name for course detection", () => {
    const result = validate("weekly_notes_unique_test_file.md", Buffer.from("hello"), "automata_week3.zip");
    expect(result.status).toBe("ok");
    expect(result.courseId).toBe("automata");
    expect(result.inferredFrom).toBe("zip name");
  });

  it("skips macOS metadata and directory entries", () => {
    expect(validate("__MACOSX/foo.md", Buffer.from("x")).status).toBe("skip");
    expect(validate(".DS_Store", Buffer.from("x")).status).toBe("skip");
    expect(validate("automata/", Buffer.from("x")).status).toBe("skip");
  });
});