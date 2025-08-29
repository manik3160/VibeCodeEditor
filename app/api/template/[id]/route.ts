import {
  readTemplateStructureFromJson,
  saveTemplateStructureToJson,
} from "@/features/playground/libs/path-to-json";
import { db } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import path from "path";
import fs from "fs/promises";
import { NextRequest } from "next/server";

function validateJsonStructure(data: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(data)); // Ensures it's serializable
    return true;
  } catch (error) {
    console.error("Invalid JSON structure:", error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params is async in Next 15
) {
  const { id } = await context.params; // ✅ must await

  if (!id) {
    return Response.json({ error: "Missing playground ID" }, { status: 400 });
  }

  const playground = await db.playground.findUnique({
    where: { id },
  });

  if (!playground) {
    return Response.json({ error: "Playground not found" }, { status: 404 });
  }

  const templateKey = playground.template as keyof typeof templatePaths;
  const templatePath = templatePaths[templateKey];

  if (!templatePath) {
    return Response.json({ error: "Invalid template" }, { status: 404 });
  }

  try {
    // ✅ Ensure path resolution is correct
    const inputPath = path.join(process.cwd(), templatePath);
    const outputFile = path.join(process.cwd(), `output/${templateKey}.json`);

    // Check that the template directory actually exists
    try {
      await fs.access(inputPath);
    } catch {
      return Response.json(
        { error: `Template directory missing at ${inputPath}` },
        { status: 500 }
      );
    }

    await saveTemplateStructureToJson(inputPath, outputFile);
    const result = await readTemplateStructureFromJson(outputFile);

    if (!validateJsonStructure(result.items)) {
      return Response.json({ error: "Invalid JSON structure" }, { status: 500 });
    }

    await fs.unlink(outputFile);

    return Response.json(
      { success: true, templateJson: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating template JSON:", error);
    return Response.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}
