import { Request, Response, NextFunction } from "express";
import { openai } from "../config";
import Product from "../models/product.model";

const getProductByCategoryName = async (categoryName: string) => {
  try {
    const products = await Product.find({
      "category.name": categoryName,
    });

    if (!products.length) {
      return "No products found for the specified category";
    }

    return products;
  } catch (error) {
    console.error(error);
    return "Internal server error";
  }
};

export const toolCalling = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { message } = req.body;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: message,
      tools: [
        {
          type: "function",
          strict: true,
          name: "searchProductsByCategory",
          description:
            "Search products by category such as laptops, phones, shoes, watches",
          parameters: {
            type: "object",
            properties: {
              categoryName: {
                type: "string",
                description: "Product category name",
              },
            },
            required: ["categoryName"],
          },
        },
      ],
    });

    const toolCall = response.output.find(
      (item) => item.type === "function_call",
    );

    if (!toolCall) {
      return res.json({
        answer: response.output_text,
      });
    }

    const args = JSON.parse(toolCall.arguments);

    let toolResult;

    if (toolCall.name === "searchProductsByCategory") {
      toolResult = await getProductByCategoryName(args.categoryName);
    }

    const finalResponse = await openai.responses.create({
      model: "gpt-5",
      previous_response_id: response.id,
      input: [
        {
          type: "function_call_output",
          call_id: toolCall.call_id,
          output: JSON.stringify(toolResult),
        },
      ],
    });

    return res.json({
      answer: finalResponse.output_text,
      toolResult, // optional, useful for frontend UI
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
