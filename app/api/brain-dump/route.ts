import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { text, userId } = await req.json()

    if (!text || !userId) {
      return NextResponse.json({ error: "Missing text or userId" }, { status: 400 })
    }

    // Process with OpenAI
    const { text: processedText } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an AI assistant that helps students organize their thoughts into structured data. 
      Analyze the student's brain dump and extract:
      1. Tasks with priorities (high/medium/low) and due dates
      2. Events and recurring schedules
      3. Projects with steps
      4. Notes and study materials
      5. Subjects mentioned
      
      Return ONLY valid JSON in this exact format:
      {
        "todos": [{"id": "uuid", "text": "string", "due": "string or null", "priority": "high|medium|low", "completed": false, "subject": "string or null"}],
        "projects": [{"id": "uuid", "name": "string", "steps": [{"id": "uuid", "text": "string", "completed": false}]}],
        "events": [{"id": "uuid", "name": "string", "time": "string", "recurring": true|false}],
        "notes": [{"id": "uuid", "content": "string", "subject": "string or null"}],
        "subjects": ["string"]
      }
      
      Guidelines:
      - Extract specific due dates when mentioned (e.g., "May 30", "Friday", "next week")
      - Assign priorities based on urgency and importance
      - Identify recurring events (classes, meetings)
      - Group related tasks into projects when appropriate
      - Categorize by academic subjects when possible`,
      prompt: `Please analyze this student brain dump and organize it into structured data: "${text}"`,
    })

    // Parse the AI response
    let processedData
    try {
      // Clean the response to ensure it's valid JSON
      const cleanedText = processedText.replace(/```json\n?|\n?```/g, "").trim()
      processedData = JSON.parse(cleanedText)
    } catch (e) {
      console.error("JSON parsing failed:", e)
      // Fallback structure
      processedData = {
        todos: [
          {
            id: crypto.randomUUID(),
            text: "Review and organize extracted content",
            due: "Today",
            priority: "medium",
            completed: false,
            subject: "General",
          },
        ],
        projects: [],
        events: [],
        notes: [
          {
            id: crypto.randomUUID(),
            content: text.substring(0, 200) + "...",
            subject: "General",
          },
        ],
        subjects: ["General"],
      }
    }

    // Save to Supabase
    const { error: brainDumpError } = await supabase.from("brain_dumps").insert({
      user_id: userId,
      raw_text: text,
      processed_data: processedData,
    })

    if (brainDumpError) {
      console.error("Error saving brain dump:", brainDumpError)
    }

    // Save individual items to their respective tables
    if (processedData.todos?.length > 0) {
      const tasks = processedData.todos.map((todo: any) => ({
        user_id: userId,
        text: todo.text,
        completed: todo.completed,
        priority: todo.priority,
        due_date: todo.due,
        subject: todo.subject,
      }))

      const { error: tasksError } = await supabase.from("tasks").insert(tasks)
      if (tasksError) {
        console.error("Error saving tasks:", tasksError)
      }
    }

    if (processedData.notes?.length > 0) {
      const notes = processedData.notes.map((note: any) => ({
        user_id: userId,
        title: note.content.substring(0, 50) + (note.content.length > 50 ? "..." : ""),
        content: note.content,
        subject: note.subject,
        tags: [],
      }))

      const { error: notesError } = await supabase.from("notes").insert(notes)
      if (notesError) {
        console.error("Error saving notes:", notesError)
      }
    }

    return NextResponse.json({
      success: true,
      data: processedData,
      message: "Brain dump processed successfully!",
    })
  } catch (error) {
    console.error("Error processing brain dump:", error)
    return NextResponse.json({ error: "Failed to process brain dump" }, { status: 500 })
  }
}
