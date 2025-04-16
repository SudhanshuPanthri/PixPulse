import { spawn } from "child_process";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fileUrl, labels } = await req.json();
    if (!fileUrl || !labels || !Array.isArray(labels)) {
      return NextResponse.json(
        {
          error: "fileUrl and labels are required and labels must be an array",
        },
        { status: 400 }
      );
    }

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn("python3", [
        "./services/grounding_dino.py",
        fileUrl,
        ...labels,
      ]);

      let output = "";
      let error = "";
      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });
      console.log(output);

      pythonProcess.stderr.on("data", (data) => {
        error += data.toString();
      });
      console.log(error);

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            resolve(NextResponse.json({ result }));
          } catch (err) {
            reject(
              NextResponse.json(
                { error: "Failed to parse output" },
                { status: 500 }
              )
            );
          }
        } else {
          reject(NextResponse.json({ error: error }));
        }
      });
    });
  } catch (error) {
    console.error("Error calling GroundingDINO:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
