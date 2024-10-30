import { GoogleGenerativeAI } from "@google/generative-ai";


export const chat = async (req, res) => {
    try {
        const { prompt } = req.body;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const{response}= await model.generateContent(prompt);

        const result = response.text();

        res.json({ success: true, result});
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }

}
