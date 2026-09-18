import OpenAI from 'openai';
import { testEO } from './testText.js';

export const openai = new OpenAI();

export const categorizerAIAgent = async (text, document_id, document_title) => {
    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-5.4-nano-2026-03-17',
        messages: [
            ...categorizePrompt,
            { role: "user", content: `Document Title: ${document_title}\n\n Document ID: ${document_id}\n\n Policy Text:\n ${text}` }
        ],
        response_format: categoriesSchema,
    });
    console.log("model: " + JSON.stringify(chatCompletion.model))
    console.log("policy text length: " + text.length)
    console.log("usage: " + JSON.stringify(chatCompletion.usage))
    return JSON.parse(chatCompletion.choices[0].message.content)
};

const categoriesSchema = {
    type: "json_schema",
    json_schema: {
        name: "policy_categories",
        schema: {
            type: "object",
            properties: {
                document_id: {type: "string"},
                document_title: {type: "string"},
                taxonomy: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            category: {type: "string"},
                            subcategory: {type: "string"},
                            confidence: {type: "number"},
                            excerpt: {type: "string"}
                        },
                        required: ["category", "subcategory", "confidence", "excerpt"],
                        additionalProperties: false
                    }
                }
            },
            required: ["document_id", "document_title", "taxonomy"],
            additionalProperties: false
        },
        strict: true
    }
};

export const categorizePrompt = [
    {
        role: "system",
        content: `
You are a Policy and Data Extraction Agent.
You are being given a policy text.
The text is either a federal executive order from the whitehouse or from the state of Nevada's governor.
It could also be a proposed piece of legislation either from either federal or state level (Nevada) congress or assemblies. 
Your sole purpose is to analyze the text and objectively map them to appropriate policy taxonomies.
Your likely audience is researchers, lawyers, journalists, and policy makers.

Your task is to:
1. Provide an impartial, unbiased, highly deterministic analysis of the policy text provided.
2. Identify precisely which policy domains and subdomains the text legislates or impacts.
3. Assign a strict confidence value between 0.0 and 1.0 (e.g., 0.87) based on how explicitly the policy addresses the category.
4. Extract a verbatim quote from the text that proves and justifies your classification. Do not summarize; use exact words.
5. If the document introduces novel policy areas that do not fit the reference taxonomy, invent a concise "Emergent" category.
6. CRITICAL: If the provided text is garbage, testing gibberish, unrelated to policy, or lacks meaningful content related to policy and governance, do not categorize it or force an "Emergent" category. You MUST return an empty taxonomy array [].

Output Rules:
- You must follow the exact JSON schema provided by the system.
- Do not provide conversational filler, history, or opinions. Your output must be purely structural data.

Reference Taxonomy:
Use and adapt from the following core taxonomy.

{
"Economy & Trade": ["Labor & Employment", "Taxes", "International Trade", "Manufacturing", "Antitrust"],
"Environment & Energy": ["Climate Policy", "Conservation", "Fossil Fuels", "Renewables", "Infrastructure"],
"National Security": ["Defense", "Intelligence", "Cybersecurity", "Foreign Policy", "Border Security"],
"Justice & Rights": ["Civil Rights", "Criminal Justice", "Immigration", "Voting Rights", "Privacy"],
"Health & Society": ["Public Health", "Education", "Housing", "Social Safety Net", "Technology Regulation"]
}`
    }

];

const result = await categorizerAIAgent(
    testEO.text,
    testEO.document_id,
    testEO.document_title
);

console.log(JSON.stringify(result, null, 2));