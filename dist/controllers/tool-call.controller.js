
const getProductByCategoryName = (categoryName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.default.find({ "category.name": categoryName });
        if (!products.length) {
            return "No products found for the specified category";
        }
        return products;
    }
    catch (error) {
        console.log(error);
        return "Internal server error";
    }
});


const toolCalling = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        const response = yield config_1.openai.responses.create({
            model: "gpt-5",
            input: message,
            tools: [
                {
                    type: "function",
                    strict: true,
                    name: "searchProductsByCategory",
                    description: "Search products by category such as laptops, phones, shoes, watches",
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
        const toolCall = response.output.find((item) => item.type === "function_call");
        if (!toolCall) {
            res.json({
                answer: response.output_text,
            });
            return;
        }
        const args = JSON.parse(toolCall.arguments);
        let toolResult;
        if (toolCall.name === "searchProductsByCategory") {
            toolResult = yield getProductByCategoryName(args.categoryName);
        }
        const finalResponse = yield config_1.openai.responses.create({
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
        res.json({
            answer: finalResponse.output_text,
        });
        return;
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.toolCalling = toolCalling;
