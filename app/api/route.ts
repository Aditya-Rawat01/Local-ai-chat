
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig:{
    maxOutputTokens: 250, // capped output tokens so the free tier dont get exhausted    :`)
    temperature: 0.7
} });
 

export async function POST(req:NextRequest) {
    const body= await req.json()
    try {
        const prompt=body.prompt
        const messHistory=body.history
        const chat = model.startChat({
            history: messHistory.map((index:any)=>({ //remember last 11 messages, 1st message role cannot be "model"
                role: index.type === "user" ? "user" : "model",
                parts: [{ text: index.message }]
            }))
        })
        
        let result=await chat.sendMessage(prompt)
        
        return NextResponse.json({
            msg:result.response.text()
        })
    } catch (error) {
        return NextResponse.json({
            msg:"Error : "+ error
        })
    }
    
}